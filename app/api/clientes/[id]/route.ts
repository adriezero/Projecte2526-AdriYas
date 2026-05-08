import { NextResponse } from 'next/server';
import { PrismaClient } from '@generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { ID: parseInt(id) }
    });

    if (!cliente) {
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ ...cliente, Gmail: cliente.Email });
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    return NextResponse.json({ error: 'Error al obtener cliente' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { Nombre, NombreEmpresa, RazonSocial, Telf, Gmail } = body;
    const updated = await prisma.cliente.update({
      where: { ID: parseInt(id) },
      data: { Nombre, NombreEmpresa, RazonSocial, Telf, Email: Gmail },
    });
    return NextResponse.json({ ...updated, Gmail: updated.Email });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    return NextResponse.json({ error: 'Error al actualizar cliente' }, { status: 500 });
  }
}
