import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
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

  try {
    const body = await req.json();
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
    } = body;

    // Validation stricte des champs obligatoires
    if (
      !title ||
      !description ||
      !date ||
      !location ||
      !address ||
      !city ||
      !country ||
      !organizer ||
      !categoryId ||
      !ticketTypes ||
      !Array.isArray(ticketTypes) ||
      ticketTypes.length === 0
    ) {
      return new NextResponse(
        JSON.stringify({
          error: "Tous les champs obligatoires doivent être renseignés.",
        }),
        { status: 400 }
      );
    }

    if (
      !categoryId ||
      typeof categoryId !== "string" ||
      categoryId.length < 10
    ) {
      return new NextResponse(JSON.stringify({ error: "Catégorie invalide" }), {
        status: 400,
      });
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        address,
        city,
        country,
        organizer,
        imageUrl,
        authorId: session.user.id,
        categoryId: String(categoryId),
        ticketTypes: {
          create: ticketTypes.map((tt: any) => ({
            name: tt.name,
            price: parseFloat(tt.price),
            quantity: parseInt(tt.quantity, 10),
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
