import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const [eventCount, userCount, ticketsSold] = await Promise.all([
      prisma.event.count(),
      prisma.user.count(),
      prisma.ticket.count({ where: { status: { in: ["VALID", "USED"] } } }),
    ]);
    return NextResponse.json({ eventCount, userCount, ticketsSold });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
