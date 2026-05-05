import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';

export async function GET() {
  const tareas = await prisma.tarea.findMany({
    orderBy: { id: 'desc' }
  });
  return NextResponse.json(tareas);
}

export async function POST(request: Request) {
  const body = await request.json();
  const tarea = await prisma.tarea.create({
    data: {
      titulo: body.titulo || body.nombre,
      descripcion: body.descripcion,
      estado: body.estado || 'Pendiente',
      prioridad: body.prioridad,
      asignadoA: body.asignadoA || body.usuario,
      creadoPor: body.creadoPor
    }
  });
  return NextResponse.json(tarea);
}
