import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { initNotchpayPayment } from "@/lib/notchpay";

export const runtime = "nodejs";

/**
 * POST /api/user/orders/retry
 * Relance le paiement d'une commande en attente
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Vous devez être connecté" },
      { status: 401 }
    );
  }

  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "ID de commande manquant" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id,
        status: "PENDING",
      },
      include: {
        tickets: {
          take: 1,
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Commande introuvable ou déjà traitée" },
        { status: 404 }
      );
    }

    const simulate = process.env.NEXT_PUBLIC_SIMULATE_PAYMENT === "true";

    if (simulate) {
      return NextResponse.json({
        redirectUrl: null,
        orderId: order.id,
        simulated: true,
      });
    }

    const ticket = order.tickets[0];
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const notchpayResponse = await initNotchpayPayment({
      orderId: order.id,
      amount: order.totalAmount,
      currency: "XAF",
      email: ticket?.email || session.user.email || "",
      phone: ticket?.phone || session.user.phone || "",
      name: ticket?.name || session.user.name || "",
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

    throw new Error("Failed to get payment URL");
  } catch (error: unknown) {
    console.error("Retry payment error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur lors du paiement" },
      { status: 500 }
    );
  }
}
