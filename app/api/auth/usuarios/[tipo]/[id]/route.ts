import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';

type Params = { params: Promise<{ tipo: string; id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { tipo, id } = await params;
    const userId = parseInt(id);

    let usuario;
    switch (tipo) {
      case 'administrador':
        usuario = await prisma.administrador.findUnique({ where: { ID: userId } });
        break;
      case 'camionero':
        usuario = await prisma.camionero.findUnique({ where: { ID: userId }, include: { turnos: true } });
        break;
      case 'cliente':
        usuario = await prisma.cliente.findUnique({ where: { ID: userId } });
        break;
      case 'dispatcher':
        usuario = await prisma.dispatcher.findUnique({ where: { ID: userId } });
        break;
      default:
        return NextResponse.json({ error: 'Tipo de usuario inválido' }, { status: 400 });
    }

    if (!usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ ...usuario, tipo });
  } catch (error: unknown) {
    console.error('Error al obtener usuario:', error);
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: 'Error al obtener usuario', details: message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { tipo, id } = await params;
    const userId = parseInt(id);
    const data = await request.json();

    let usuario;
    switch (tipo) {
      case 'administrador':
        usuario = await prisma.administrador.update({ where: { ID: userId }, data });
        break;
      case 'camionero':
        usuario = await prisma.camionero.update({ where: { ID: userId }, data });
        break;
      case 'cliente':
        usuario = await prisma.cliente.update({ where: { ID: userId }, data });
        break;
      case 'dispatcher':
        usuario = await prisma.dispatcher.update({ where: { ID: userId }, data });
        break;
      default:
        return NextResponse.json({ error: 'Tipo de usuario inválido' }, { status: 400 });
    }

    return NextResponse.json(usuario);
  } catch (error: unknown) {
    console.error('Error al actualizar usuario:', error);
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: 'Error al actualizar usuario', details: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { tipo, id } = await params;
    const userId = parseInt(id);

    switch (tipo) {
      case 'administrador':
        await prisma.administrador.delete({ where: { ID: userId } });
        break;
      case 'camionero':
        await prisma.camionero.delete({ where: { ID: userId } });
        break;
      case 'cliente':
        await prisma.cliente.delete({ where: { ID: userId } });
        break;
      case 'dispatcher':
        await prisma.dispatcher.delete({ where: { ID: userId } });
        break;
      default:
        return NextResponse.json({ error: 'Tipo de usuario inválido' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Usuario eliminado correctamente' });
  } catch (error: unknown) {
    console.error('Error al eliminar usuario:', error);
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: 'Error al eliminar usuario', details: message }, { status: 500 });
  }
}
