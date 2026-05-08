"use client";

import BarraLateral from "@componentes/dispatcher/BarraLateral";
import { useState, useEffect } from "react";
import { 
  Plus, Search, ChevronLeft, ChevronRight, Calendar as CalendarIcon,
  Clock, MapPin, User, XCircle, Truck
} from 'lucide-react';
import {
  Reserva,
  Cliente,
  obtenerReservas,
  crearReserva,
  formatearFecha,
  obtenerDiasDelMes,
  obtenerNombreMes
} from './logic';

export default function Reservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [reservasFiltradas, setReservasFiltradas] = useState<Reserva[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  
  const [mesActual, setMesActual] = useState(new Date().getMonth());
  const [yearActual, setYearActual] = useState(new Date().getFullYear());
  
  const [nuevaFechaInicio, setNuevaFechaInicio] = useState('');
  const [nuevaFechaFin, setNuevaFechaFin] = useState('');
  const [nuevaHora, setNuevaHora] = useState('');
  const [nuevoRepresentante, setNuevoRepresentante] = useState('');
  const [nuevoOrigen, setNuevoOrigen] = useState('');
  const [nuevoDestino, setNuevoDestino] = useState('');
  const [nuevoMotivo, setNuevoMotivo] = useState('Transporte');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');

  useEffect(() => {
    cargarReservas();
    cargarClientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mesActual, yearActual]);

  useEffect(() => {
    filtrarReservas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busqueda, reservas]);

  async function cargarReservas() {
    setCargando(true);
    try {
      const data = await obtenerReservas(mesActual + 1, yearActual);
      setReservas(data);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
    } finally {
      setCargando(false);
    }
  }

  async function cargarClientes() {
    try {
      const res = await fetch('/api/clientes');
      if (!res.ok) throw new Error('Error al cargar clientes');
      const data = await res.json();
      setClientes(data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  }

  function filtrarReservas() {
    if (!busqueda.trim()) {
      setReservasFiltradas(reservas);
      return;
    }
    
    const termino = busqueda.toLowerCase();
    const filtradas = reservas.filter(r => 
      r.ID.toString().includes(termino) ||
      r.Representante.toLowerCase().includes(termino) ||
      r.Origen.toLowerCase().includes(termino) ||
      r.Destino.toLowerCase().includes(termino)
    );
    setReservasFiltradas(filtradas);
  }

  async function handleCrearReserva() {
    if (!nuevaFechaInicio || !nuevaHora || !nuevoRepresentante || !nuevoOrigen || !nuevoDestino) return;
    
    try {
      const nuevaReserva = await crearReserva(
        nuevaFechaInicio,
        nuevaFechaFin || nuevaFechaInicio,
        nuevaHora,
        nuevoRepresentante,
        nuevoOrigen,
        nuevoDestino,
        nuevoMotivo,
        nuevaDescripcion
      );
      setReservas([...reservas, nuevaReserva]);
      setModalAbierto(false);
      limpiarFormulario();
    } catch (error) {
      console.error('Error al crear reserva:', error);
    }
  }

  function limpiarFormulario() {
    setNuevaFechaInicio('');
    setNuevaFechaFin('');
    setNuevaHora('');
    setNuevoRepresentante('');
    setNuevoOrigen('');
    setNuevoDestino('');
    setNuevoMotivo('Transporte');
    setNuevaDescripcion('');
  }

  function cambiarMes(direccion: number) {
    let nuevoMes = mesActual + direccion;
    let nuevoYear = yearActual;
    
    if (nuevoMes > 11) {
      nuevoMes = 0;
      nuevoYear++;
    } else if (nuevoMes < 0) {
      nuevoMes = 11;
      nuevoYear--;
    }
    
    setMesActual(nuevoMes);
    setYearActual(nuevoYear);
  }

  function obtenerReservasDelDia(dia: Date): Reserva[] {
    return reservas.filter(r => {
      const fechaReserva = new Date(r.Fecha);
      return fechaReserva.getDate() === dia.getDate() &&
             fechaReserva.getMonth() === dia.getMonth() &&
             fechaReserva.getFullYear() === dia.getFullYear();
    });
  }

  const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const diasDelMes = obtenerDiasDelMes(mesActual, yearActual);
  const primerDiaSemana = (new Date(yearActual, mesActual, 1).getDay() + 6) % 7;

  return (
    <div className="min-h-screen bg-slate-50">
      <BarraLateral />

      {/* Modal Nueva Reserva */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setModalAbierto(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-800">Nueva Reserva</h2>
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
                  value={nuevoRepresentante}
                  onChange={e => setNuevoRepresentante(e.target.value)}
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
                  <CalendarIcon size={14} /> Rango de Fechas
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={nuevaFechaInicio}
                    onChange={e => setNuevaFechaInicio(e.target.value)}
                    placeholder="Fecha inicio"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="date"
                    value={nuevaFechaFin}
                    onChange={e => setNuevaFechaFin(e.target.value)}
                    placeholder="Fecha fin"
                    min={nuevaFechaInicio}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                  <Clock size={14} /> Hora
                </label>
                <input
                  type="time"
                  value={nuevaHora}
                  onChange={e => setNuevaHora(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                  <MapPin size={14} /> Origen - Destino
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={nuevoOrigen}
                    onChange={e => setNuevoOrigen(e.target.value)}
                    placeholder="Origen..."
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={nuevoDestino}
                    onChange={e => setNuevoDestino(e.target.value)}
                    placeholder="Destino..."
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={nuevaDescripcion}
                  onChange={e => setNuevaDescripcion(e.target.value)}
                  placeholder="Detalles adicionales..."
                  rows={3}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
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
                onClick={handleCrearReserva}
                disabled={!nuevaFechaInicio || !nuevaHora || !nuevoRepresentante || !nuevoOrigen || !nuevoDestino}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
                Crear Reserva
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 lg:p-8" style={{ marginLeft: '256px' }}>
        <div className="max-w-screen-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Gestión de Reservas</h1>
            <p className="text-slate-500 mt-1 text-sm">Administra y visualiza las reservas en el calendario</p>
          </div>

          <div className="flex gap-6">
            {/* Calendario - 70% */}
            <div className="flex-[0_0_70%]">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                {/* Header del Calendario */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">
                    {obtenerNombreMes(mesActual)} {yearActual}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => cambiarMes(-1)}
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => {
                        setMesActual(new Date().getMonth());
                        setYearActual(new Date().getFullYear());
                      }}
                      className="px-3 py-2 hover:bg-slate-100 rounded-lg text-sm font-semibold text-slate-600"
                    >
                      Hoy
                    </button>
                    <button
                      onClick={() => cambiarMes(1)}
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                {/* Días de la semana */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {diasSemana.map(dia => (
                    <div key={dia} className="text-center text-xs font-semibold text-slate-500 uppercase py-2">
                      {dia}
                    </div>
                  ))}
                </div>

                {/* Días del mes */}
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: primerDiaSemana }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}
                  
                  {diasDelMes.map((dia, index) => {
                    const reservasDelDia = obtenerReservasDelDia(dia);
                    const esHoy = dia.toDateString() === new Date().toDateString();
                    
                    return (
                      <div
                        key={index}
                        className={`aspect-square border rounded-lg p-2 ${
                          esHoy ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`text-sm font-semibold mb-1 ${
                          esHoy ? 'text-blue-600' : 'text-slate-700'
                        }`}>
                          {dia.getDate()}
                        </div>
                        <div className="space-y-1">
                          {reservasDelDia.slice(0, 2).map(reserva => (
                            <div
                              key={reserva.ID}
                              className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded truncate"
                              title={`${reserva.Hora} - ${reserva.Representante}`}
                            >
                              {reserva.Hora} {reserva.Representante}
                            </div>
                          ))}
                          {reservasDelDia.length > 2 && (
                            <div className="text-xs text-slate-500 font-medium">
                              +{reservasDelDia.length - 2} más
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Panel Lateral - 30% */}
            <div className="flex-[0_0_30%]">
              <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-6">
                {/* Búsqueda */}
                <div className="mb-6">
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Buscar Reservas
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={busqueda}
                      onChange={e => setBusqueda(e.target.value)}
                      placeholder="ID, nombre, origen..."
                      className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Lista de Reservas */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">
                    Reservas del Mes ({reservasFiltradas.length})
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {cargando ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Truck size={32} className="text-slate-400 animate-pulse" />
                        <p className="text-sm text-slate-500 mt-2">Cargando...</p>
                      </div>
                    ) : reservasFiltradas.length === 0 ? (
                      <div className="text-center py-8">
                        <CalendarIcon size={32} className="text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">No hay reservas</p>
                      </div>
                    ) : (
                      reservasFiltradas.map(reserva => (
                        <div
                          key={reserva.ID}
                          className="p-3 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-500">#{reserva.ID}</span>
                            <span className="text-xs text-slate-500">{formatearFecha(reserva.Fecha)}</span>
                          </div>
                          <div className="text-sm font-semibold text-slate-800 mb-1">
                            {reserva.Representante}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-600 mb-1">
                            <Clock size={12} />
                            {reserva.Hora}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-600">
                            <MapPin size={12} />
                            {reserva.Origen} → {reserva.Destino}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Botón Nueva Reserva */}
                <button
                  onClick={() => setModalAbierto(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                >
                  <Plus size={18} />
                  Nueva Reserva
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
