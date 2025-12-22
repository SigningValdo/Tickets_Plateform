import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { initNotchpayPayment } from "@/lib/notchpay";
import { sanitizeOrderData } from "@/lib/sanitize";
import { applyRateLimit, rateLimiters } from "@/lib/rate-limit";

export const runtime = "nodejs";

export const POST = async (req: Request) => {
  // Apply rate limiting for orders (10 per hour)
  const rateLimitResponse = applyRateLimit(req, rateLimiters.order);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  // Sanitize and validate input
  const sanitized = sanitizeOrderData(body);

  if (!sanitized) {
    return NextResponse.json(
      { error: "Données invalides. Veuillez vérifier vos informations." },
      { status: 400 }
    );
  }

  const { name, email, phone, address, tickets } = sanitized;

  const ticketsTypes = await prisma.ticketType.findMany({
    where: {
      id: {
        in: tickets.map((ticket) => ticket.ticketTypeId),
      },
    },
  });

  if (ticketsTypes.length !== tickets.length) {
    return NextResponse.json(
      { error: "Type de billet invalide" },
      { status: 400 }
    );
  }

  // Compute total amount based on ticket prices
  const total = tickets.reduce((acc, ticket) => {
    const tt = ticketsTypes.find((t) => t.id === ticket.ticketTypeId);
    const price = tt?.price ?? 0;
    return acc + price * ticket.quantity;
  }, 0);

  if (total <= 0) {
    return NextResponse.json(
      { error: "Montant invalide" },
      { status: 400 }
    );
  }

  const order = await prisma.order.create({
    data: {
      totalAmount: total,
      tickets: {
        create: tickets
          .map((ticket) =>
            Array.from({ length: ticket.quantity }, () => ticket)
          )
          .flat()
          .map((ticket) => ({
            qrCode: `QR-${ticket.ticketTypeId}-${
              ticket.quantity
            }-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            name,
            email,
            phone,
            address,
            event: {
              connect: {
                id: ticketsTypes[0].eventId,
              },
            },
            ticketType: {
              connect: {
                id: ticket.ticketTypeId,
              },
            },
          })),
      },
    },
  });

  const simulate = process.env.NEXT_PUBLIC_SIMULATE_PAYMENT === "true";

  // SIMULATION MODE: return orderId without calling Notchpay
  if (simulate) {
    return NextResponse.json({ redirectUrl: null, orderId: order.id, simulated: true });
  }

  // Real payment flow with Notchpay
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const notchpayResponse = await initNotchpayPayment({
      orderId: order.id,
      amount: total,
      currency: "XAF",
      email,
      phone,
      name,
      callbackUrl: `${baseUrl}/api/notchpay/callback`,
      description: `Commande ${order.id} - FanZone Tickets`,
    });

    if (notchpayResponse.authorization_url) {
      return NextResponse.json({
        redirectUrl: notchpayResponse.authorization_url,
        orderId: order.id,
        reference: notchpayResponse.transaction?.reference,
        simulated: false,
      });
    }

    throw new Error("Failed to get payment URL from Notchpay");
  } catch (error: any) {
    console.error("Notchpay payment initialization error:", error);
    return NextResponse.json(
      { error: error.message || "Payment initialization failed" },
      { status: 500 }
    );
  }
};
