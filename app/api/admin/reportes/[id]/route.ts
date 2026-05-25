import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()

  const reporte = await prisma.reportes.findUnique({ where: { ID: Number(id) } })
  if (!reporte) return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 })

  // Si es una Solicitud de Rol y se acepta explícitamente, migrar el usuario
  if (reporte.Tipo === 'Solicitud_Rol' && body.aceptar === true) {
    const match = reporte.Descripcion?.match(/rol:\s*(\w+)\.?$/)
    const rolSolicitado = match?.[1]

    if (rolSolicitado && rolSolicitado !== 'Cliente') {
      const cliente = await prisma.cliente.findUnique({ where: { ID: reporte.idReportante } })

      if (cliente) {
        const { Nombre, Email, Contrase_a } = cliente

        switch (rolSolicitado) {
          case 'Camionero': {
            const turno = await prisma.turnos.findFirst()
            if (!turno) return NextResponse.json({ error: 'No hay turnos disponibles' }, { status: 400 })
            await prisma.camionero.create({
              data: {
                Nombre, Email, Contrase_a,
                Licencia: 'B', Telf: '0000000000',
                idTurno: turno.ID,
                FechaInicio: new Date(),
                FechaFinal: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
              },
            })
            break
          }
          case 'Dispatcher':
            await prisma.dispatcher.create({
              data: { Nombre, Email: Email!, Contrase_a, CentroOperacion: 'Sin especificar' },
            })
            break
          case 'Administrador':
            await prisma.administrador.create({
              data: { Nombre, Email, Contrase_a, Permisos: 'Básicos' },
            })
            break
        }

        await prisma.cliente.delete({ where: { ID: cliente.ID } })
      }
    }

    body.Estado = 'Resuelto'
  }

  const updated = await prisma.reportes.update({
    where: { ID: Number(id) },
    data: { Estado: body.Estado },
  })
  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.reportes.delete({ where: { ID: Number(id) } })
  return NextResponse.json({ ok: true })
}
