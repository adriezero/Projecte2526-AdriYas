import { NextResponse } from 'next/server';
import { PrismaClient } from '@generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const solicitudes = await prisma.solicitud.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(solicitudes);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener solicitudes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const solicitud = await prisma.solicitud.create({
      data: {
        cliente: body.cliente,
        servicio: body.servicio,
        fecha: body.fecha ? new Date(body.fecha) : new Date(),
        estado: body.estado || 'Pendiente'
      }
    });
    return NextResponse.json(solicitud);
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear solicitud' }, { status: 500 });
  }
}
