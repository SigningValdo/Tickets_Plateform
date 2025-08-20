import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";

// GET /api/admin/users : liste tous les users (admin only)
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
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
          password: true,
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
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

import bcrypt from "bcryptjs";

// POST /api/admin/users : créer un user (admin only)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse(
      JSON.stringify({ error: "Accès refusé. Réservé aux administrateurs." }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const body = await req.json();
    const { name, email, password, role, status, image } = body;

    // Validation des champs obligatoires
    if (!name || !email || !password || !role) {
      return new NextResponse(
        JSON.stringify({
          error: "Champs manquants",
          details:
            "Les champs suivants sont obligatoires: nom, email, mot de passe, rôle",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validation du format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new NextResponse(
        JSON.stringify({ error: "Format d'email invalide" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Vérification de l'unicité de l'email
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return new NextResponse(
        JSON.stringify({
          error: "Email déjà utilisé",
          details: "Un utilisateur avec cette adresse email existe déjà",
        }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
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
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Gestion spécifique des erreurs Prisma
    if (error.code === "P2002") {
      return new NextResponse(
        JSON.stringify({
          error: "Erreur de contrainte unique",
          details: "Une contrainte d'unicité n'a pas été respectée",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        error: "Erreur serveur",
        details: "Une erreur est survenue lors de la création de l'utilisateur",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
