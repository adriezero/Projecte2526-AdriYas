'use client'
import '@css/globals.css'
import { useEffect, useState } from 'react'

// ─── Tipo de dato que representa un usuario del sistema ───────────────────────
// Cada campo opcional (?) puede o no venir según el tipo de usuario (cliente, camionero, etc.)
type Usuario = {
  ID: number
  Nombre: string
  Email: string | null
  tipo: string        // Rol: administrador, cliente, camionero, dispatcher
  Estado?: string     // Campo de estado para algunos tipos de usuario
  EstadoCuenta?: string
  Disponible?: boolean
}

// ─── Opciones fijas para los filtros ─────────────────────────────────────────
const ROLES   = ['Todos', 'administrador', 'cliente', 'camionero', 'dispatcher']
const ESTADOS = ['Todos', 'Activo', 'Inactivo', 'suspendido', 'Pendiente']

// ─── Columnas que se pueden ordenar en la tabla ───────────────────────────────
type ColOrdenable = 'Nombre' | 'Email' | 'tipo'

export default function GestionUsersPage() {

  // Lista de usuarios de la página actual (ya filtrados y paginados por el servidor)
  const [usuarios,     setUsuarios]     = useState<Usuario[]>([])
  const [loading,      setLoading]      = useState(true)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [totalUsuarios, setTotalUsuarios] = useState(0)

  // Paginación
  const [pagina, setPagina] = useState(1)

  // Valores del formulario (lo que el usuario escribe/selecciona antes de aplicar)
  const [busqueda,     setBusqueda]     = useState('')
  const [filtroRol,    setFiltroRol]    = useState('Todos')
  const [filtroEstado, setFiltroEstado] = useState('Todos')

  // Valores activos (los que se envían a la API al aplicar el filtro)
  const [busquedaAplicada,  setBusquedaAplicada]  = useState('')
  const [rolAplicado,       setRolAplicado]       = useState('Todos')
  const [estadoAplicado,    setEstadoAplicado]    = useState('Todos')

  // Control de apertura/cierre de los dropdowns
  const [dropRol,    setDropRol]    = useState(false)
  const [dropEstado, setDropEstado] = useState(false)

  // Modal de confirmación de borrado
  const [modalBorrar, setModalBorrar] = useState<{ id: number; tipo: string; nombre: string } | null>(null)

  // ─── Elimina el usuario tras confirmar ──────────────────────────────────────
  async function confirmarBorrado() {
    if (!modalBorrar) return
    await fetch(`/api/auth/usuarios/${modalBorrar.tipo}/${modalBorrar.id}`, { method: 'DELETE' })
    setModalBorrar(null)
    // Recarga la página actual
    setUsuarios(prev => prev.filter(u => !(u.ID === modalBorrar.id && u.tipo === modalBorrar.tipo)))
    setTotalUsuarios(prev => prev - 1)
  }

  // Ordenamiento local (sobre la página actual)
  const [orden, setOrden] = useState<{ col: ColOrdenable | null; dir: 'asc' | 'desc' }>({
    col: null,
    dir: 'asc',
  })

  // ─── Llama a la API cada vez que cambian los filtros aplicados o la página ───
  // El servidor filtra y pagina, el frontend solo recibe los 12 usuarios de esa página
  useEffect(() => {
    setLoading(true)

    // Construimos la URL con los parámetros de filtro y paginación
    const params = new URLSearchParams({
      pagina:   String(pagina),
      busqueda: busquedaAplicada,
      rol:      rolAplicado,
      estado:   estadoAplicado,
    })

    fetch(`/api/auth/usuarios?${params}`)
      .then(res => res.json())
      .then(data => {
        setUsuarios(data.usuarios)
        setTotalPaginas(data.totalPaginas)
        setTotalUsuarios(data.total)
        setLoading(false)
      })
  }, [pagina, busquedaAplicada, rolAplicado, estadoAplicado]) // se re-ejecuta cuando cambia alguno

  // ─── Alterna el orden de una columna (asc → desc → asc...) ──────────────────
  function toggleOrden(col: ColOrdenable) {
    setOrden(prev =>
      prev.col === col
        ? { col, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { col, dir: 'asc' }
    )
  }

  // ─── Aplica los filtros y vuelve a la página 1 ───────────────────────────────
  function aplicarFiltros() {
    setRolAplicado(filtroRol)
    setEstadoAplicado(filtroEstado)
    setBusquedaAplicada(busqueda)
    setPagina(1)
  }

  // ─── Limpia todos los filtros ────────────────────────────────────────────────
  function limpiarFiltros() {
    setBusqueda('')
    setFiltroRol('Todos')
    setFiltroEstado('Todos')
    setRolAplicado('Todos')
    setEstadoAplicado('Todos')
    setBusquedaAplicada('')
    setPagina(1)
  }

  // ─── Obtiene el estado legible de un usuario (normaliza los 3 campos posibles)
  function getEstado(u: Usuario): string | null {
    if (u.Estado)       return u.Estado
    if (u.EstadoCuenta) return u.EstadoCuenta
    if (u.Disponible !== undefined) return u.Disponible ? 'Activo' : 'Inactivo'
    return null
  }

  // ─── Orden local sobre los usuarios de la página actual ─────────────────────
  // (el filtrado ya lo hizo el servidor, aquí solo ordenamos los 12 que tenemos)
  const usuariosPagina = orden.col
    ? [...usuarios].sort((a, b) => {
        const va = (a[orden.col!] || '').toString().toLowerCase()
        const vb = (b[orden.col!] || '').toString().toLowerCase()
        return orden.dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      })
    : usuarios

  // ─── Pantalla de carga ───────────────────────────────────────────────────────
  if (loading) return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center" style={{ marginLeft: '320px' }}>
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        <p className="mt-4 text-gray-600">Cargando usuarios...</p>
      </div>
    </div>
  )

  // ─── Render principal ────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-50 p-8" style={{ marginLeft: '320px' }}>
      <div className="max-w-full">

        {/* Título de la página */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-2">Administra los usuarios del sistema</p>
        </div>

        {/* ── Barra de filtros ── */}
        <div className="mb-6 flex gap-4 items-center flex-wrap">

          {/* Buscador de texto libre */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <i className="bi bi-search" />
            </span>
            <input
              type="text"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Busca por nombre, email o rol..."
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-72"
            />
          </div>

          {/* Dropdown: filtro por rol */}
          <span className="text-sm text-gray-600 font-medium">Filtrar por Rol:</span>
          <Dropdown
            valor={filtroRol}
            opciones={ROLES}
            abierto={dropRol}
            onToggle={() => { setDropRol(!dropRol); setDropEstado(false) }}
            onSelect={r => { setFiltroRol(r); setDropRol(false) }}
            minWidth="120px"
          />

          {/* Dropdown: filtro por estado */}
          <span className="text-sm text-gray-600 font-medium">Filtrar por estado:</span>
          <Dropdown
            valor={filtroEstado}
            opciones={ESTADOS}
            abierto={dropEstado}
            onToggle={() => { setDropEstado(!dropEstado); setDropRol(false) }}
            onSelect={e => { setFiltroEstado(e); setDropEstado(false) }}
            minWidth="140px"
          />

          {/* Botones de acción */}
          <div className="ml-auto flex gap-3">
            <button
              onClick={aplicarFiltros}
              className="px-5 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-900 font-medium"
            >
              Aplicar Filtro
            </button>
            <button
              onClick={limpiarFiltros}
              className="px-5 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 font-medium"
            >
              Limpiar Filtro
            </button>
          </div>
        </div>

        {/* ── Tabla de usuarios ── */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {/* Columnas ordenables */}
                  {(['Nombre', 'Email', 'tipo'] as ColOrdenable[]).map(col => (
                    <th
                      key={col}
                      onClick={() => toggleOrden(col)}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100"
                    >
                      <span className="flex items-center gap-1">
                        {col === 'tipo' ? 'Rol' : col}
                        {/* Indicador de dirección de orden */}
                        <span className="text-gray-400">
                          {orden.col === col ? (orden.dir === 'asc' ? '↑' : '↓') : '↕'}
                        </span>
                      </span>
                    </th>
                  ))}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {usuariosPagina.map((usuario, i) => {
                  const estado = getEstado(usuario)
                  const esActivo = usuario.Estado === 'Disponible' || usuario.EstadoCuenta === 'Disponible' || usuario.Disponible

                  return (
                    <tr key={`${usuario.ID}-${i}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{usuario.Nombre}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{usuario.Email || 'N/A'}</td>

                      {/* Rol con badge azul */}
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {usuario.tipo}
                        </span>
                      </td>

                      {/* Estado con badge verde (activo) o rojo (inactivo) */}
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          esActivo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {estado || 'Inactivo'}
                        </span>
                      </td>

                      {/* Botones de acción por fila */}
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-3">
                          <button className="text-blue-600 hover:text-blue-800" title="Editar">
                            <i className="bi bi-pencil-fill" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800"
                            title="Eliminar"
                            onClick={() => setModalBorrar({ id: usuario.ID, tipo: usuario.tipo, nombre: usuario.Nombre })}
                          >
                            <i className="bi bi-trash3-fill" />
                          </button>
                          <button className="text-gray-600 hover:text-black" title="Ver detalle">
                            <i className="bi bi-list" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Paginación ── */}
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-600">Mostrando {totalUsuarios} usuarios</p>

          <div className="flex gap-2">
            {/* Botón anterior */}
            <button
              onClick={() => setPagina(pagina - 1)}
              disabled={pagina === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              <i className="bi bi-arrow-left" />
            </button>

            {/* Números de página */}
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPagina(p)}
                className={`px-4 py-2 border rounded-lg text-sm ${
                  pagina === p ? 'bg-blue-600 text-white' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}

            {/* Botón siguiente */}
            <button
              onClick={() => setPagina(pagina + 1)}
              disabled={pagina === totalPaginas}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              <i className="bi bi-arrow-right" />
            </button>
          </div>
        </div>

      </div>

      {/* ── Modal de confirmación de borrado ── */}
      {modalBorrar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Confirmar Eliminación</h2>
            <p className="text-gray-700 mb-1">
              ¿Estás seguro de que deseas eliminar a <strong>{modalBorrar.nombre}</strong>?
            </p>
            <p className="text-red-600 text-sm mb-6">Esta acción es irreversible y eliminará permanentemente todos los datos asociados.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setModalBorrar(null)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarBorrado}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Eliminar Usuario
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

// ─── Componente reutilizable: Dropdown genérico ───────────────────────────────
// Recibe las opciones, el valor actual y callbacks para abrir/seleccionar
function Dropdown({
  valor, opciones, abierto, onToggle, onSelect, minWidth,
}: {
  valor: string
  opciones: string[]
  abierto: boolean
  onToggle: () => void
  onSelect: (opcion: string) => void
  minWidth: string
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm justify-between"
        style={{ minWidth }}
      >
        {valor} <i className="bi bi-chevron-down" />
      </button>

      {/* Lista de opciones, solo visible cuando abierto === true */}
      {abierto && (
        <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg w-full">
          {opciones.map(op => (
            <div
              key={op}
              onClick={() => onSelect(op)}
              className="px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer text-center"
            >
              {op}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
