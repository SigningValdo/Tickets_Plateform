import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { use } from "react";

export const runtime = "nodejs";

interface Params {
  params: Promise<{ id: string }>;
}

// Public: GET /api/tickets/[id]
// Returns only non-sensitive ticket information
export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;

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
        ticketType: { select: { id: true, name: true } },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Return only PUBLIC safe fields - NO PII (email, phone, address)
    return NextResponse.json({
      id: ticket.id,
      status: ticket.status,
      event: ticket.event,
      ticketType: ticket.ticketType,
      // Only return first name initial for privacy
      buyerInitial: ticket.name ? ticket.name.charAt(0).toUpperCase() : null,
      createdAt: ticket.createdAt,
    });
  } catch (e) {
    console.error("Error fetching public ticket:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
