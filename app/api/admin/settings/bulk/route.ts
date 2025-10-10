import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import prisma from '@/lib/db';
import { settingSchema } from '@/lib/validations/setting';
import { z } from 'zod';

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
    if (updates.length === 0) {
      return new NextResponse('Aucune mise à jour fournie', { status: 400 });
    }

    // Schéma strict pour les mises à jour en masse: id requis + value (mêmes contraintes que le schéma principal)
    const bulkUpdateSchema = z.object({
      id: z.string(),
      value: settingSchema.shape.value,
    });
    const parsed = z.array(bulkUpdateSchema).safeParse(updates);
    if (!parsed.success) {
      console.error('Erreur de validation:', parsed.error.flatten());
      return new NextResponse('Données invalides', { status: 400 });
    }
    const validUpdates = parsed.data;

    // Vérifier que tous les IDs existent avant la transaction
    const ids = validUpdates.map((u) => u.id);
    const existing = await prisma.setting.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });
    const existingIds = new Set(existing.map((e) => e.id));
    const missingIds = ids.filter((id) => !existingIds.has(id));
    if (missingIds.length > 0) {
      return NextResponse.json(
        { message: 'Paramètres non trouvés', missingIds },
        { status: 404 }
      );
    }

    // Mettre à jour les paramètres dans une transaction
    const results = await prisma.$transaction(
      validUpdates.map((update) =>
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

