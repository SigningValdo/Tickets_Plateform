import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { TicketStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }

  try {
    const body = await req.json();
    const qrCode = JSON.parse(body).qrCode;
    console.log("QR Code:", qrCode);

    // Add validation for qrCode
    if (!qrCode) {
      return new NextResponse(
        JSON.stringify({ error: "QR Code is required" }),
        {
          status: 400,
        }
      );
    }

    console.log("Looking for ticket with QR code:", qrCode);

    // First, let's check if the ticket exists at all
    const existingTicket = await prisma.ticket.findFirst({
      where: {
        qrCode,
      },
    });

    console.log("Existing ticket:", existingTicket);

    if (!existingTicket) {
      return new NextResponse(JSON.stringify({ error: "Ticket not found" }), {
        status: 404,
      });
    }

    // Check if ticket is already used
    if (existingTicket.status === TicketStatus.USED) {
      return new NextResponse(
        JSON.stringify({ error: "Le ticket a déjà été utilisé" }),
        {
          status: 400,
        }
      );
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

    console.log("Updated ticket:", updatedTicket);

    // Revalidate the path to refresh cached data
    revalidatePath("/admin/tickets");

    return new NextResponse(
      JSON.stringify({
        message: "Ticket scanned successfully",
        ticket: {
          id: updatedTicket.id,
          status: updatedTicket.status,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error updating ticket status:", error);

    return new NextResponse(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
