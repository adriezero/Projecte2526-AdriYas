import { NextResponse } from 'next/server';
import { PrismaClient } from '@generated/prisma';

const prisma = new PrismaClient();

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const solicitud = await prisma.solicitud.update({
      where: { id: parseInt(params.id) },
      data: body
    });
    return NextResponse.json(solicitud);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar solicitud' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.solicitud.delete({
      where: { id: parseInt(params.id) }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar solicitud' }, { status: 500 });
  }
}
