import { NextResponse } from 'next/server';
import { PrismaClient } from '@generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mes = searchParams.get('mes');
    const anio = searchParams.get('anio');

    let whereClause = {};
    
    if (mes && anio) {
      const startDate = new Date(parseInt(anio), parseInt(mes) - 1, 1);
      const endDate = new Date(parseInt(anio), parseInt(mes), 0);
      whereClause = {
        Fecha: {
          gte: startDate,
          lte: endDate
        }
      };
    }

    const reservas = await prisma.reservas.findMany({
      where: whereClause,
      orderBy: { Fecha: 'asc' }
    });
    
    return NextResponse.json(reservas);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener reservas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Obtener el último ID para asegurar que no haya conflictos
    const ultimaReserva = await prisma.reservas.findFirst({
      orderBy: { ID: 'desc' }
    });
    
    const reserva = await prisma.reservas.create({
      data: {
        Fecha: new Date(body.fecha),
        Hora: body.hora,
        Representante: body.representante,
        Origen: body.origen,
        Destino: body.destino,
        Motivo: body.motivo || 'Reserva',
        Descripci_n: body.descripcion || null
      }
    });
    return NextResponse.json(reserva);
  } catch (error: any) {
    console.error('Error al crear reserva:', error);
    return NextResponse.json({ error: 'Error al crear reserva', details: error.message }, { status: 500 });
  }
}
