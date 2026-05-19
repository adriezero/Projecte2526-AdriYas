import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clienteId = searchParams.get('clienteId');

    if (!clienteId) {
      return NextResponse.json({ error: 'clienteId es requerido' }, { status: 400 });
    }

    const informes = await prisma.informes.findMany({
      where: { idCliente: parseInt(clienteId) },
      select: {
        ID: true,
        FechaSubida: true,
        Tipo: true,
        Formato: true
      }
    });

    return NextResponse.json(informes);
  } catch (error) {
    console.error('Error al obtener informes:', error);
    return NextResponse.json({ error: 'Error al obtener informes' }, { status: 500 });
  }
}
