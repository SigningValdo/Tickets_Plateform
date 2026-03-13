import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export const runtime = "nodejs";

// GET /api/admin/users/[id] : détail user (admin only)
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Vérification de l'authentification et des droits admin
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json(
      {
        error: "Accès refusé",
        details:
          "Vous devez être administrateur pour accéder à cette ressource",
      },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;
    // Récupération de l'utilisateur avec ses relations
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            // tickets: true,
            // orders: true,
          },
        },
        // tickets: {
        //   select: {
        //     id: true,
        //     status: true,
        //     ticketType: {
        //       select: {
        //         id: true,
        //         name: true,
        //         price: true,
        //         event: {
        //           select: {
        //             id: true,
        //             title: true,
        //             date: true,
        //           },
        //         },
        //       },
        //     },
        //     createdAt: true,
        //   },
        //   orderBy: { createdAt: "desc" },
        //   take: 5, // Limite à 5 derniers billets
        // },
        // orders: {
        //   select: {
        //     id: true,
        //     totalAmount: true,
        //     status: true,
        //     createdAt: true,
        //     tickets: {
        //       select: {
        //         id: true,
        //         ticketType: {
        //           select: {
        //             name: true,
        //           },
        //         },
        //       },
        //       take: 2,
        //     },
        //   },
        //   orderBy: { createdAt: "desc" },
        //   take: 5, // Limite à 5 dernières commandes
        // },
      },
    });

    // Vérification de l'existence de l'utilisateur
    if (!user) {
      return NextResponse.json(
        {
          error: "Utilisateur non trouvé",
          details: `Aucun utilisateur trouvé avec l'ID: ${id}`,
        },
        { status: 404 }
      );
    }

    // Formatage de la réponse avec les champs existants
    const response = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      image: user.image,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("Error fetching user:", error);

    // Gestion spécifique des erreurs Prisma
    if (error instanceof Error && "code" in error && (error as any).code === "P2023") {
      return NextResponse.json(
        {
          error: "ID invalide",
          details: "Le format de l'ID utilisateur est incorrect",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Erreur serveur",
        details:
          "Une erreur est survenue lors de la récupération des informations de l'utilisateur",
      },
      { status: 500 }
    );
  }
}

import bcrypt from "bcryptjs";

// PUT /api/admin/users/[id] : update user (admin only)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Accès refusé. Réservé aux administrateurs." },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { name, email, role, status, password, image } = body;

    // Vérifier que l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Validation des champs
    if (!name || !email || !role) {
      return NextResponse.json(
        {
          error: "Champs manquants",
          details: "Les champs suivants sont obligatoires: nom, email, rôle",
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

    // Vérification de l'unicité de l'email (sauf pour l'utilisateur actuel)
    const emailUser = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        id: { not: id },
      },
    });

    if (emailUser) {
      return NextResponse.json(
        {
          error: "Email déjà utilisé",
          details: "Un autre utilisateur avec cette adresse email existe déjà",
        },
        { status: 409 }
      );
    }

    // Préparation des données de mise à jour
    const updateData: any = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role,
      status: status || "ACTIVE",
      image: image || null,
    };

    // Hachage du mot de passe si fourni
    if (password) {
      if (password.length < 8) {
        return NextResponse.json(
          {
            error: "Mot de passe trop court",
            details: "Le mot de passe doit contenir au moins 8 caractères",
          },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(password, 12);
    }

    // Mise à jour de l'utilisateur
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({
      user,
      message: "Utilisateur mis à jour avec succès",
    });
  } catch (error: unknown) {
    console.error("Error updating user:", error);

    // Gestion spécifique des erreurs Prisma
    if (error instanceof Error && "code" in error && (error as any).code === "P2002") {
      return NextResponse.json(
        {
          error: "Erreur de contrainte unique",
          details: "L'email est déjà utilisé par un autre utilisateur",
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && "code" in error && (error as any).code === "P2025") {
      return NextResponse.json(
        {
          error: "Utilisateur non trouvé",
          details:
            "L'utilisateur que vous essayez de mettre à jour n'existe pas",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: "Erreur serveur",
        details:
          "Une erreur est survenue lors de la mise à jour de l'utilisateur",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] : supprimer user (admin only)
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json(
      {
        error: "Accès refusé",
        details: "Seuls les administrateurs peuvent supprimer des utilisateurs",
      },
      { status: 403 }
    );
  }

  const { id } = await params;

  // Empêcher l'auto-suppression
  if (session.user.id === id) {
    return NextResponse.json(
      {
        error: "Action non autorisée",
        details: "Vous ne pouvez pas supprimer votre propre compte",
      },
      { status: 403 }
    );
  }

  try {
    // Vérifier d'abord si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Utilisateur non trouvé",
          details: "L'utilisateur que vous essayez de supprimer n'existe pas",
        },
        { status: 404 }
      );
    }

    // Suppression de l'utilisateur
    await prisma.user.delete({
      where: { id },
    });
    return NextResponse.json({
      success: true,
      message: "Utilisateur supprimé avec succès",
    });
  } catch (error: unknown) {
    console.error("Error deleting user:", error);

    // Gestion spécifique des erreurs Prisma
    if (error instanceof Error && "code" in error && (error as any).code === "P2025") {
      return NextResponse.json(
        {
          error: "Utilisateur non trouvé",
          details:
            "L'utilisateur que vous essayez de supprimer n'existe pas ou a déjà été supprimé",
        },
        { status: 404 }
      );
    }

    // Erreur de contrainte de clé étrangère
    if (error instanceof Error && "code" in error && (error as any).code === "P2003") {
      return NextResponse.json(
        {
          error: "Action non autorisée",
          details:
            "Impossible de supprimer cet utilisateur car il a des données associées (billets, commandes, etc.)",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Erreur serveur",
        details:
          "Une erreur est survenue lors de la suppression de l'utilisateur",
      },
      { status: 500 }
    );
  }
}
