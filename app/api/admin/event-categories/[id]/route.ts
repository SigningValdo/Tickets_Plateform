import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export const runtime = "nodejs";

// PUT: Modifier une catégorie (admin seulement)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json();
  const { name, description } = body;
  if (!name) {
    return NextResponse.json({ error: "Le nom est requis" }, { status: 400 });
  }
  try {
    const category = await prisma.eventCategory.update({
      where: { id },
      data: { name, description },
    });
    return NextResponse.json(category);
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && (error as any).code === "P2002") {
      return NextResponse.json(
        { error: "Une catégorie avec ce nom existe déjà." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// DELETE: Supprimer une catégorie (admin seulement)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  try {
    await prisma.eventCategory.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && (error as any).code === "P2003") {
      return NextResponse.json(
        {
          error:
            "Impossible de supprimer la catégorie car des événements y sont encore associés. Supprimez ou réassignez ces événements avant de réessayer.",
        },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  try {
    const category = await prisma.eventCategory.findFirst({ where: { id } });

    if (!category) {
      return NextResponse.json({ error: "Catégorie non trouvée" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
