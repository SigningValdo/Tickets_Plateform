import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export const runtime = "nodejs";

// GET: Liste toutes les catégories (admin only)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const categories = await prisma.eventCategory.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(categories);
}

// POST: Crée une nouvelle catégorie (admin uniquement)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const { name, description } = body;
  if (!name) {
    return NextResponse.json({ error: "Le nom est requis" }, { status: 400 });
  }
  try {
    const category = await prisma.eventCategory.create({
      data: { name, description },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating category:", error);
    if (error instanceof Error && "code" in error && (error as any).code === 'P2002') { // Prisma unique constraint failed
      return NextResponse.json({ error: "Une catégorie avec ce nom existe déjà." }, { status: 409 });
    }
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
