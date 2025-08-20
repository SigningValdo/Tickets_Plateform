import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { settingSchema } from '@/lib/validations/setting';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';

type Params = {
  params: {
    id: string;
  };
};

export async function GET(_: Request, { params }: Params) {
  try {
    // Vérifier l'authentification et les droits d'admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Non autorisé', { status: 401 });
    }

    const { id } = params;

    // Récupérer le paramètre
    const setting = await prisma.setting.findUnique({
      where: { id },
    });

    if (!setting) {
      return new NextResponse('Paramètre non trouvé', { status: 404 });
    }

    return NextResponse.json(setting);
  } catch (error) {
    console.error('Erreur lors de la récupération du paramètre:', error);
    return new NextResponse('Erreur interne du serveur', { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    // Vérifier l'authentification et les droits d'admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Non autorisé', { status: 401 });
    }

    const { id } = params;
    const json = await request.json();
    const body = settingSchema.parse(json);

    // Vérifier si le paramètre existe
    const existingSetting = await prisma.setting.findUnique({
      where: { id },
    });

    if (!existingSetting) {
      return new NextResponse('Paramètre non trouvé', { status: 404 });
    }

    // Vérifier si la clé est modifiée et si elle est déjà utilisée
    if (body.key !== existingSetting.key) {
      const keyExists = await prisma.setting.findUnique({
        where: { key: body.key },
      });

      if (keyExists) {
        return new NextResponse('Un paramètre avec cette clé existe déjà', { status: 400 });
      }
    }

    // Mettre à jour le paramètre
    const updatedSetting = await prisma.setting.update({
      where: { id },
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

    return NextResponse.json(updatedSetting);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du paramètre:', error);
    return new NextResponse('Erreur interne du serveur', { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    // Vérifier l'authentification et les droits d'admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Non autorisé', { status: 401 });
    }

    const { id } = params;

    // Vérifier si le paramètre existe
    const existingSetting = await prisma.setting.findUnique({
      where: { id },
    });

    if (!existingSetting) {
      return new NextResponse('Paramètre non trouvé', { status: 404 });
    }

    // Supprimer le paramètre
    await prisma.setting.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Erreur lors de la suppression du paramètre:', error);
    return new NextResponse('Erreur interne du serveur', { status: 500 });
  }
}
