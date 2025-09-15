import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { initOrangeWebPayment } from "@/lib/orange-money";

export const POST = async (req: Request) => {
  const body = (await req.json()) as {
    name: string;
    email: string;
    phone: string;
    address: string;
    tickets: { quantity: number; ticketTypeId: string }[];
    paymentMethod?: "orange" | "mtn"; // optional payment method selector
  };

  const schema = z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
    tickets: z.array(
      z.object({
        quantity: z.number(),
        ticketTypeId: z.string(),
      })
    ),
    paymentMethod: z.enum(["orange", "mtn"]).optional(),
  });

  const result = schema.safeParse(body);

  if (!result.success) {
    return new NextResponse(JSON.stringify({ error: result.error }), {
      status: 400,
    });
  }

  const ticketsTypes = await prisma.ticketType.findMany({
    where: {
      id: {
        in: result.data.tickets.map((ticket) => ticket.ticketTypeId),
      },
    },
  });

  if (ticketsTypes.length !== result.data.tickets.length) {
    return new NextResponse(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
    });
  }

  // Compute total amount based on ticket prices
  const total = result.data.tickets.reduce((acc, ticket) => {
    const tt = ticketsTypes.find((t) => t.id === ticket.ticketTypeId);
    const price = tt?.price ?? 0;
    return acc + price * ticket.quantity;
  }, 0);

  if (total <= 0) {
    return new NextResponse(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
    });
  }

  const order = await prisma.order.create({
    data: {
      totalAmount: total,
      tickets: {
        create: result.data.tickets
          .map((ticket) =>
            Array.from({ length: ticket.quantity }, () => ticket)
          )
          .flat()
          .map((ticket) => ({
            qrCode: `QR-${ticket.ticketTypeId}-${
              ticket.quantity
            }-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            name: result.data.name,
            email: result.data.email,
            phone: result.data.phone,
            address: result.data.address,
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

  // SIMULATION ONLY: always short-circuit and return orderId without calling any PSP
  return NextResponse.json({ redirectUrl: null, orderId: order.id, simulated: true });
  /*
  // Real payment flow (disabled while simulating)
  try {
    // ... Orange Money implementation here ...
  } catch (error: any) {
    // ... error handling ...
  }
  */
};
