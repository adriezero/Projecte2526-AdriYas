import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const tarea = await prisma.tarea.update({
    where: { id: parseInt(id) },
    data: body
  });
  return NextResponse.json(tarea);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.tarea.delete({
    where: { id: parseInt(id) }
  });
  return NextResponse.json({ success: true });
}
