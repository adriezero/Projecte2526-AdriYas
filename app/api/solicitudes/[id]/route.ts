import { NextResponse } from 'next/server';
import { PrismaClient } from '@generated/prisma';

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { estado, idCamionero, motivoRechazo, cliente, tipo, asunto, descripcion } = body;

    // Si se acepta la solicitud, asignar camionero automáticamente
    if (estado === 'Aceptada') {
      if (!idCamionero) {
        return NextResponse.json(
          { error: 'Debe asignar un camionero al aceptar la solicitud' },
          { status: 400 }
        );
      }

      // Verificar que el camionero esté disponible
      const camionero = await prisma.camionero.findUnique({
        where: { ID: idCamionero }
      });

      if (!camionero || !camionero.Disponible) {
        return NextResponse.json(
          { error: 'El camionero no está disponible' },
          { status: 400 }
        );
      }

      // Obtener datos de la solicitud
      const solicitudActual = await prisma.solicitud.findUnique({
        where: { id }
      });

      if (!solicitudActual) {
        return NextResponse.json(
          { error: 'Solicitud no encontrada' },
          { status: 404 }
        );
      }

      // Crear reserva automáticamente con los datos de la solicitud
      if (solicitudActual.fechaServicio && solicitudActual.hora) {
        await prisma.reservas.create({
          data: {
            Fecha: solicitudActual.fechaServicio,
            Hora: solicitudActual.hora,
            Representante: solicitudActual.representante || solicitudActual.cliente,
            Origen: solicitudActual.origen || '',
            Destino: solicitudActual.destino || '',
            Motivo: solicitudActual.tipo,
            Descripci_n: solicitudActual.descripcion
          }
        });
      }

      // Actualizar solicitud con camionero asignado
      const solicitud = await prisma.solicitud.update({
        where: { id },
        data: {
          estado: 'Aceptada' as any,
          idCamionero
        },
        include: {
          clienteRel: true,
          camioneroRel: true
        }
      });

      return NextResponse.json({
        ...solicitud,
        estado: 'Aceptada'
      });
    }

    // Si se rechaza, guardar motivo
    if (estado === 'Rechazada') {
      const solicitud = await prisma.solicitud.update({
        where: { id },
        data: {
          estado: 'Rechazada' as any,
          motivoRechazo: motivoRechazo || 'Sin especificar'
        }
      });

      return NextResponse.json({
        ...solicitud,
        estado: 'Rechazada'
      });
    }

    // Actualización normal (editar solicitud)
    const updateData: any = {};
    
    if (cliente !== undefined) updateData.cliente = cliente;
    if (tipo !== undefined) updateData.tipo = tipo;
    if (asunto !== undefined) updateData.asunto = asunto;
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    if (estado !== undefined) updateData.estado = mapEstadoToEnum(estado);

    const solicitud = await prisma.solicitud.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      ...solicitud,
      estado: mapEstadoFromEnum(solicitud.estado)
    });
  } catch (error: any) {
    console.error('Error al actualizar solicitud:', error);
    return NextResponse.json(
      { error: 'Error al actualizar solicitud', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await prisma.solicitud.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al eliminar solicitud', details: error.message },
      { status: 500 }
    );
  }
}

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
