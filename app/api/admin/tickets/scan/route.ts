import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { TicketStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const qrCode = body.qrCode;

    // Add validation for qrCode
    if (!qrCode) {
      return NextResponse.json({ error: "QR Code is required" }, { status: 400 });
    }

    const existingTicket = await prisma.ticket.findFirst({
      where: {
        qrCode,
      },
    });

    if (!existingTicket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Check if ticket is already used
    if (existingTicket.status === TicketStatus.USED) {
      return NextResponse.json({ error: "Le ticket a déjà été utilisé" }, { status: 400 });
    }

    // Update the ticket status
    const updatedTicket = await prisma.ticket.update({
      where: {
        id: existingTicket.id,
      },
      data: {
        status: TicketStatus.USED,
        // // You might also want to track when it was scanned
        // scannedAt: new Date(),
      },
    });

    // Revalidate the path to refresh cached data
    revalidatePath("/admin/tickets");

    return NextResponse.json({
      message: "Ticket scanned successfully",
      ticket: {
        id: updatedTicket.id,
        status: updatedTicket.status,
      },
    });
  } catch (error) {
    console.error("Error updating ticket status:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" && error instanceof Error ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};
