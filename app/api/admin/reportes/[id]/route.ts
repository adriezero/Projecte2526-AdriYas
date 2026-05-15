import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const reporte = await prisma.reportes.update({
    where: { ID: Number(id) },
    data: { Estado: body.Estado },
  })
  return NextResponse.json(reporte)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.reportes.delete({ where: { ID: Number(id) } })
  return NextResponse.json({ ok: true })
}
