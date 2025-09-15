import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";

// PUT: Modifier une catégorie (admin seulement)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }
  const { id } = await params;
  const body = await req.json();
  const { name, description } = body;
  if (!name) {
    return new NextResponse(JSON.stringify({ error: "Le nom est requis" }), {
      status: 400,
    });
  }
  try {
    const category = await prisma.eventCategory.update({
      where: { id },
      data: { name, description },
    });
    return NextResponse.json(category);
  } catch (error: any) {
    if (error.code === "P2002") {
      return new NextResponse(
        JSON.stringify({ error: "Une catégorie avec ce nom existe déjà." }),
        { status: 409 }
      );
    }
    return new NextResponse(JSON.stringify({ error: "Erreur interne" }), {
      status: 500,
    });
  }
}

// DELETE: Supprimer une catégorie (admin seulement)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }
  const { id } = await params;
  try {
    await prisma.eventCategory.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error?.code === "P2003") {
      return new NextResponse(
        JSON.stringify({
          error:
            "Impossible de supprimer la catégorie car des événements y sont encore associés. Supprimez ou réassignez ces événements avant de réessayer.",
        }),
        { status: 409 }
      );
    }
    return new NextResponse(JSON.stringify({ error: "Erreur interne" }), {
      status: 500,
    });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }
  const { id } = await params;
  try {
    const category = await prisma.eventCategory.findFirst({ where: { id } });

    if (!category) {
      return new NextResponse(JSON.stringify({ error: "Ticket not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(category), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "Erreur interne" }), {
      status: 500,
    });
  }
}
