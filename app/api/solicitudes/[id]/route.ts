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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const solicitud = await prisma.solicitud.findUnique({
      where: { id: parseInt(id) }
    });
    if (!solicitud) return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 });
    return NextResponse.json({ ...solicitud, estado: mapEstadoFromEnum(solicitud.estado) });
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener solicitud' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { estado, idCamionero, motivoRechazo } = body;

    if (estado === 'Aceptada') {
      if (!idCamionero) {
        return NextResponse.json({ error: 'Debe asignar un camionero al aceptar la solicitud' }, { status: 400 });
      }
      const camionero = await prisma.camionero.findUnique({ where: { ID: idCamionero } });
      if (!camionero || !camionero.Disponible) {
        return NextResponse.json({ error: 'El camionero no está disponible' }, { status: 400 });
      }
      const solicitud = await prisma.solicitud.update({
        where: { id: parseInt(id) },
        data: { estado: 'Aceptada' as any, idCamionero }
      });
      return NextResponse.json({ ...solicitud, estado: 'Aceptada' });
    }

    if (estado === 'Rechazada') {
      const solicitud = await prisma.solicitud.update({
        where: { id: parseInt(id) },
        data: { estado: 'Rechazada' as any, motivoRechazo: motivoRechazo || 'Sin especificar' }
      });
      return NextResponse.json({ ...solicitud, estado: 'Rechazada' });
    }

    const solicitud = await prisma.solicitud.update({
      where: { id: parseInt(id) },
      data: { ...body, estado: mapEstadoToEnum(body.estado || estado) }
    });
    return NextResponse.json({ ...solicitud, estado: mapEstadoFromEnum(solicitud.estado) });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al actualizar solicitud', details: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.solicitud.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al eliminar solicitud', details: error.message }, { status: 500 });
  }
}
