"use client";

import ModalAceptarSolicitud from "@componentes/dispatcher/ModalAceptarSolicitud";
import { useState, useEffect } from "react";
import { Spinner, EmptyState } from "@componentes/ui";
import { 
  Eye, Edit, Trash2, Plus, Package, Calendar, User, 
  Clock, CheckCircle2, XCircle, Hourglass, List
} from 'lucide-react';
import {
  Solicitud,
  Cliente,
  filtrarSolicitudes,
  contarPorEstado,
  getEstadoColor,
  formatearFecha,
  obtenerSolicitudes,
  eliminarSolicitud
} from './logic';

type EstadoSolicitud = 'Pendiente' | 'En Proceso' | 'Aceptada' | 'Rechazada';
type FiltroSolicitud = 'todas' | 'pendientes' | 'en-proceso' | 'aceptadas' | 'rechazadas';

const TIPOS_SOLICITUD = [
  'Transporte de mercancías',
  'Transporte urgente',
  'Transporte refrigerado',
  'Transporte de carga pesada',
  'Mudanza',
  'Distribución',
  'Otro'
];

export default function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState<FiltroSolicitud>('todas');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalDetalles, setModalDetalles] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalProcesar, setModalProcesar] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<Solicitud | null>(null);
  const [nuevoCliente, setNuevoCliente] = useState('');
  const [nuevoTipo, setNuevoTipo] = useState('Transporte de mercancías');
  const [nuevoAsunto, setNuevoAsunto] = useState('');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [nuevoEstado, setNuevoEstado] = useState<EstadoSolicitud>('Pendiente');
  const [nuevaFechaServicio, setNuevaFechaServicio] = useState('');

  useEffect(() => {
    Promise.all([
      obtenerSolicitudes(),
      fetch('/api/clientes').then(res => res.json())
    ])
      .then(([solicitudesData, clientesData]) => {
        setSolicitudes(solicitudesData);
        setClientes(clientesData);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, []);

  async function handleEliminarSolicitud(id: number) {
    try {
      await eliminarSolicitud(id);
      setSolicitudes(solicitudes.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error al eliminar solicitud:', error);
    }
  }

  async function handleAceptarSolicitud(idCamionero: number) {
    if (!solicitudSeleccionada) return;
    try {
      const res = await fetch(`/api/solicitudes/${solicitudSeleccionada.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'Aceptada', idCamionero })
      });
      if (!res.ok) throw new Error('Error al aceptar');
      const actualizada = await res.json();
      setSolicitudes(solicitudes.map(s => s.id === actualizada.id ? actualizada : s));
      setModalProcesar(false);
    } catch (error) {
      console.error('Error al aceptar solicitud:', error);
      alert('Error al aceptar la solicitud');
    }
  }

  async function handleRechazarSolicitud(motivo: string) {
    if (!solicitudSeleccionada) return;
    try {
      const res = await fetch(`/api/solicitudes/${solicitudSeleccionada.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'Rechazada', motivoRechazo: motivo })
      });
      if (!res.ok) throw new Error('Error al rechazar');
      const actualizada = await res.json();
      setSolicitudes(solicitudes.map(s => s.id === actualizada.id ? actualizada : s));
      setModalProcesar(false);
    } catch (error) {
      console.error('Error al rechazar solicitud:', error);
      alert('Error al rechazar la solicitud');
    }
  }

  function handleProcesarSolicitud(solicitud: Solicitud) {
    setSolicitudSeleccionada(solicitud);
    setModalProcesar(true);
  }

  async function handleCrearSolicitud() {
    if (!nuevoCliente.trim() || !nuevoAsunto.trim()) return;
    try {
      const res = await fetch('/api/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cliente: nuevoCliente, 
          tipo: nuevoTipo, 
          asunto: nuevoAsunto, 
          descripcion: nuevaDescripcion, 
          estado: nuevoEstado,
          fechaServicio: nuevaFechaServicio ? new Date(nuevaFechaServicio).toISOString() : null
        })
      });
      if (!res.ok) throw new Error('Error al crear');
      const nuevaSolicitud = await res.json();
      setSolicitudes([nuevaSolicitud, ...solicitudes]);
      setModalAbierto(false);
      setNuevoCliente('');
      setNuevoTipo('Transporte de mercancías');
      setNuevoAsunto('');
      setNuevaDescripcion('');
      setNuevoEstado('Pendiente');
      setNuevaFechaServicio('');
    } catch (error) {
      console.error('Error al crear solicitud:', error);
    }
  }

  function handleVerDetalles(solicitud: Solicitud) {
    setSolicitudSeleccionada(solicitud);
    setModalDetalles(true);
  }

  function handleAbrirEditar(solicitud: Solicitud) {
    setSolicitudSeleccionada(solicitud);
    setNuevoCliente(solicitud.cliente);
    setNuevoTipo(solicitud.tipo);
    setNuevoAsunto(solicitud.asunto);
    setNuevaDescripcion(solicitud.descripcion || '');
    setNuevoEstado(solicitud.estado);
    setNuevaFechaServicio(solicitud.fechaServicio ? new Date(solicitud.fechaServicio).toISOString().slice(0, 16) : '');
    setModalEditar(true);
  }

  async function handleEditarSolicitud() {
    if (!solicitudSeleccionada || !nuevoCliente.trim() || !nuevoAsunto.trim()) return;
    try {
      const res = await fetch(`/api/solicitudes/${solicitudSeleccionada.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cliente: nuevoCliente, 
          tipo: nuevoTipo, 
          asunto: nuevoAsunto, 
          descripcion: nuevaDescripcion, 
          estado: nuevoEstado,
          fechaServicio: nuevaFechaServicio ? new Date(nuevaFechaServicio).toISOString() : null
        })
      });
      if (!res.ok) throw new Error('Error al actualizar');
      const actualizada = await res.json();
      setSolicitudes(solicitudes.map(s => s.id === actualizada.id ? actualizada : s));
      setModalEditar(false);
      setSolicitudSeleccionada(null);
      setNuevoCliente('');
      setNuevoTipo('Transporte de mercancías');
      setNuevoAsunto('');
      setNuevaDescripcion('');
      setNuevoEstado('Pendiente');
      setNuevaFechaServicio('');
    } catch (error) {
      console.error('Error al editar solicitud:', error);
    }
  }

  const solicitudesFiltradas = filtrarSolicitudes(solicitudes, filtro);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Modal Procesar Solicitud */}
      {modalProcesar && solicitudSeleccionada && (
        <ModalAceptarSolicitud
          solicitud={solicitudSeleccionada}
          onClose={() => setModalProcesar(false)}
          onAceptar={handleAceptarSolicitud}
          onRechazar={handleRechazarSolicitud}
        />
      )}

      {/* Modal Nueva Solicitud */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setModalAbierto(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-800">Nueva Solicitud</h2>
              <button onClick={() => setModalAbierto(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                  <User size={14} /> Cliente
                </label>
                <select
                  value={nuevoCliente}
                  onChange={e => setNuevoCliente(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar cliente...</option>
                  {clientes.map(cliente => (
                    <option key={cliente.ID} value={cliente.Nombre}>
                      {cliente.Nombre} - {cliente.NombreEmpresa}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                  <Package size={14} /> Tipo de Solicitud
                </label>
                <select
                  value={nuevoTipo}
                  onChange={e => setNuevoTipo(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {TIPOS_SOLICITUD.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                  Asunto / Servicio Solicitado
                </label>
                <input
                  type="text"
                  value={nuevoAsunto}
                  onChange={e => setNuevoAsunto(e.target.value)}
                  placeholder="Asunto de la solicitud..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={nuevaDescripcion}
                  onChange={e => setNuevaDescripcion(e.target.value)}
                  placeholder="Descripción detallada (opcional)..."
                  rows={4}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                  <Calendar size={14} /> Fecha de Servicio
                </label>
                <input
                  type="datetime-local"
                  value={nuevaFechaServicio}
                  onChange={e => setNuevaFechaServicio(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                  Estado
                </label>
                <select
                  value={nuevoEstado}
                  onChange={e => setNuevoEstado(e.target.value as EstadoSolicitud)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Aceptada">Aceptada</option>
                  <option value="Rechazada">Rechazada</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModalAbierto(false)}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCrearSolicitud}
                disabled={!nuevoCliente.trim() || !nuevoAsunto.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
                Crear Solicitud
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ver Detalles */}
      {modalDetalles && solicitudSeleccionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setModalDetalles(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-800">Detalles de Solicitud</h2>
              <button onClick={() => setModalDetalles(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">ID</label>
                <p className="text-slate-800 font-medium mt-1">#{solicitudSeleccionada.id}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Cliente</label>
                <p className="text-slate-800 font-medium mt-1">{solicitudSeleccionada.cliente}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Tipo</label>
                <p className="text-slate-800 font-medium mt-1">{solicitudSeleccionada.tipo}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Asunto</label>
                <p className="text-slate-800 font-medium mt-1">{solicitudSeleccionada.asunto}</p>
              </div>
              {solicitudSeleccionada.descripcion && (
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Descripción</label>
                  <p className="text-slate-800 font-medium mt-1">{solicitudSeleccionada.descripcion}</p>
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Fecha Solicitud</label>
                <p className="text-slate-800 font-medium mt-1">{formatearFecha(solicitudSeleccionada.fecha)}</p>
              </div>
              {solicitudSeleccionada.fechaServicio && (
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Fecha Servicio</label>
                  <p className="text-slate-800 font-medium mt-1">{formatearFecha(solicitudSeleccionada.fechaServicio)}</p>
                </div>
              )}
              {solicitudSeleccionada.hora && (
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Hora</label>
                  <p className="text-slate-800 font-medium mt-1">{solicitudSeleccionada.hora}</p>
                </div>
              )}
              {solicitudSeleccionada.origen && (
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Origen</label>
                  <p className="text-slate-800 font-medium mt-1">{solicitudSeleccionada.origen}</p>
                </div>
              )}
              {solicitudSeleccionada.destino && (
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Destino</label>
                  <p className="text-slate-800 font-medium mt-1">{solicitudSeleccionada.destino}</p>
                </div>
              )}
              {solicitudSeleccionada.representante && (
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Representante</label>
                  <p className="text-slate-800 font-medium mt-1">{solicitudSeleccionada.representante}</p>
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Estado</label>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getEstadoColor(solicitudSeleccionada.estado)}`}>
                    {solicitudSeleccionada.estado}
                  </span>
                </div>
              </div>
              {solicitudSeleccionada.motivoRechazo && (
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Motivo de Rechazo</label>
                  <p className="text-slate-800 font-medium mt-1">{solicitudSeleccionada.motivoRechazo}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModalDetalles(false)}
                className="flex-1 px-4 py-2.5 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Solicitud */}
      {modalEditar && solicitudSeleccionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setModalEditar(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-800">Editar Solicitud</h2>
              <button onClick={() => setModalEditar(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                  <User size={14} /> Cliente
                </label>
                <select
                  value={nuevoCliente}
                  onChange={e => setNuevoCliente(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar cliente...</option>
                  {clientes.map(cliente => (
                    <option key={cliente.ID} value={cliente.Nombre}>
                      {cliente.Nombre} - {cliente.NombreEmpresa}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                  <Package size={14} /> Tipo de Solicitud
                </label>
                <select
                  value={nuevoTipo}
                  onChange={e => setNuevoTipo(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {TIPOS_SOLICITUD.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                  Asunto / Servicio Solicitado
                </label>
                <input
                  type="text"
                  value={nuevoAsunto}
                  onChange={e => setNuevoAsunto(e.target.value)}
                  placeholder="Asunto de la solicitud..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={nuevaDescripcion}
                  onChange={e => setNuevaDescripcion(e.target.value)}
                  placeholder="Descripción detallada (opcional)..."
                  rows={4}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                  <Calendar size={14} /> Fecha de Servicio
                </label>
                <input
                  type="datetime-local"
                  value={nuevaFechaServicio}
                  onChange={e => setNuevaFechaServicio(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                  Estado
                </label>
                <select
                  value={nuevoEstado}
                  onChange={e => setNuevoEstado(e.target.value as EstadoSolicitud)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Aceptada">Aceptada</option>
                  <option value="Rechazada">Rechazada</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModalEditar(false)}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditarSolicitud}
                disabled={!nuevoCliente.trim() || !nuevoAsunto.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Edit size={16} />
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 lg:p-8" style={{ marginLeft: '256px' }}>
        <div className="max-w mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Gestión de Solicitudes de Servicio</h1>
              <p className="text-slate-500 mt-1 text-sm">Administra las solicitudes de tus clientes</p>
            </div>
            <button 
              onClick={() => setModalAbierto(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
            >
              <Plus size={18} />
              Nueva Solicitud
            </button>
          </div>

          {cargando ? (
            <div className="flex items-center justify-center py-24">
              <Spinner size="lg" text="Cargando solicitudes..." />
            </div>
          ) : (
            <>
              {/* Filtros */}
              <div className="bg-white rounded-xl border border-slate-200 p-1.5 mb-5">
                <div className="flex gap-1">
                  {[
                    { key: 'todas', label: 'Todas', count: solicitudes.length, icon: <List size={14} /> },
                    { key: 'pendientes', label: 'Pendientes', count: contarPorEstado(solicitudes, 'Pendiente'), icon: <Hourglass size={14} /> },
                    { key: 'en-proceso', label: 'En Proceso', count: contarPorEstado(solicitudes, 'En Proceso'), icon: <Clock size={14} /> },
                    { key: 'aceptadas', label: 'Aceptadas', count: contarPorEstado(solicitudes, 'Aceptada'), icon: <CheckCircle2 size={14} /> },
                    { key: 'rechazadas', label: 'Rechazadas', count: contarPorEstado(solicitudes, 'Rechazada'), icon: <XCircle size={14} /> },
                  ].map(({ key, label, count, icon }) => (
                    <button
                      key={key}
                      onClick={() => setFiltro(key as FiltroSolicitud)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold ${
                        filtro === key ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {icon}
                      {label}
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                        filtro === key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tabla */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5">ID</span>
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5"><User size={13} /> Cliente</span>
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5"><Package size={13} /> Tipo</span>
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5">Asunto</span>
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5"><Calendar size={13} /> Fecha Solicitud</span>
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5"><Calendar size={13} /> Fecha Servicio</span>
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5">Estado</span>
                        </th>
                        <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          <span className="flex items-center justify-center gap-1.5">Acciones</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {solicitudesFiltradas.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-5 py-16">
                            <EmptyState 
                              icon="bi-inbox" 
                              title={`No hay solicitudes ${filtro === 'todas' ? '' : filtro}`}
                              subtitle="Las solicitudes aparecerán aquí"
                            />
                          </td>
                        </tr>
                      ) : (
                        solicitudesFiltradas.map(solicitud => (
                          <tr key={solicitud.id} className="hover:bg-slate-50">
                            <td className="px-5 py-4">
                              <span className="text-sm font-semibold text-slate-800">
                                #{solicitud.id}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-sm font-medium text-slate-800">
                                {solicitud.cliente}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-sm text-slate-600">
                                {solicitud.tipo}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-sm text-slate-600">
                                {solicitud.asunto}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="flex items-center gap-1.5 text-sm text-slate-600">
                                <Clock size={13} className="text-slate-400" />
                                {formatearFecha(solicitud.fecha)}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              {solicitud.fechaServicio ? (
                                <span className="flex items-center gap-1.5 text-sm text-slate-600">
                                  <Calendar size={13} className="text-slate-400" />
                                  {formatearFecha(solicitud.fechaServicio)}
                                </span>
                              ) : (
                                <span className="text-sm text-slate-400">-</span>
                              )}
                            </td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getEstadoColor(solicitud.estado)}`}>
                                {solicitud.estado}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center justify-center gap-2">
                                {solicitud.estado === 'Pendiente' && (
                                  <button 
                                    onClick={() => handleProcesarSolicitud(solicitud)} 
                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" 
                                    title="Procesar solicitud"
                                  >
                                    <CheckCircle2 size={16} />
                                  </button>
                                )}
                                <button onClick={() => handleVerDetalles(solicitud)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="Ver detalles">
                                  <Eye size={16} />
                                </button>
                                <button onClick={() => handleAbrirEditar(solicitud)} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg" title="Editar">
                                  <Edit size={16} />
                                </button>
                                <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Eliminar" onClick={() => handleEliminarSolicitud(solicitud.id)}>
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
