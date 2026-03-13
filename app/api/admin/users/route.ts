import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export const runtime = "nodejs";

// GET /api/admin/users : liste tous les users (admin only)
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const url = new URL(request.url);
    const page = Math.max(parseInt(url.searchParams.get("page") || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "20", 10), 1), 100);
    const skip = (page - 1) * limit;
    const role = url.searchParams.get("role") || undefined;
    const status = url.searchParams.get("status") || undefined;
    const q = url.searchParams.get("q") || undefined;
    const where: any = {};
    if (role) where.role = role;
    if (status) where.status = status;
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ];
    }
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          // tickets: {
          //   select: {
          //     id: true,
          //     qrCode: true,
          //     status: true,
          //     eventId: true,
          //     ticketTypeId: true,
          //     orderId: true,
          //     createdAt: true,
          //     updatedAt: true,
          //   }
          // },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);
    return NextResponse.json({ users, total, page, limit });
  } catch (error) {
    console.error("Error fetching users:", error);
    try {
      console.error(
        "Error details:",
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
    } catch (e) {}
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import bcrypt from "bcryptjs";

// POST /api/admin/users : créer un user (admin only)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Accès refusé. Réservé aux administrateurs." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { name, email, password, role, status, image } = body;

    // Validation des champs obligatoires
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        {
          error: "Champs manquants",
          details:
            "Les champs suivants sont obligatoires: nom, email, mot de passe, rôle",
        },
        { status: 400 }
      );
    }

    // Validation du format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format d'email invalide" },
        { status: 400 }
      );
    }

    // Vérification de l'unicité de l'email
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: "Email déjà utilisé",
          details: "Un utilisateur avec cette adresse email existe déjà",
        },
        { status: 409 }
      );
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Création de l'utilisateur
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: role,
        status: status || "ACTIVE",
        image: image || null,
        emailVerified: null, // L'utilisateur devra vérifier son email
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        user,
        message: "Utilisateur créé avec succès",
      },
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Error creating user:", error);

    // Gestion spécifique des erreurs Prisma
    if (error instanceof Error && "code" in error && (error as any).code === "P2002") {
      return NextResponse.json(
        {
          error: "Erreur de contrainte unique",
          details: "Une contrainte d'unicité n'a pas été respectée",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Erreur serveur",
        details: "Une erreur est survenue lors de la création de l'utilisateur",
      },
      { status: 500 }
    );
  }
}
