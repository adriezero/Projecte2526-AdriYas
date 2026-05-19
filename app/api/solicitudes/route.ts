import { NextResponse } from 'next/server';
import { Solicitud_Estado } from '@generated/prisma';
import { prisma } from '@lib/prisma';

function mapEstadoToEnum(estado: string): Solicitud_Estado {
  const mapping: Record<string, Solicitud_Estado> = {
    'Pendiente': Solicitud_Estado.Pendiente,
    'En Proceso': Solicitud_Estado.En_Proceso,
    'Aceptada': Solicitud_Estado.Aceptada,
    'Rechazada': Solicitud_Estado.Rechazada
  };
  return mapping[estado] || Solicitud_Estado.Pendiente;
}

function mapEstadoFromEnum(estado: string): string {
  const mapping: Record<string, string> = {
    'Pendiente': 'Pendiente',
    'En_Proceso': 'En Proceso',
    'Aceptada': 'Aceptada',
    'Rechazada': 'Rechazada'
  };
  return mapping[estado] || estado;
}

export async function GET() {
  try {
    const solicitudes = await prisma.solicitud.findMany({
      orderBy: { createdAt: 'desc' }
    });
    const mapped = solicitudes.map(s => ({
      ...s,
      estado: mapEstadoFromEnum(s.estado)
    }));
    return NextResponse.json(mapped);
  } catch {
    return NextResponse.json({ error: 'Error al obtener solicitudes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Datos recibidos:', body);
    
    // Buscar cliente por nombre para obtener ID
    let idCliente = null;
    if (body.cliente) {
      const cliente = await prisma.cliente.findFirst({
        where: { Nombre: body.cliente }
      });
      idCliente = cliente?.ID || null;
    }
    
    const solicitud = await prisma.solicitud.create({
      data: {
        cliente: body.cliente,
        tipo: body.tipo,
        asunto: body.asunto,
        descripcion: body.descripcion || null,
        fecha: body.fecha ? new Date(body.fecha) : new Date(),
        estado: mapEstadoToEnum(body.estado || 'Pendiente'),
        origen: body.origen || null,
        destino: body.destino || null,
        idCliente,
        fechaServicio: body.fechaServicio ? new Date(body.fechaServicio) : null,
        fechaFin: body.fechaFin ? new Date(body.fechaFin) : null,
        hora: body.hora || null,
        representante: body.representante || null
      }
    });
    return NextResponse.json({
      ...solicitud,
      estado: mapEstadoFromEnum(solicitud.estado)
    });
  } catch (error: unknown) {
    console.error('Error al crear solicitud:', error);
    return NextResponse.json({ error: 'Error al crear solicitud', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
