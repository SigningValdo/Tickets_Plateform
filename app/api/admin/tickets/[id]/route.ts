import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";

// GET /api/admin/tickets/[id] : détail ticket (admin only)
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      include: {
        event: { select: { id: true, title: true, imageUrl: true } },
        ticketType: { select: { id: true, name: true } },
        order: { select: { id: true } },
      },
    });
    if (!ticket)
      return new NextResponse(JSON.stringify({ error: "Ticket not found" }), {
        status: 404,
      });
    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    try {
      console.error(
        "Error details:",
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
    } catch (e) {}
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

// PUT /api/admin/tickets/[id] : update ticket (admin only)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }
  try {
    const body = await req.json();
    const { qrCode, status, eventId, ticketTypeId, orderId } = body;
    if (!qrCode || !eventId || !ticketTypeId || !orderId) {
      return new NextResponse(
        JSON.stringify({ error: "Tous les champs sont obligatoires" }),
        { status: 400 }
      );
    }
    const ticket = await prisma.ticket.update({
      where: { id: params.id },
      data: { qrCode, status, eventId, ticketTypeId, orderId },
    });
    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    try {
      console.error(
        "Error details:",
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
    } catch (e) {}
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

// DELETE /api/admin/tickets/[id] : supprimer ticket (admin only)
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }
  try {
    await prisma.ticket.delete({ where: { id: params.id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    try {
      console.error(
        "Error details:",
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
    } catch (e) {}
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
