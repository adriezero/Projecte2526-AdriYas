import { NextResponse } from 'next/server';
import { PrismaClient } from '@generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const camioneros = await prisma.camionero.findMany({
      include: {
        turnos: true
      },
      orderBy: { Nombre: 'asc' }
    });
    return NextResponse.json(camioneros);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener camioneros' }, { status: 500 });
  }
}
