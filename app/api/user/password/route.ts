import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Vous devez être connecté" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Le nouveau mot de passe doit contenir au moins 6 caractères" },
        { status: 400 }
      );
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!user?.password) {
      return NextResponse.json(
        { error: "Impossible de modifier le mot de passe pour ce compte" },
        { status: 400 }
      );
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Le mot de passe actuel est incorrect" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      message: "Mot de passe mis à jour avec succès",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du mot de passe" },
      { status: 500 }
    );
  }
}
