import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const runtime = "nodejs";

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/orders/[id]/tickets - list tickets for order
// This endpoint is accessed after payment confirmation
// The orderId acts as a temporary access token
export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;

    // Validate orderId format (should be a cuid)
    if (!id || id.length < 20) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const tickets = await prisma.ticket.findMany({
      where: { orderId: id },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            date: true,
            location: true,
            address: true,
          },
        },
        ticketType: { select: { id: true, name: true, price: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    // Return ticket data with QR codes only for the buyer
    // The orderId serves as verification that the user completed the order
    return NextResponse.json(
      tickets.map((t) => ({
        id: t.id,
        qrCode: t.qrCode,
        status: t.status,
        event: t.event,
        ticketType: t.ticketType,
        buyerName: t.name,
        // Only show masked email for confirmation
        maskedEmail: t.email ? maskEmail(t.email) : null,
        createdAt: t.createdAt,
      }))
    );
  } catch (e) {
    console.error("Error fetching order tickets:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Mask email for privacy: john.doe@example.com -> j***e@example.com
function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return "***@***";

  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }

  return `${localPart[0]}***${localPart[localPart.length - 1]}@${domain}`;
}
