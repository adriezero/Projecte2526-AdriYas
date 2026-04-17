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
      nombre: body.nombre,
      prioridad: body.prioridad,
      fecha: body.fecha,
      usuario: body.usuario,
      completada: body.completada || false
    }
  });
  return NextResponse.json(tarea);
}
