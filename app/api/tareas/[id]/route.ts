import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const tarea = await prisma.tarea.update({
    where: { id: parseInt(params.id) },
    data: body
  });
  return NextResponse.json(tarea);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.tarea.delete({
    where: { id: parseInt(params.id) }
  });
  return NextResponse.json({ success: true });
}
