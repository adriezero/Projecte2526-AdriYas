import { prisma } from '@lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@lib/auth';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'administrador';
}

export async function GET() {
  if (!await checkAdmin()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const reviews = await prisma.comentarios.findMany({
    include: {
      cliente: { select: { Nombre: true } },
      rutas: { select: { Origen: true, Destino: true } },
    },
    orderBy: { Fecha: 'desc' },
  });

  return NextResponse.json(reviews.map(r => ({
    id: r.ID,
    name: r.cliente.Nombre,
    comment: r.Contenido,
    isPositive: r.EsPositivo,
    date: r.Fecha,
    moderado: r.Moderado,
    route: `${r.rutas.Origen} → ${r.rutas.Destino}`,
  })));
}

export async function PATCH(request: Request) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id, moderado } = await request.json();
  const updated = await prisma.comentarios.update({
    where: { ID: id },
    data: { Moderado: moderado },
  });

  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await request.json();
  await prisma.comentarios.delete({ where: { ID: id } });

  return NextResponse.json({ ok: true });
}
