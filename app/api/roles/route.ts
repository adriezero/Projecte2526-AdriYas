import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';

export async function GET() {
  try {
    const roles = await prisma.rol.findMany({
      select: {
        ID: true,
        Nombre: true,
      },
    });
    return NextResponse.json(roles);
  } catch (error: unknown) {
    console.error('Error en API roles:', error);
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: 'Error al obtener roles', details: message }, { status: 500 });
  }
}
