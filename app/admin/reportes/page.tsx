'use client'
import '@css/globals.css'
import { useEffect, useRef, useState } from 'react'

type Reporte = {
  ID: number
  Tipo: string
  FechaHora: string
  Estado: string
  idReportante: number
  rolReportante: string
}

const TIPOS = ['Problema Técnico', 'Incidencia', 'Sugerencia']
const PAGE_SIZE = 10

const badgeTipo: Record<string, string> = {
  'Problema Técnico': 'bg-red-100 text-red-700 ring-1 ring-red-200',
  'Incidencia': 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
  'Sugerencia': 'bg-violet-100 text-violet-700 ring-1 ring-violet-200',
}

const badgeEstado: Record<string, string> = {
  'Pendiente': 'bg-orange-100 text-orange-700 ring-1 ring-orange-200',
  'En revisión': 'bg-blue-100 text-blue-700 ring-1 ring-blue-200',
  'Resuelto': 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
  'Cerrado': 'bg-gray-100 text-gray-500 ring-1 ring-gray-200',
}

const iconoTipo: Record<string, string> = {
  'Problema Técnico': '🔧',
  'Incidencia': '⚠️',
  'Sugerencia': '💡',
}

export default function ReportesPage() {
  const [reportes, setReportes] = useState<Reporte[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [orden, setOrden] = useState<'asc' | 'desc'>('desc')
  const [pagina, setPagina] = useState(1)
  const [seleccionados, setSeleccionados] = useState<number[]>([])
  const [tipoOpen, setTipoOpen] = useState(false)
  const [calOpen, setCalOpen] = useState(false)
  const [calMes, setCalMes] = useState(() => new Date())
  const [fechaFiltro, setFechaFiltro] = useState<string>('')
  const tipoRef = useRef<HTMLDivElement>(null)
  const calRef = useRef<HTMLDivElement>(null)

  const totalPaginas = Math.max(1, Math.ceil(total / PAGE_SIZE))

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (tipoRef.current && !tipoRef.current.contains(e.target as Node)) setTipoOpen(false)
      if (calRef.current && !calRef.current.contains(e.target as Node)) setCalOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    setLoading(true)
    setSeleccionados([])
    const params = new URLSearchParams({
      busqueda,
      tipo: filtroTipo,
      orden,
      pagina: String(pagina),
      limite: String(PAGE_SIZE),
      ...(fechaFiltro ? { fecha: fechaFiltro } : {}),
    })
    fetch(`/api/reportes?${params}`)
      .then(r => r.json())
      .then(data => { setReportes(data.reportes ?? []); setTotal(data.total ?? 0) })
      .finally(() => setLoading(false))
  }, [busqueda, filtroTipo, orden, pagina, fechaFiltro])

  async function cambiarEstado(id: number, estado: string) {
    await fetch(`/api/reportes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Estado: estado }),
    })
    setReportes(prev => prev.map(r => r.ID === id ? { ...r, Estado: estado } : r))
  }

  async function eliminarSeleccionados() {
    await Promise.all(seleccionados.map(id =>
      fetch(`/api/reportes/${id}`, { method: 'DELETE' })
    ))
    setReportes(prev => prev.filter(r => !seleccionados.includes(r.ID)))
    setTotal(prev => prev - seleccionados.length)
    setSeleccionados([])
  }

  async function marcarMasivo(estado: string) {
    await Promise.all(seleccionados.map(id =>
      fetch(`/api/reportes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Estado: estado }),
      })
    ))
    setReportes(prev => prev.map(r => seleccionados.includes(r.ID) ? { ...r, Estado: estado } : r))
    setSeleccionados([])
  }

  function toggleSeleccion(id: number) {
    setSeleccionados(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function toggleTodos() {
    setSeleccionados(prev => prev.length === reportes.length ? [] : reportes.map(r => r.ID))
  }

  const diasEnMes = (y: number, m: number) => new Date(y, m + 1, 0).getDate()
  const primerDia = (y: number, m: number) => new Date(y, m, 1).getDay()
  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

  function seleccionarDia(dia: number) {
    const y = calMes.getFullYear()
    const m = String(calMes.getMonth() + 1).padStart(2, '0')
    const d = String(dia).padStart(2, '0')
    const fecha = `${y}-${m}-${d}`
    setFechaFiltro(prev => prev === fecha ? '' : fecha)
    setCalOpen(false)
    setPagina(1)
  }

  function formatId(id: number) {
    const hoy = new Date()
    return `#RP-${hoy.getFullYear()}${String(hoy.getMonth()+1).padStart(2,'0')}${String(hoy.getDate()).padStart(2,'0')}-${String(id).padStart(3,'0')}`
  }

  const pendientes = reportes.filter(r => r.Estado === 'Pendiente').length
  const enRevision = reportes.filter(r => r.Estado === 'En revisión').length
  const resueltos = reportes.filter(r => r.Estado === 'Resuelto').length

  return (
    <div className="bg-gray-50 min-h-screen p-8" style={{ marginLeft: '320px' }}>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">Gestión de Reportes</h1>
            <p className="text-gray-500 text-sm">Revisa y gestiona los reportes que requieren tu atención.</p>
          </div>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: total, color: 'bg-blue-600', icon: '📋', light: 'bg-blue-50 text-blue-700' },
          { label: 'Pendientes', value: pendientes, color: 'bg-orange-500', icon: '⏳', light: 'bg-orange-50 text-orange-700' },
          { label: 'En revisión', value: enRevision, color: 'bg-blue-500', icon: '🔍', light: 'bg-blue-50 text-blue-700' },
          { label: 'Resueltos', value: resueltos, color: 'bg-emerald-500', icon: '✅', light: 'bg-emerald-50 text-emerald-700' },
        ].map(({ label, value, icon, light }) => (
          <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${light}`}>{icon}</div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Barra de filtros */}
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <div className="flex items-center border border-gray-200 rounded-xl bg-white px-3 py-2.5 flex-1 min-w-[260px] shadow-sm">
          <svg className="w-4 h-4 text-gray-400 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por ID, usuario o palabra clave..."
            value={busqueda}
            onChange={e => { setBusqueda(e.target.value); setPagina(1) }}
            className="outline-none text-sm w-full bg-transparent text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Filtro Tipo */}
        <div className="relative" ref={tipoRef}>
          <button
            onClick={() => setTipoOpen(o => !o)}
            className="flex items-center gap-2 border border-gray-200 rounded-xl bg-white px-4 py-2.5 text-sm text-gray-700 min-w-[140px] justify-between shadow-sm hover:border-blue-400 transition-colors"
          >
            <span>{filtroTipo || 'Tipo de reporte'}</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {tipoOpen && (
            <div className="absolute z-20 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl w-52 overflow-hidden">
              <button onClick={() => { setFiltroTipo(''); setTipoOpen(false); setPagina(1) }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-600">
                Todos los tipos
              </button>
              {TIPOS.map(t => (
                <button key={t} onClick={() => { setFiltroTipo(t); setTipoOpen(false); setPagina(1) }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2">
                  <span>{iconoTipo[t]}</span>{t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filtro fecha */}
        <div className="relative" ref={calRef}>
          <button
            onClick={() => setCalOpen(o => !o)}
            className={`flex items-center gap-2 border rounded-xl bg-white px-4 py-2.5 text-sm min-w-[160px] justify-between shadow-sm transition-colors ${fechaFiltro ? 'border-blue-400 text-blue-600' : 'border-gray-200 text-gray-700 hover:border-blue-400'}`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{fechaFiltro || 'Filtrar por fecha'}</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {calOpen && (
            <div className="absolute z-20 right-0 mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl p-4 w-72">
              <div className="flex items-center justify-between mb-3">
                <button onClick={() => setCalMes(d => new Date(d.getFullYear(), d.getMonth()-1, 1))} className="p-1.5 hover:bg-gray-100 rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                </button>
                <span className="font-semibold text-sm text-gray-800">{meses[calMes.getMonth()]} {calMes.getFullYear()}</span>
                <button onClick={() => setCalMes(d => new Date(d.getFullYear(), d.getMonth()+1, 1))} className="p-1.5 hover:bg-gray-100 rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
              <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-2 font-medium">
                {['Do','Lu','Ma','Mi','Ju','Vi','Sa'].map(d => <span key={d}>{d}</span>)}
              </div>
              <div className="grid grid-cols-7 text-center text-sm gap-y-1">
                {Array.from({ length: primerDia(calMes.getFullYear(), calMes.getMonth()) }).map((_, i) => (
                  <span key={`e${i}`} />
                ))}
                {Array.from({ length: diasEnMes(calMes.getFullYear(), calMes.getMonth()) }, (_, i) => i + 1).map(dia => {
                  const y = calMes.getFullYear()
                  const m = String(calMes.getMonth() + 1).padStart(2, '0')
                  const d = String(dia).padStart(2, '0')
                  const isSelected = fechaFiltro === `${y}-${m}-${d}`
                  return (
                    <button key={dia} onClick={() => seleccionarDia(dia)}
                      className={`rounded-full w-7 h-7 mx-auto flex items-center justify-center text-xs transition-colors hover:bg-blue-100 ${isSelected ? 'bg-blue-600 text-white hover:bg-blue-600' : 'text-gray-700'}`}>
                      {dia}
                    </button>
                  )
                })}
              </div>
              {fechaFiltro && (
                <button onClick={() => { setFechaFiltro(''); setPagina(1) }} className="mt-3 w-full text-xs text-blue-600 hover:underline">
                  Limpiar fecha
                </button>
              )}
              <div className="mt-3 flex gap-2">
                <button onClick={() => { setOrden('asc'); setCalOpen(false) }} className={`flex-1 text-xs py-1.5 rounded-lg border font-medium transition-colors ${orden==='asc' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>↑ Más antiguo</button>
                <button onClick={() => { setOrden('desc'); setCalOpen(false) }} className={`flex-1 text-xs py-1.5 rounded-lg border font-medium transition-colors ${orden==='desc' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>↓ Más reciente</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-blue-600" />
            <p className="text-sm text-gray-400">Cargando reportes...</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3.5 w-10">
                  <input type="checkbox" checked={seleccionados.length === reportes.length && reportes.length > 0} onChange={toggleTodos}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </th>
                {['ID de Reporte', 'Usuario', 'Tipo', 'Fecha y Hora', 'Estado', 'Acciones'].map(col => (
                  <th key={col} className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reportes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">📭</span>
                      <p className="text-gray-400 text-sm">No hay reportes que mostrar</p>
                    </div>
                  </td>
                </tr>
              ) : reportes.map(r => (
                <tr key={r.ID} className={`hover:bg-blue-50/30 transition-colors ${seleccionados.includes(r.ID) ? 'bg-blue-50/50' : ''}`}>
                  <td className="px-5 py-4">
                    <input type="checkbox" checked={seleccionados.includes(r.ID)} onChange={() => toggleSeleccion(r.ID)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">{formatId(r.ID)}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                        {r.rolReportante?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{r.rolReportante}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${badgeTipo[r.Tipo] ?? 'bg-gray-100 text-gray-600'}`}>
                      {iconoTipo[r.Tipo] ?? '📄'} {r.Tipo}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {new Date(r.FechaHora).toLocaleString('es-ES', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${badgeEstado[r.Estado] ?? 'bg-gray-100 text-gray-500'}`}>
                      {r.Estado}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                        Ver
                      </button>
                      <button onClick={() => cambiarEstado(r.ID, 'Resuelto')}
                        className="px-3 py-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors">
                        ✓ Resolver
                      </button>
                      <button onClick={() => cambiarEstado(r.ID, 'Cerrado')}
                        className="px-3 py-1.5 text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        ✕ Cerrar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer: paginación + acciones masivas */}
      <div className="flex items-center justify-between mt-5 flex-wrap gap-4">
        {/* Acciones masivas */}
        {seleccionados.length > 0 ? (
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
            <span className="text-sm text-gray-500 mr-1">{seleccionados.length} seleccionados</span>
            <button onClick={() => marcarMasivo('Resuelto')}
              className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors">
              ✓ Resolver
            </button>
            <button onClick={() => marcarMasivo('En revisión')}
              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
              🔍 En revisión
            </button>
            <button onClick={eliminarSeleccionados}
              className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors">
              🗑 Eliminar
            </button>
          </div>
        ) : <div />}

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="flex items-center gap-1">
            <button onClick={() => setPagina(1)} disabled={pagina === 1}
              className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors">«</button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPagina(p)}
                className={`w-8 h-8 flex items-center justify-center border rounded-lg text-sm font-medium transition-colors ${p === pagina ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPagina(totalPaginas)} disabled={pagina === totalPaginas}
              className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors">»</button>
          </div>
        )}
      </div>
    </div>
  )
}
