import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const runtime = "nodejs";

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * Public API to get event details
 * No authentication required
 */
export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        ticketTypes: true,
        category: true,
      },
    });

    if (!event) {
      return new NextResponse(JSON.stringify({ error: "Event not found" }), {
        status: 404,
      });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error(`Error fetching event`, error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
