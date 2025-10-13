import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const runtime = "nodejs";

// Public: GET /api/orders/[id]/tickets - list tickets for order
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.order.findUnique({ where: { id: params.id } });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const tickets = await prisma.ticket.findMany({
      where: { orderId: params.id },
      include: {
        event: { select: { id: true, title: true, imageUrl: true } },
        ticketType: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(
      tickets.map((t) => ({
        id: t.id,
        qrCode: t.qrCode,
        status: t.status,
        event: t.event,
        ticketType: t.ticketType,
        name: t.name,
        email: t.email,
        phone: t.phone,
        address: t.address,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      }))
    );
  } catch (e) {
    console.error("Error fetching order tickets:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
