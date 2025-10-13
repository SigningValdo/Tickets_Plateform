import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";

export const runtime = "nodejs";

// GET /api/admin/users/[id] : détail user (admin only)
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  // Vérification de l'authentification et des droits admin
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse(
      JSON.stringify({
        error: "Accès refusé",
        details:
          "Vous devez être administrateur pour accéder à cette ressource",
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Récupération de l'utilisateur avec ses relations
    const user = await prisma.user.findUnique({
      where: { id: params.id },
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
      return new NextResponse(
        JSON.stringify({
          error: "Utilisateur non trouvé",
          details: `Aucun utilisateur trouvé avec l'ID: ${params.id}`,
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          error: "Utilisateur non trouvé",
          details: `Aucun utilisateur trouvé avec l'ID: ${params.id}`,
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
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

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error fetching user:", error);

    // Gestion spécifique des erreurs Prisma
    if (error.code === "P2023") {
      return new NextResponse(
        JSON.stringify({
          error: "ID invalide",
          details: "Le format de l'ID utilisateur est incorrect",
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
        details:
          "Une erreur est survenue lors de la récupération des informations de l'utilisateur",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

import bcrypt from "bcryptjs";

// PUT /api/admin/users/[id] : update user (admin only)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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
    const { name, email, role, status, password, image } = body;

    // Vérifier que l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
      select: { id: true },
    });

    if (!existingUser) {
      return new NextResponse(
        JSON.stringify({ error: "Utilisateur non trouvé" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validation des champs
    if (!name || !email || !role) {
      return new NextResponse(
        JSON.stringify({
          error: "Champs manquants",
          details: "Les champs suivants sont obligatoires: nom, email, rôle",
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

    // Vérification de l'unicité de l'email (sauf pour l'utilisateur actuel)
    const emailUser = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        id: { not: params.id },
      },
    });

    if (emailUser) {
      return new NextResponse(
        JSON.stringify({
          error: "Email déjà utilisé",
          details: "Un autre utilisateur avec cette adresse email existe déjà",
        }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
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
        return new NextResponse(
          JSON.stringify({
            error: "Mot de passe trop court",
            details: "Le mot de passe doit contenir au moins 8 caractères",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      updateData.password = await bcrypt.hash(password, 12);
    }

    // Mise à jour de l'utilisateur
    const user = await prisma.user.update({
      where: { id: params.id },
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

    return NextResponse.json(
      {
        user,
        message: "Utilisateur mis à jour avec succès",
      },
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error updating user:", error);

    // Gestion spécifique des erreurs Prisma
    if (error.code === "P2002") {
      return new NextResponse(
        JSON.stringify({
          error: "Erreur de contrainte unique",
          details: "L'email est déjà utilisé par un autre utilisateur",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (error.code === "P2025") {
      return new NextResponse(
        JSON.stringify({
          error: "Utilisateur non trouvé",
          details:
            "L'utilisateur que vous essayez de mettre à jour n'existe pas",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        error: "Erreur serveur",
        details:
          "Une erreur est survenue lors de la mise à jour de l'utilisateur",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// DELETE /api/admin/users/[id] : supprimer user (admin only)
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse(
      JSON.stringify({
        error: "Accès refusé",
        details: "Seuls les administrateurs peuvent supprimer des utilisateurs",
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Empêcher l'auto-suppression
  if (session.user.id === params.id) {
    return new NextResponse(
      JSON.stringify({
        error: "Action non autorisée",
        details: "Vous ne pouvez pas supprimer votre propre compte",
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Vérifier d'abord si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: { id: true, email: true },
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          error: "Utilisateur non trouvé",
          details: "L'utilisateur que vous essayez de supprimer n'existe pas",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Suppression de l'utilisateur
    await prisma.user.delete({
      where: { id: params.id },
    });
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Utilisateur supprimé avec succès",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error deleting user:", error);

    // Gestion spécifique des erreurs Prisma
    if (error.code === "P2025") {
      return new NextResponse(
        JSON.stringify({
          error: "Utilisateur non trouvé",
          details:
            "L'utilisateur que vous essayez de supprimer n'existe pas ou a déjà été supprimé",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Erreur de contrainte de clé étrangère
    if (error.code === "P2003") {
      return new NextResponse(
        JSON.stringify({
          error: "Action non autorisée",
          details:
            "Impossible de supprimer cet utilisateur car il a des données associées (billets, commandes, etc.)",
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
        details:
          "Une erreur est survenue lors de la suppression de l'utilisateur",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
