import { getServerSession } from "next-auth";
import { authOptions } from "@lib/auth";
import { prisma } from "@lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "cliente") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const clienteId = parseInt(session.user.id);
  const idReserva = parseInt(id);

  const rows = await prisma.$queryRaw<any[]>`
    SELECT
      sr."idReserva",
      sr."idCamionero",
      r."Fecha"          AS "reservaFecha",
      r."Motivo"         AS "reservaMotivo",
      r."Descripción"    AS "reservaDescripcion",
      r."Origen"         AS "reservaOrigen",
      r."Destino"        AS "reservaDestino",
      r."Hora"           AS "reservaHora",
      r."Representante"  AS "reservaRepresentante",
      ru."ID"            AS "rutaId",
      ru."Estado"        AS "rutaEstado",
      ru."Origen"        AS "rutaOrigen",
      ru."Destino"       AS "rutaDestino",
      ru."FechaInicio"   AS "rutaFechaInicio",
      ru."Cargas"        AS "rutaCargas",
      c."Nombre"         AS "conductorNombre",
      c."Telf"           AS "conductorTelf",
      c."Licencia"       AS "conductorLicencia"
    FROM solicitud_reserva sr
    JOIN reservas r   ON r."ID"  = sr."idReserva"
    JOIN camionero c  ON c."ID"  = sr."idCamionero"
    LEFT JOIN LATERAL (
      SELECT * FROM rutas
      WHERE "Camionero" = sr."idCamionero"
      ORDER BY "FechaInicio" DESC
      LIMIT 1
    ) ru ON true
    WHERE sr."idCliente" = ${clienteId}
      AND sr."idReserva" = ${idReserva}
    LIMIT 1
  `;

  if (!rows.length) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(rows[0]);
}
