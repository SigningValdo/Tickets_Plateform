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
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: eventData,
    })

    return NextResponse.json(updatedEvent)
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
