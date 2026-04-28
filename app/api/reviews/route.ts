// app/api/reviews/route.ts
import { prisma } from '@lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@lib/auth';

export async function GET() {
  try {
    const reviews = await prisma.comentarios.findMany({
      where: { Moderado: true },
      include: { 
        cliente: { select: { Nombre: true } },
        rutas: { select: { Origen: true, Destino: true } }
      },
      orderBy: { Fecha: 'desc' },
      take: 10
    });

    return NextResponse.json(reviews.map(r => ({
      id: r.ID,
      name: r.cliente.Nombre,
      comment: r.Contenido,
      isPositive: r.EsPositivo,
      date: r.Fecha,
      route: `${r.rutas.Origen} → ${r.rutas.Destino}`
    })));
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'cliente') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { contenido, esPositivo, idRuta } = await request.json();
  if (!contenido || idRuta === undefined) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
  }

  const comentario = await prisma.comentarios.create({
    data: {
      Contenido: contenido,
      EsPositivo: esPositivo ?? true,
      Moderado: false,
      Ruta: idRuta,
      Cliente: parseInt(session.user.id),
    },
  });

  return NextResponse.json(comentario);
}
