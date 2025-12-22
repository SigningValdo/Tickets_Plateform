import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import { sanitizeEventData } from "@/lib/sanitize";

export const runtime = "nodejs";

// import moment from "moment"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  // if (!session || session.user.role !== "ADMIN") {
  //   return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 })
  // }

  const searchParams = new URLSearchParams(req.url);
  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const dateFilter = searchParams.get("dateFilter");
  const locationFilter = searchParams.get("location");

  try {
    const events = await prisma.event.findMany({
      where: {
        title: {
          contains: search || "",
        },
        category: {
          name: {
            contains: category || "",
          },
        },
        date: {
          gte: dateFilter ? new Date(dateFilter) : undefined,
        },
        location: {
          contains: locationFilter || "",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        ticketTypes: true,
        category: true,
      },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  try {
    // Sanitize and validate input
    const sanitized = sanitizeEventData(body);

    if (!sanitized) {
      return NextResponse.json(
        { error: "Données invalides. Veuillez vérifier tous les champs obligatoires." },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      date,
      location,
      address,
      city,
      country,
      organizer,
      imageUrl,
      categoryId,
      ticketTypes,
    } = sanitized;

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        date,
        location,
        address,
        city,
        country,
        organizer,
        imageUrl,
        authorId: session.user.id,
        categoryId,
        ticketTypes: {
          create: ticketTypes.map((tt) => ({
            name: tt.name,
            price: tt.price,
            quantity: tt.quantity,
          })),
        },
      },
      include: {
        ticketTypes: true,
        category: true,
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    try {
      console.error(
        "Error details:",
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
    } catch (e) {
      console.error("Error stringify", e);
    }
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
