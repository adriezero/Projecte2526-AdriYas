import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mes = searchParams.get('mes');
    const year = searchParams.get('year');

    let whereClause = {};

    if (mes && year) {
      const mesNum = parseInt(mes);
      const yearNum = parseInt(year);
      const primerDia = new Date(yearNum, mesNum - 1, 1);
      const ultimoDia = new Date(yearNum, mesNum, 0);

      whereClause = {
        OR: [
          {
            FechaInicio: {
              gte: primerDia,
              lte: ultimoDia,
            },
          },
          {
            FechaFinal: {
              gte: primerDia,
              lte: ultimoDia,
            },
          },
          {
            AND: [
              { FechaInicio: { lte: primerDia } },
              { FechaFinal: { gte: ultimoDia } },
            ],
          },
        ],
      };
    }

    const camioneros = await prisma.camionero.findMany({
      where: whereClause,
      include: {
        turnos: true,
      },
    });

    const resultado = camioneros.map(c => ({
      ID: c.ID,
      Nombre: c.Nombre,
      Turno: c.turnos.Descripci_n,
      FechaInicio: c.FechaInicio,
      FechaFinal: c.FechaFinal,
    }));

    return NextResponse.json(resultado);
  } catch (error) {
    console.error('Error al obtener turnos:', error);
    return NextResponse.json(
      { error: 'Error al obtener turnos' },
      { status: 500 }
    );
  }
}
