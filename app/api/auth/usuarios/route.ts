import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@lib/prisma'

const POR_PAGINA = 12

export async function GET(req: NextRequest) {
  try {
    // ── Leer parámetros de la URL ──────────────────────────────────────────────
    // Ejemplo: /api/auth/usaurios?pagina=1&busqueda=juan&rol=cliente&estado=Activo
    const { searchParams } = req.nextUrl
    const pagina   = Math.max(1, Number(searchParams.get('pagina') || 1))
    const busqueda = searchParams.get('busqueda') || ''
    const rol      = searchParams.get('rol')      || 'Todos'
    const estado   = searchParams.get('estado')   || 'Todos'
    const skip     = (pagina - 1) * POR_PAGINA    // cuántos registros saltar

    // ── Filtro de búsqueda por nombre o email (aplica a todos los tipos) ───────
    // Prisma usa "contains" para buscar texto parcial, "mode: insensitive" = sin importar mayúsculas
    const filtroBusqueda = busqueda
      ? {
          OR: [
            { Nombre: { contains: busqueda, mode: 'insensitive' as const } },
            { Email:  { contains: busqueda, mode: 'insensitive' as const } },
          ],
        }
      : {}

    // ── Consultas paralelas por tipo de usuario ────────────────────────────────
    // Solo consultamos los tipos que corresponden al filtro de rol seleccionado.
    // Si rol === 'Todos', consultamos todos. Si no, solo el que corresponde.
    // Esto evita hacer 4 queries innecesarias cuando el usuario filtra por un rol específico.

    const debeConsultar = (tipo: string) => rol === 'Todos' || rol === tipo

    // Cada query devuelve { usuarios, total } para poder paginar correctamente
    const [
      { usuarios: admins,       total: totalAdmins },
      { usuarios: camioneros,   total: totalCamioneros },
      { usuarios: clientes,     total: totalClientes },
      { usuarios: dispatchers,  total: totalDispatchers },
    ] = await Promise.all([

      // ── Administradores ──
      debeConsultar('administrador')
        ? Promise.all([
            prisma.administrador.findMany({
              where: {
                ...filtroBusqueda,
                ...(estado !== 'Todos' ? { Estado: estado } : {}),
              },
              select: { ID: true, Nombre: true, Email: true, Estado: true },
              skip: rol === 'administrador' ? skip : 0, // paginación solo si es el único tipo
              take:  rol === 'administrador' ? POR_PAGINA : undefined,
            }),
            prisma.administrador.count({
              where: {
                ...filtroBusqueda,
                ...(estado !== 'Todos' ? { Estado: estado } : {}),
              },
            }),
          ]).then(([usuarios, total]) => ({ usuarios, total }))
        : Promise.resolve({ usuarios: [], total: 0 }),

      // ── Camioneros ──
      debeConsultar('camionero')
        ? Promise.all([
            prisma.camionero.findMany({
              where: {
                ...filtroBusqueda,
                ...(estado === 'Activo'   ? { Disponible: true }  : {}),
                ...(estado === 'Inactivo' ? { Disponible: false } : {}),
              },
              select: { ID: true, Nombre: true, Email: true, Disponible: true },
              skip: rol === 'camionero' ? skip : 0,
              take: rol === 'camionero' ? POR_PAGINA : undefined,
            }),
            prisma.camionero.count({
              where: {
                ...filtroBusqueda,
                ...(estado === 'Activo'   ? { Disponible: true }  : {}),
                ...(estado === 'Inactivo' ? { Disponible: false } : {}),
              },
            }),
          ]).then(([usuarios, total]) => ({ usuarios, total }))
        : Promise.resolve({ usuarios: [], total: 0 }),

      // ── Clientes ──
      debeConsultar('cliente')
        ? Promise.all([
            prisma.cliente.findMany({
              where: {
                ...filtroBusqueda,
                ...(estado !== 'Todos' ? { EstadoCuenta: estado } : {}),
              },
              select: { ID: true, Nombre: true, Email: true, EstadoCuenta: true },
              skip: rol === 'cliente' ? skip : 0,
              take: rol === 'cliente' ? POR_PAGINA : undefined,
            }),
            prisma.cliente.count({
              where: {
                ...filtroBusqueda,
                ...(estado !== 'Todos' ? { EstadoCuenta: estado } : {}),
              },
            }),
          ]).then(([usuarios, total]) => ({ usuarios, total }))
        : Promise.resolve({ usuarios: [], total: 0 }),

      // ── Dispatchers ──
      debeConsultar('dispatcher')
        ? Promise.all([
            prisma.dispatcher.findMany({
              where: filtroBusqueda,
              select: { ID: true, Nombre: true, Email: true },
              skip: rol === 'dispatcher' ? skip : 0,
              take: rol === 'dispatcher' ? POR_PAGINA : undefined,
            }),
            prisma.dispatcher.count({ where: filtroBusqueda }),
          ]).then(([usuarios, total]) => ({ usuarios, total }))
        : Promise.resolve({ usuarios: [], total: 0 }),
    ])

    // ── Combinar resultados y añadir el campo "tipo" a cada usuario ────────────
    const todosLosUsuarios = [
      ...admins.map(u      => ({ ...u, tipo: 'administrador' })),
      ...camioneros.map(u  => ({ ...u, tipo: 'camionero' })),
      ...clientes.map(u    => ({ ...u, tipo: 'cliente' })),
      ...dispatchers.map(u => ({ ...u, tipo: 'dispatcher' })),
    ]

    // ── Si el rol es 'Todos', paginamos aquí sobre la lista combinada ──────────
    // (porque los registros vienen de 4 tablas distintas y no podemos paginar en BD directamente)
    const usuariosPaginados = rol === 'Todos'
      ? todosLosUsuarios.slice(skip, skip + POR_PAGINA)
      : todosLosUsuarios

    const totalGeneral = totalAdmins + totalCamioneros + totalClientes + totalDispatchers

    return NextResponse.json({
      usuarios: usuariosPaginados,
      total: totalGeneral,           // total de registros (para calcular páginas en el frontend)
      pagina,
      totalPaginas: Math.ceil(totalGeneral / POR_PAGINA),
    })

  } catch (error: unknown) {
    console.error('Error en API usuarios:', error)
    const message = error instanceof Error ? error.message : 'Error desconocido'
    return NextResponse.json({ error: 'Error al obtener usuarios', details: message }, { status: 500 })
  }
}
