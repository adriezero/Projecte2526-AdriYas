import { NextResponse } from 'next/server';
import { PrismaClient } from '@generated/prisma';

const prisma = new PrismaClient();

function mapEstadoToEnum(estado: string): string {
  const mapping: Record<string, string> = {
    'Pendiente': 'Pendiente',
    'En Proceso': 'En_Proceso',
    'Aceptada': 'Aceptada',
    'Rechazada': 'Rechazada'
  };
  return mapping[estado] || estado;
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

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const solicitud = await prisma.solicitud.findUnique({
      where: { id: parseInt(params.id) }
    });
    if (!solicitud) {
      return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 });
    }
    return NextResponse.json({
      ...solicitud,
      estado: mapEstadoFromEnum(solicitud.estado)
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener solicitud' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const updateData: any = {};
    
    if (body.estado) updateData.estado = mapEstadoToEnum(body.estado);
    if (body.cliente) updateData.cliente = body.cliente;
    if (body.tipo) updateData.tipo = body.tipo;
    if (body.asunto) updateData.asunto = body.asunto;
    if (body.descripcion !== undefined) updateData.descripcion = body.descripcion;
    
    const solicitud = await prisma.solicitud.update({
      where: { id: parseInt(params.id) },
      data: updateData
    });
    
    return NextResponse.json({
      ...solicitud,
      estado: mapEstadoFromEnum(solicitud.estado)
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar solicitud' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.solicitud.delete({
      where: { id: parseInt(params.id) }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar solicitud' }, { status: 500 });
  }
}
