import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";

export const runtime = "nodejs";

/**
 * GET /api/user/tickets
 * Récupère tous les billets de l'utilisateur connecté
 */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Vous devez être connecté pour voir vos billets" },
      { status: 401 }
    );
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
        status: "COMPLETED",
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
                address: true,
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

    // Flatten tickets from all orders
    const tickets = orders.flatMap((order) =>
      order.tickets.map((ticket) => ({
        ...ticket,
        orderId: order.id,
        orderDate: order.createdAt,
        orderTotal: order.totalAmount,
      }))
    );

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des billets" },
      { status: 500 }
    );
  }
}
