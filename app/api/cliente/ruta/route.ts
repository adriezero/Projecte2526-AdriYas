import { getServerSession } from "next-auth";
import { authOptions } from "@lib/auth";
import { prisma } from "@lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "cliente") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const clienteId = parseInt(session.user.id);

  const solicitud = await prisma.solicitud_reserva.findFirst({
    where: { idCliente: clienteId },
    include: {
      reservas: true,
      camionero: true,
    },
    orderBy: { idReserva: "desc" },
  });

  if (!solicitud) {
    return NextResponse.json({ ruta: null, camionero: null, reserva: null });
  }

  const ruta = await prisma.rutas.findFirst({
    where: {
      Camionero: solicitud.idCamionero,
      Estado: { in: ["Programado", "Cargando", "En_ruta", "En_pausa"] },
    },
    orderBy: { FechaInicio: "desc" },
  });

  return NextResponse.json({
    ruta: ruta
      ? {
          id: ruta.ID,
          estado: ruta.Estado,
          origen: ruta.Origen,
          destino: ruta.Destino,
          fechaInicio: ruta.FechaInicio,
          cargas: ruta.Cargas,
        }
      : null,
    camionero: {
      nombre: solicitud.camionero.Nombre,
      telf: solicitud.camionero.Telf,
    },
    reserva: {
      id: solicitud.idReserva,
      fecha: solicitud.reservas.Fecha,
      motivo: solicitud.reservas.Motivo,
    },
  });
}
