import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/db";

export const runtime = "nodejs";

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 })
  }

  try {
    const { id } = await params
    const event = await prisma.event.findUnique({
      where: { id },
      include: { ticketTypes: true },
    })

    if (!event) {
      return new NextResponse(JSON.stringify({ error: "Event not found" }), { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error(`Error fetching event`, error)
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 })
  }
}

export async function PUT(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 })
  }

  try {
    const body = await req.json()
    const { ticketTypes, ...eventData } = body
    const { id } = await params

    // Convert date string to Date object if provided
    if (eventData.date && typeof eventData.date === "string") {
      eventData.date = new Date(eventData.date)
    }

    // Update event data
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: eventData,
    })

    // Update ticket types if provided
    if (ticketTypes && Array.isArray(ticketTypes)) {
      // Get existing ticket types for this event
      const existingTicketTypes = await prisma.ticketType.findMany({
        where: { eventId: id },
      })

      const existingIds = existingTicketTypes.map((tt) => tt.id)
      const incomingIds = ticketTypes.filter((tt: any) => tt.id && !tt.id.toString().match(/^\d+$/)).map((tt: any) => tt.id)

      // Delete ticket types that are no longer in the list
      const toDelete = existingIds.filter((existingId) => !incomingIds.includes(existingId))
      if (toDelete.length > 0) {
        await prisma.ticketType.deleteMany({
          where: { id: { in: toDelete } },
        })
      }

      // Update or create ticket types
      for (const tt of ticketTypes) {
        const ticketData = {
          name: tt.name,
          price: parseFloat(tt.price) || 0,
          quantity: parseInt(tt.quantity) || 0,
        }

        // Check if it's an existing ticket type (has a valid cuid) or a new one
        const isNewTicket = !tt.id || tt.id.toString().match(/^\d+$/)

        if (isNewTicket) {
          // Create new ticket type
          await prisma.ticketType.create({
            data: {
              ...ticketData,
              eventId: id,
            },
          })
        } else {
          // Update existing ticket type
          await prisma.ticketType.update({
            where: { id: tt.id },
            data: ticketData,
          })
        }
      }
    }

    // Fetch updated event with ticket types
    const result = await prisma.event.findUnique({
      where: { id },
      include: { ticketTypes: true, category: true },
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error(`Error updating event`, error)
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 })
  }

  try {
    const { id } = await params
    // Delete dependents first to avoid FK violations
    await prisma.ticket.deleteMany({ where: { eventId: id } })
    await prisma.ticketType.deleteMany({ where: { eventId: id } })
    await prisma.event.delete({ where: { id } })

    return new NextResponse(null, { status: 204 })
  } catch (error: any) {
    if (error?.code === "P2003") {
      return new NextResponse(
        JSON.stringify({
          error:
            "Impossible de supprimer l'événement car des éléments y sont encore liés.",
        }),
        { status: 409 }
      )
    }
    console.error(`Error deleting event:`, error)
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 })
  }
}
