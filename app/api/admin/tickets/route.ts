import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";

// GET /api/admin/tickets : liste tous les tickets (admin only)
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;
    const status = url.searchParams.get("status") || undefined;
    const eventId = url.searchParams.get("eventId") || undefined;
    const ticketTypeId = url.searchParams.get("ticketTypeId") || undefined;
    const userId = url.searchParams.get("userId") || undefined;
    const q = url.searchParams.get("q") || undefined;
    const where: any = {};
    if (status) where.status = status.toUpperCase();
    if (eventId) where.eventId = eventId;
    if (ticketTypeId) where.ticketTypeId = ticketTypeId;
    if (userId) where.order = { userId };
    if (q) where.qrCode = { contains: q, mode: "insensitive" };
    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        include: {
          event: { select: { id: true, title: true } },
          ticketType: { select: { id: true, name: true } },
          order: { select: { id: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.ticket.count({ where }),
    ]);
    return NextResponse.json({ tickets, total, page, limit });
  } catch (error) {
    console.error("Error fetching tickets:", error);
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

// POST /api/admin/tickets : créer un ticket (admin only)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }
  try {
    const body = await req.json();
    let { qrCode, status, eventId, ticketTypeId, orderId } = body;
    // Vérification des champs obligatoires
    if (!eventId || !ticketTypeId || !orderId) {
      return new NextResponse(
        JSON.stringify({
          error: "eventId, ticketTypeId et orderId sont obligatoires",
        }),
        { status: 400 }
      );
    }
    // Vérification existence des foreign keys
    const [event, ticketType, order] = await Promise.all([
      prisma.event.findUnique({ where: { id: eventId } }),
      prisma.ticketType.findUnique({ where: { id: ticketTypeId } }),
      prisma.order.findUnique({ where: { id: orderId } }),
    ]);
    if (!event)
      return new NextResponse(
        JSON.stringify({ error: "Événement introuvable" }),
        { status: 404 }
      );
    if (!ticketType)
      return new NextResponse(
        JSON.stringify({ error: "Type de billet introuvable" }),
        { status: 404 }
      );
    if (!order)
      return new NextResponse(
        JSON.stringify({ error: "Commande introuvable" }),
        { status: 404 }
      );
    // Génération automatique du QR code si non fourni
    if (!qrCode) {
      qrCode = `${eventId}-${ticketTypeId}-${orderId}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;
    }
    // Vérification unicité du QR code
    const existing = await prisma.ticket.findUnique({ where: { qrCode } });
    if (existing) {
      return new NextResponse(
        JSON.stringify({ error: "QR code déjà utilisé, veuillez réessayer" }),
        { status: 409 }
      );
    }
    // Validation du statut
    const allowedStatus = ["VALID", "USED", "INVALID"];
    if (status && !allowedStatus.includes(status)) {
      return new NextResponse(
        JSON.stringify({ error: "Statut de ticket invalide" }),
        { status: 400 }
      );
    }
    const ticket = await prisma.ticket.create({
      data: {
        qrCode,
        name: "",
        status: status || "VALID",
        event: {
          connect: {
            id: eventId,
          },
        },
        ticketType: {
          connect: {
            id: ticketTypeId,
          },
        },
        order: {
          connect: {
            id: orderId,
          },
        },
      },
    });
    console.log(
      `Ticket créé (id=${ticket.id}, qrCode=${ticket.qrCode}) par admin ${session.user.email}`
    );
    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error("Error creating ticket:", error);
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
