import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const runtime = "nodejs";

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/tickets/[id]
// Returns ticket information
// Access controlled by:
// 1. QR code verification (qr param matches ticket qrCode)
// 2. Or ticket ID is accessed directly (for owner with the link)
export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const url = new URL(req.url);
    const qrParam = url.searchParams.get("qr");

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            date: true,
            location: true,
          },
        },
        ticketType: { select: { id: true, name: true, price: true } },
        order: { select: { id: true, totalAmount: true } },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // If qr param is provided, verify it matches (for scanner validation)
    if (qrParam && qrParam !== ticket.qrCode) {
      return NextResponse.json({ error: "Invalid QR code" }, { status: 403 });
    }

    // Return full ticket details for the ticket owner
    // The ticket link itself serves as proof of ownership
    return NextResponse.json({
      id: ticket.id,
      qrCode: ticket.qrCode,
      status: ticket.status,
      event: ticket.event,
      ticketType: ticket.ticketType,
      name: ticket.name,
      email: ticket.email,
      phone: ticket.phone,
      address: ticket.address,
      createdAt: ticket.createdAt,
      orderId: ticket.order?.id,
    });
  } catch (e) {
    console.error("Error fetching ticket:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
