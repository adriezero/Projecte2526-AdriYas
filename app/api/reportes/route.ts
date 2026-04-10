import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const busqueda = searchParams.get('busqueda') ?? ''
  const tipo     = searchParams.get('tipo')     ?? ''
  const orden    = searchParams.get('orden') === 'asc' ? 'asc' : 'desc'
  const pagina   = Math.max(1, Number(searchParams.get('pagina') ?? 1))
  const limite   = Math.max(1, Number(searchParams.get('limite') ?? 10))
  const fecha    = searchParams.get('fecha')    ?? ''

  const where: Record<string, unknown> = {}
  if (tipo) where.Tipo = tipo
  if (busqueda) {
    const num = Number(busqueda)
    where.OR = [
      ...(isNaN(num) ? [] : [{ ID: num }]),
      { rolReportante: { contains: busqueda, mode: 'insensitive' } },
      { Tipo: { contains: busqueda, mode: 'insensitive' } },
    ]
  }
  if (fecha) {
    const inicio = new Date(fecha)
    const fin = new Date(fecha)
    fin.setDate(fin.getDate() + 1)
    where.FechaHora = { gte: inicio, lt: fin }
  }

  const [reportes, total] = await Promise.all([
    prisma.reportes.findMany({
      where,
      orderBy: { FechaHora: orden },
      skip: (pagina - 1) * limite,
      take: limite,
    }),
    prisma.reportes.count({ where }),
  ])

  return NextResponse.json({ reportes, total })
}
