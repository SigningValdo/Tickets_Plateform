import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export const runtime = "nodejs";

/**
 * GET /api/user/orders
 * Récupère les commandes en attente de l'utilisateur connecté
 */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Vous devez être connecté" },
      { status: 401 }
    );
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
        status: "PENDING",
      },
      include: {
        tickets: {
          include: {
            event: {
              select: {
                id: true,
                title: true,
                date: true,
                location: true,
                city: true,
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
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des commandes" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user/orders
 * Annule une commande en attente
 */
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Vous devez être connecté" },
      { status: 401 }
    );
  }

  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "ID de commande manquant" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id,
        status: "PENDING",
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Commande introuvable" },
        { status: 404 }
      );
    }

    await prisma.$transaction([
      prisma.ticket.updateMany({
        where: { orderId },
        data: { status: "CANCELLED" },
      }),
      prisma.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'annulation" },
      { status: 500 }
    );
  }
}
