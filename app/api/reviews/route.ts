// app/api/reviews/route.ts
import { prisma } from '@lib/prisma';
import { NextResponse } from 'next/server';

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
