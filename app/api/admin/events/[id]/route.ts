import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/db"

interface Params {
  params: { id: string }
}

export async function GET(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 })
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: { ticketTypes: true },
    })

    if (!event) {
      return new NextResponse(JSON.stringify({ error: "Event not found" }), { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error(`Error fetching event ${params.id}:`, error)
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

    const updatedEvent = await prisma.event.update({
      where: { id: params.id },
      data: eventData,
    })

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error(`Error updating event ${params.id}:`, error)
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 })
  }

  try {
    // Prisma cascading delete will handle related TicketTypes, Tickets, etc.
    await prisma.event.delete({
      where: { id: params.id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error(`Error deleting event ${params.id}:`, error)
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 })
  }
}
