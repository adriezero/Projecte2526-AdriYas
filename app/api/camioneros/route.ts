import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';

export async function GET() {
  try {
    const camioneros = await prisma.camionero.findMany({
      include: {
        turnos: true
      },
      orderBy: { Nombre: 'asc' }
    });
    return NextResponse.json(camioneros);
  } catch {
    return NextResponse.json({ error: 'Error al obtener camioneros' }, { status: 500 });
  }
}
