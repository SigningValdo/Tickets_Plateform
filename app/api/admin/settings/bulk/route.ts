import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { settingSchema } from '@/lib/validations/setting';

export async function PUT(request: Request) {
  try {
    // Vérifier l'authentification et les droits d'admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Non autorisé', { status: 401 });
    }

    const updates = await request.json();

    // Valider les données reçues
    if (!Array.isArray(updates)) {
      return new NextResponse('Données invalides', { status: 400 });
    }

    // Valider chaque mise à jour
    for (const update of updates) {
      try {
        settingSchema.partial().parse(update);
      } catch (error) {
        console.error('Erreur de validation:', error);
        return new NextResponse(`Données invalides: ${error}`, { status: 400 });
      }
    }

    // Mettre à jour les paramètres dans une transaction
    const results = await prisma.$transaction(
      updates.map((update) =>
        prisma.setting.update({
          where: { id: update.id },
          data: {
            value: update.value,
            // Autres champs pouvant être mis à jour en masse
          },
        })
      )
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error('Erreur lors de la mise à jour groupée des paramètres:', error);
    return new NextResponse('Erreur interne du serveur', { status: 500 });
  }
}
