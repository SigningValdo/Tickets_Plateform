import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { settingSchema } from '@/lib/validations/setting';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    const setting = await prisma.setting.findUnique({
      where: { id },
    });

    if (!setting) {
      return NextResponse.json({ error: 'Paramètre non trouvé' }, { status: 404 });
    }

    return NextResponse.json(setting);
  } catch (error) {
    console.error('Erreur lors de la récupération du paramètre:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const json = await request.json();
    const body = settingSchema.parse(json);

    const existingSetting = await prisma.setting.findUnique({
      where: { id },
    });

    if (!existingSetting) {
      return NextResponse.json({ error: 'Paramètre non trouvé' }, { status: 404 });
    }

    if (body.key !== existingSetting.key) {
      const keyExists = await prisma.setting.findUnique({
        where: { key: body.key },
      });

      if (keyExists) {
        return NextResponse.json({ error: 'Un paramètre avec cette clé existe déjà' }, { status: 400 });
      }
    }

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
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    const existingSetting = await prisma.setting.findUnique({
      where: { id },
    });

    if (!existingSetting) {
      return NextResponse.json({ error: 'Paramètre non trouvé' }, { status: 404 });
    }

    await prisma.setting.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Erreur lors de la suppression du paramètre:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
