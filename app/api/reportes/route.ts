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
  const estado   = searchParams.get('estado')   ?? ''

  const where: Record<string, unknown> = {}
  const toEnum: Record<string, string> = {
    'En revisión': 'En_revision',
    'Problema Técnico': 'Problema_Tecnico',
  }
  const fromEnum: Record<string, string> = {
    'En_revision': 'En revisión',
    'Problema_Tecnico': 'Problema Técnico',
  }
  if (tipo) where.Tipo = toEnum[tipo] ?? tipo
  if (estado) where.Estado = toEnum[estado] ?? estado
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

  const [rows, total] = await Promise.all([
    prisma.reportes.findMany({
      where,
      orderBy: { FechaHora: orden },
      skip: (pagina - 1) * limite,
      take: limite,
    }),
    prisma.reportes.count({ where }),
  ])

  const reportes = await Promise.all(rows.map(async r => {
    let nombreReportante: string | null = null
    if (r.rolReportante === 'Administrador') {
      const u = await prisma.administrador.findUnique({ where: { ID: r.idReportante }, select: { Nombre: true } })
      nombreReportante = u?.Nombre ?? null
    } else if (r.rolReportante === 'Camionero') {
      const u = await prisma.camionero.findUnique({ where: { ID: r.idReportante }, select: { Nombre: true } })
      nombreReportante = u?.Nombre ?? null
    } else if (r.rolReportante === 'Cliente') {
      const u = await prisma.cliente.findUnique({ where: { ID: r.idReportante }, select: { Nombre: true } })
      nombreReportante = u?.Nombre ?? null
    } else if (r.rolReportante === 'Dispatcher') {
      const u = await prisma.dispatcher.findUnique({ where: { ID: r.idReportante }, select: { Nombre: true } })
      nombreReportante = u?.Nombre ?? null
    }
    return {
      ...r,
      Estado: fromEnum[r.Estado] ?? r.Estado,
      Tipo: fromEnum[r.Tipo] ?? r.Tipo,
      nombreReportante,
    }
  }))

  return NextResponse.json({ reportes, total })
}
