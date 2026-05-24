import { getServerSession } from "next-auth";
import { authOptions } from "@lib/auth";
import { prisma } from "@lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "camionero") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const mes = searchParams.get("mes");
  const year = searchParams.get("year");

  const where: Record<string, unknown> = {
    idCamionero: parseInt(session.user.id),
    estado: "Aceptada",
  };

  if (mes && year) {
    const inicio = new Date(parseInt(year), parseInt(mes) - 1, 1);
    const fin = new Date(parseInt(year), parseInt(mes), 0);
    where.fechaServicio = { gte: inicio, lte: fin };
  }

  const servicios = await prisma.solicitud.findMany({
    where,
    orderBy: { fechaServicio: "asc" },
    select: {
      id: true,
      cliente: true,
      tipo: true,
      asunto: true,
      descripcion: true,
      fechaServicio: true,
      fechaFin: true,
      hora: true,
      origen: true,
      destino: true,
    },
  });

  return NextResponse.json(servicios);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "camionero") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { idSolicitud } = await req.json();
  const idCamionero = parseInt(session.user.id);

  const solicitud = await prisma.solicitud.findUnique({ where: { id: idSolicitud } });

  if (!solicitud || solicitud.idCamionero !== idCamionero) {
    return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
  }

  // Crear la ruta a partir del servicio
  const ruta = await prisma.rutas.create({
    data: {
      Camionero: idCamionero,
      Origen: solicitud.origen || "",
      Destino: solicitud.destino || "",
      Estado: "Finalizado",
      Reservas: solicitud.asunto,
      Cargas: solicitud.tipo,
      FechaInicio: solicitud.fechaServicio || new Date(),
      EnTiempoReal: false,
    },
  });

  // Marcar la solicitud como finalizada (En_Proceso reutilizamos o usamos Aceptada — la quitamos del horario cambiando estado)
  await prisma.solicitud.update({
    where: { id: idSolicitud },
    data: { estado: "En_Proceso" }, // En_Proceso = "completado/en historial", ya no aparece en horario
  });

  return NextResponse.json(ruta, { status: 201 });
}
