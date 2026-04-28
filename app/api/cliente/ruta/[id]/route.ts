import { getServerSession } from "next-auth";
import { authOptions } from "@lib/auth";
import { prisma } from "@lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "cliente") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const clienteId = parseInt(session.user.id);
  const { id } = await params;
  const idReserva = parseInt(id);

  const rows = await prisma.$queryRaw<{
    idReserva: number;
    idCamionero: number;
    reservaFecha: Date;
    reservaMotivo: string;
    rutaId: number;
    rutaEstado: string;
    rutaOrigen: string;
    rutaDestino: string;
    rutaFechaInicio: Date;
    rutaCargas: string;
    conductorNombre: string;
    conductorTelf: string;
  }[]>`
    SELECT
      sr."idReserva",
      sr."idCamionero",
      r."Fecha"        AS "reservaFecha",
      r."Motivo"       AS "reservaMotivo",
      ru."ID"          AS "rutaId",
      ru."Estado"      AS "rutaEstado",
      ru."Origen"      AS "rutaOrigen",
      ru."Destino"     AS "rutaDestino",
      ru."FechaInicio" AS "rutaFechaInicio",
      ru."Cargas"      AS "rutaCargas",
      c."Nombre"       AS "conductorNombre",
      c."Telf"         AS "conductorTelf"
    FROM solicitud_reserva sr
    JOIN reservas r   ON r."ID"  = sr."idReserva"
    JOIN camionero c  ON c."ID"  = sr."idCamionero"
    LEFT JOIN LATERAL (
      SELECT * FROM rutas
      WHERE "Camionero" = sr."idCamionero"
        AND "Estado" IN ('Programado','Cargando','En_ruta','En_pausa')
      ORDER BY "FechaInicio" DESC
      LIMIT 1
    ) ru ON true
    WHERE sr."idCliente" = ${clienteId}
      AND sr."idReserva" = ${idReserva}
    LIMIT 1
  `;

  if (!rows.length) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const d = rows[0];
  return NextResponse.json({
    reserva: { id: d.idReserva, fecha: d.reservaFecha, motivo: d.reservaMotivo },
    ruta: d.rutaId ? {
      id: d.rutaId,
      estado: d.rutaEstado,
      origen: d.rutaOrigen,
      destino: d.rutaDestino,
      fechaInicio: d.rutaFechaInicio,
      cargas: d.rutaCargas,
    } : null,
    camionero: { nombre: d.conductorNombre, telf: d.conductorTelf },
  });
}
