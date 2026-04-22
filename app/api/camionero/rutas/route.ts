import { getServerSession } from "next-auth";
import { authOptions } from "@lib/auth";
import { prisma } from "@lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "camionero") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const rutas = await prisma.rutas.findMany({
    where: { Camionero: parseInt(session.user.id) },
    orderBy: { ID: "desc" },
  });

  return NextResponse.json(rutas);
}
