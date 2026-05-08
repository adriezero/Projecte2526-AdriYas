import { NextResponse } from 'next/server';
import { PrismaClient } from '@generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mes = searchParams.get('mes');
    const year = searchParams.get('year');

    let whereClause = {};
    
    if (mes && year) {
      const startDate = new Date(parseInt(year), parseInt(mes) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(mes), 0);
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
    
    const reserva = await prisma.reservas.create({
      data: {
        Fecha: new Date(body.fechaInicio),
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
