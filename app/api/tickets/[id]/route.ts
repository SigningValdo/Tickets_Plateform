import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// Public: GET /api/tickets/[id]
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      include: {
        event: { select: { id: true, title: true, imageUrl: true } },
        ticketType: { select: { id: true, name: true } },
        order: { select: { id: true } },
      },
    });
    if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

    // Count how many tickets were purchased in the same order
    const totalTickets = ticket.orderId
      ? await prisma.ticket.count({ where: { orderId: ticket.orderId } })
      : 1;

    // Return only safe fields
    return NextResponse.json({
      id: ticket.id,
      qrCode: ticket.qrCode,
      status: ticket.status,
      event: ticket.event,
      ticketType: ticket.ticketType,
      order: ticket.order,
      name: ticket.name,
      buyerName: ticket.name,
      email: ticket.email,
      phone: ticket.phone,
      address: ticket.address,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      totalTickets,
    });
  } catch (e) {
    console.error("Error fetching public ticket:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
