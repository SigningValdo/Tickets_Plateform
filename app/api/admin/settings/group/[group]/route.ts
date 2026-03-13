import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

type Params = {
  params: Promise<{ group: string }>;
};

export async function GET(_: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { group } = await params;

    // Vérifier que le groupe est valide
    const validGroups = ['general', 'notifications', 'payments', 'security'];
    if (!validGroups.includes(group)) {
      return NextResponse.json({ error: 'Groupe de paramètres invalide' }, { status: 400 });
    }

    // Récupérer les paramètres du groupe
    const settings = await prisma.setting.findMany({
      where: { group },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres du groupe:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
