import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const date = searchParams.get("date");
  const locationFilter = searchParams.get("location");

  const parsedDate = date ? new Date(date) : null;
  const validDate = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : undefined;

  try {
    const events = await prisma.event.findMany({
      where: {
        title: {
          contains: search || "",
        },
        ...(category ? { categoryId: category } : {}),
        ...(validDate ? { date: { gte: validDate } } : {}),
        location: {
          contains: locationFilter || "",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        location: true,
        city: true,
        country: true,
        organizer: true,
        imageUrl: true,
        status: true,
        createdAt: true,
        ticketTypes: {
          select: {
            id: true,
            name: true,
            price: true,
            quantity: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
