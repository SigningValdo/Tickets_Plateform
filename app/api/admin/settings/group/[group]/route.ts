import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../auth/[...nextauth]/route';
import prisma from '@/lib/db';

type Params = {
  params: {
    group: string;
  };
};

export async function GET(_: Request, { params }: Params) {
  try {
    // Vérifier l'authentification et les droits d'admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Non autorisé', { status: 401 });
    }

    const { group } = params;

    // Vérifier que le groupe est valide
    const validGroups = ['general', 'notifications', 'payments', 'security'];
    if (!validGroups.includes(group)) {
      return new NextResponse('Groupe de paramètres invalide', { status: 400 });
    }

    // Récupérer les paramètres du groupe
    const settings = await prisma.setting.findMany({
      where: { group },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres du groupe:', error);
    return new NextResponse('Erreur interne du serveur', { status: 500 });
  }
}
