import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export const runtime = "nodejs";

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/user/tickets/[id]
 * Récupère les détails d'un billet spécifique
 */
export async function GET(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Vous devez être connecté pour voir ce billet" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
            location: true,
            address: true,
            city: true,
            country: true,
            organizer: true,
            imageUrl: true,
          },
        },
        ticketType: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
        order: {
          select: {
            id: true,
            userId: true,
            totalAmount: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Billet non trouvé" },
        { status: 404 }
      );
    }

    // Verify the ticket belongs to the user
    if (!ticket.order || ticket.order.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Vous n'avez pas accès à ce billet" },
        { status: 403 }
      );
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du billet" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user/tickets/[id]
 * Annule un billet (change son statut en CANCELLED)
 */
export async function DELETE(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Vous devez être connecté pour annuler ce billet" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;

    // First, check if the ticket exists and belongs to the user
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        order: {
          select: {
            userId: true,
          },
        },
        event: {
          select: {
            date: true,
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Billet non trouvé" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (!ticket.order || ticket.order.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Vous n'avez pas accès à ce billet" },
        { status: 403 }
      );
    }

    // Check if already cancelled
    if (ticket.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Ce billet est déjà annulé" },
        { status: 400 }
      );
    }

    // Check if already used
    if (ticket.status === "USED") {
      return NextResponse.json(
        { error: "Ce billet a déjà été utilisé et ne peut pas être annulé" },
        { status: 400 }
      );
    }

    // Check if the event has already passed
    if (new Date(ticket.event.date) < new Date()) {
      return NextResponse.json(
        { error: "L'événement est déjà passé, le billet ne peut pas être annulé" },
        { status: 400 }
      );
    }

    // Update ticket status to CANCELLED
    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({
      message: "Billet annulé avec succès",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Error cancelling ticket:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'annulation du billet" },
      { status: 500 }
    );
  }
}
