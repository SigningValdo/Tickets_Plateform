import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";

export const runtime = "nodejs";

// GET: Liste toutes les catégories
export async function GET() {
  const categories = await prisma.eventCategory.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(categories);
}

// POST: Crée une nouvelle catégorie (admin uniquement)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }
  const body = await req.json();
  const { name, description } = body;
  if (!name) {
    return new NextResponse(JSON.stringify({ error: "Le nom est requis" }), { status: 400 });
  }
  try {
    const category = await prisma.eventCategory.create({
      data: { name, description },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.log({error})
    if (error.code === 'P2002') { // Prisma unique constraint failed
      return new NextResponse(JSON.stringify({ error: "Une catégorie avec ce nom existe déjà." }), { status: 409 });
    }
    return new NextResponse(JSON.stringify({ error: "Erreur interne" }), { status: 500 });
  }
}
