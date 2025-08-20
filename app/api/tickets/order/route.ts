import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { placeMobileMoneyPayment } from "@/lib/mobile-money";

export const POST = async (req: Request) => {
  const body = (await req.json()) as {
    name: string;
    email: string;
    phone: string;
    address: string;
    tickets: { quantity: number; ticketTypeId: string }[];
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

  const total = result.data.tickets.reduce(
    (acc, ticket) => acc + ticket.quantity,
    0
  );

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

  try {
    const payment = await placeMobileMoneyPayment({
      orderId: order.id,
      amount: total,
      currency: "XOF",
      email: result.data.email,
      phone: result.data.phone,
      customer: result.data.name,
      description: "Payment for tickets",
      reference: order.id,
      callback: "http://localhost:3000/api/webhook",
      locked_currency: "XOF",
      locked_channel: "mobile_money",
      locked_country: "CM",
      items: result.data.tickets.map((ticket) => ({
        name: ticket.ticketTypeId,
        quantity: ticket.quantity,
        price: ticketsTypes.find(
          (ticketType) => ticketType.id === ticket.ticketTypeId
        )?.price,
      })),
      shipping: {
        name: "Shipping",
        price: 0,
      },
      address: {
        street: result.data.address,
        city: "Yaoundé",
        state: "Yaoundé",
        country: "CM",
        zip: "12345",
      },
      customer_meta: {
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone,
      },
    });

    if (!payment) {
      return new NextResponse(JSON.stringify({ error: "Payment failed" }), {
        status: 500,
      });
    }

    console.log({ payment });

    const redirectUrl = payment.authorization_url;
    if (!redirectUrl) {
      return new NextResponse(JSON.stringify({ error: "Payment failed" }), {
        status: 500,
      });
    }

    return NextResponse.redirect(new URL(redirectUrl, req.url));
  } catch (error) {
    console.error("Error creating order:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
      }
    );
  }
};
