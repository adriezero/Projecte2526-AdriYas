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
  const desde = searchParams.get("desde");
  const hasta = searchParams.get("hasta");

  const rutas = await prisma.rutas.findMany({
    where: {
      Camionero: parseInt(session.user.id),
      ...(desde && hasta ? { FechaInicio: { gte: new Date(desde), lte: new Date(hasta) } } : {}),
    },
    orderBy: { FechaInicio: "desc" },
  });

  return NextResponse.json(rutas);
}
