import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db";

export const runtime = "nodejs";

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const { id } = await params
    const event = await prisma.event.findUnique({
      where: { id },
      include: { ticketTypes: true },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error(`Error fetching event`, error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { ticketTypes, ...eventData } = body
    const { id } = await params

    // Convert date string to Date object if provided
    if (eventData.date && typeof eventData.date === "string") {
      const parsed = new Date(eventData.date)
      if (isNaN(parsed.getTime())) {
        return NextResponse.json({ error: "Date invalide" }, { status: 400 })
      }
      eventData.date = parsed
    }

    // Wrap all mutations in a transaction for atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Update event data
      await tx.event.update({
        where: { id },
        data: eventData,
      })

      // Update ticket types if provided
      if (ticketTypes && Array.isArray(ticketTypes)) {
        const existingTicketTypes = await tx.ticketType.findMany({
          where: { eventId: id },
        })

        const existingIds = existingTicketTypes.map((tt) => tt.id)
        const incomingIds = ticketTypes
          .filter((tt: { id?: string }) => tt.id && !tt.id.toString().match(/^\d+$/))
          .map((tt: { id: string }) => tt.id)

        // Delete ticket types that are no longer in the list
        const toDelete = existingIds.filter((existingId) => !incomingIds.includes(existingId))
        if (toDelete.length > 0) {
          await tx.ticketType.deleteMany({
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

          const isNewTicket = !tt.id || tt.id.toString().match(/^\d+$/)

          if (isNewTicket) {
            await tx.ticketType.create({
              data: { ...ticketData, eventId: id },
            })
          } else {
            await tx.ticketType.update({
              where: { id: tt.id },
              data: ticketData,
            })
          }
        }
      }

      // Return updated event with relations
      return tx.event.findUnique({
        where: { id },
        include: { ticketTypes: true, category: true },
      })
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error(`Error updating event`, error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const { id } = await params
    // Delete dependents first to avoid FK violations
    await prisma.ticket.deleteMany({ where: { eventId: id } })
    await prisma.ticketType.deleteMany({ where: { eventId: id } })
    await prisma.event.delete({ where: { id } })

    return new NextResponse(null, { status: 204 })
  } catch (error: unknown) {
    if (error instanceof Object && "code" in error && error.code === "P2003") {
      return NextResponse.json(
        { error: "Impossible de supprimer l'événement car des éléments y sont encore liés." },
        { status: 409 }
      )
    }
    console.error(`Error deleting event:`, error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
