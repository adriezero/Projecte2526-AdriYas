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
  } catch {
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
    const { estado, idCamionero, motivoRechazo, cliente, tipo, asunto, descripcion } = body;

    // Si se acepta la solicitud, asignar camionero automáticamente
    if (estado === 'Aceptada') {
      if (!idCamionero) {
        return NextResponse.json({ error: 'Debe asignar un camionero al aceptar la solicitud' }, { status: 400 });
      }
      const camionero = await prisma.camionero.findUnique({ where: { ID: idCamionero } });
      if (!camionero || !camionero.Disponible) {
        return NextResponse.json({ error: 'El camionero no está disponible' }, { status: 400 });
      }

      // Obtener datos de la solicitud
      const solicitudActual = await prisma.solicitud.findUnique({
        where: { id: parseInt(id) }
      });

      if (!solicitudActual) {
        return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 });
      }

      // Crear reservas para cada día del rango
      const fechaInicio = solicitudActual.fechaServicio || new Date();
      const fechaFin = solicitudActual.fechaFin || fechaInicio;
      
      const reservasCreadas = [];
      const currentDate = new Date(fechaInicio);
      
      while (currentDate <= fechaFin) {
        const nuevaReserva = await prisma.reservas.create({
          data: {
            Fecha: new Date(currentDate),
            Hora: solicitudActual.hora || '08:00',
            Representante: solicitudActual.representante || solicitudActual.cliente,
            Origen: solicitudActual.origen || '',
            Destino: solicitudActual.destino || '',
            Motivo: solicitudActual.tipo,
            Descripci_n: solicitudActual.descripcion
          }
        });
        
        reservasCreadas.push(nuevaReserva);
        
        // Crear relación en solicitud_reserva si hay idCliente
        if (solicitudActual.idCliente) {
          await prisma.solicitud_reserva.create({
            data: {
              idReserva: nuevaReserva.ID,
              idCliente: solicitudActual.idCliente,
              idCamionero: idCamionero
            }
          });
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Actualizar solicitud con camionero asignado
      const solicitud = await prisma.solicitud.update({
        where: { id: parseInt(id) },
        data: { estado: 'Aceptada', idCamionero },
        include: {
          clienteRel: true,
          camioneroRel: true
        }
      });

      return NextResponse.json({ ...solicitud, estado: 'Aceptada' });
    }

    if (estado === 'Rechazada') {
      const solicitud = await prisma.solicitud.update({
        where: { id: parseInt(id) },
        data: { estado: 'Rechazada', motivoRechazo: motivoRechazo || 'Sin especificar' }
      });
      return NextResponse.json({ ...solicitud, estado: 'Rechazada' });
    }

    // Actualización normal (editar solicitud)
    const updateData: Record<string, unknown> = {};
    
    if (cliente !== undefined) updateData.cliente = cliente;
    if (tipo !== undefined) updateData.tipo = tipo;
    if (asunto !== undefined) updateData.asunto = asunto;
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    if (estado !== undefined) updateData.estado = mapEstadoToEnum(estado);

    const solicitud = await prisma.solicitud.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    return NextResponse.json({
      ...solicitud,
      estado: mapEstadoFromEnum(solicitud.estado)
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Error al actualizar solicitud', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
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
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Error al eliminar solicitud', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
