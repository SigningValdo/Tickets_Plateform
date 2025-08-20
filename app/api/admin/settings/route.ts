import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { settingSchema } from '@/lib/validations/setting';
import prisma from '@/lib/db';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
  try {
    // Vérifier l'authentification et les droits d'admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Non autorisé', { status: 401 });
    }

    // Récupérer tous les paramètres
    const settings = await prisma.setting.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error);
    return new NextResponse('Erreur interne du serveur', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Vérifier l'authentification et les droits d'admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Non autorisé', { status: 401 });
    }

    const json = await request.json();
    const body = settingSchema.parse(json);

    // Vérifier si la clé existe déjà
    const existingSetting = await prisma.setting.findUnique({
      where: { key: body.key },
    });

    if (existingSetting) {
      return new NextResponse('Un paramètre avec cette clé existe déjà', { status: 400 });
    }

    // Créer le paramètre
    const setting = await prisma.setting.create({
      data: {
        key: body.key,
        value: body.value,
        type: body.type,
        group: body.group,
        label: body.label,
        helpText: body.helpText,
        options: body.options as any,
        order: body.order,
      },
    });

    return NextResponse.json(setting, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du paramètre:', error);
    return new NextResponse('Erreur interne du serveur', { status: 500 });
  }
}
