"use client";

import { useState, useEffect } from "react";
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon,
  Clock, User, Truck, MapPin, CheckCircle2, AlertTriangle, X
} from 'lucide-react';
import {
  CamioneroTurno,
  ServicioCamionero,
  obtenerCamionerosTurnos,
  obtenerServiciosCamionero,
  finalizarServicio,
  reportarIncidencia,
  formatearFecha,
  obtenerDiasDelMes,
  obtenerNombreMes
} from './logic';

export default function Horario() {
  const [camioneros, setCamioneros] = useState<CamioneroTurno[]>([]);
  const [servicios, setServicios] = useState<ServicioCamionero[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mesActual, setMesActual] = useState(new Date().getMonth());
  const [yearActual, setYearActual] = useState(new Date().getFullYear());
  const [diaSeleccionado, setDiaSeleccionado] = useState<Date | null>(null);
  const [servicioDetalle, setServicioDetalle] = useState<ServicioCamionero | null>(null);
  const [modalIncidencia, setModalIncidencia] = useState(false);
  const [tipoIncidencia, setTipoIncidencia] = useState('');
  const [descIncidencia, setDescIncidencia] = useState('');
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mesActual, yearActual]);

  async function cargarDatos() {
    setCargando(true);
    try {
      const [turnos, svcs] = await Promise.all([
        obtenerCamionerosTurnos(mesActual + 1, yearActual),
        obtenerServiciosCamionero(mesActual + 1, yearActual),
      ]);
      setCamioneros(turnos);
      setServicios(svcs);
    } catch (error) {
      console.error('Error al cargar horario:', error);
    } finally {
      setCargando(false);
    }
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

  function obtenerCamionerosPorDia(dia: Date): CamioneroTurno[] {
    return camioneros.filter(c => {
      const inicio = new Date(c.FechaInicio);
      const final = new Date(c.FechaFinal);
      const diaActual = new Date(dia);
      diaActual.setHours(0, 0, 0, 0);
      inicio.setHours(0, 0, 0, 0);
      final.setHours(0, 0, 0, 0);
      return diaActual >= inicio && diaActual <= final;
    });
  }

  function obtenerServiciosPorDia(dia: Date): ServicioCamionero[] {
    return servicios.filter(s => {
      if (!s.fechaServicio) return false;
      const fechaInicio = new Date(s.fechaServicio);
      const fechaFin = s.fechaFin ? new Date(s.fechaFin) : fechaInicio;
      const diaActual = new Date(dia);
      diaActual.setHours(0, 0, 0, 0);
      fechaInicio.setHours(0, 0, 0, 0);
      fechaFin.setHours(0, 0, 0, 0);
      return diaActual >= fechaInicio && diaActual <= fechaFin;
    });
  }

  const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const diasDelMes = obtenerDiasDelMes(mesActual, yearActual);
  const primerDiaSemana = (new Date(yearActual, mesActual, 1).getDay() + 6) % 7;
  
  const camionerosDiaSeleccionado = diaSeleccionado ? obtenerCamionerosPorDia(diaSeleccionado) : [];
  const serviciosDiaSeleccionado = diaSeleccionado ? obtenerServiciosPorDia(diaSeleccionado) : [];

  async function handleFinalizar(servicio: ServicioCamionero) {
    setProcesando(true);
    try {
      await finalizarServicio(servicio.id);
      setServicios(prev => prev.filter(s => s.id !== servicio.id));
      setServicioDetalle(null);
    } catch (e) {
      console.error(e);
    } finally {
      setProcesando(false);
    }
  }

  async function handleReportarIncidencia() {
    if (!tipoIncidencia || !servicioDetalle) return;
    setProcesando(true);
    try {
      await reportarIncidencia(descIncidencia, tipoIncidencia);
      setModalIncidencia(false);
      setTipoIncidencia('');
      setDescIncidencia('');
    } catch (e) {
      console.error(e);
    } finally {
      setProcesando(false);
    }
  }

  return (
    <>
    <div className="min-h-screen" style={{ backgroundColor: '#F2F2F2' }}>

      <div className="p-4 md:p-6 lg:p-8 md:ml-64" style={{ marginLeft: '256px' }}>
        <div className="max-w-screen-2xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#2C2C2C' }}>Horarios y Turnos</h1>
            <p className="text-gray-600 mt-1 text-sm">Visualiza los turnos de los camioneros en el calendario</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Calendario - 70% */}
            <div className="flex-1 lg:flex-[0_0_70%]">
              <div className="bg-white rounded-xl shadow-sm p-4 md:p-6" style={{ borderWidth: '1px', borderColor: '#A6A6A6' }}>
                {/* Header del Calendario */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl md:text-2xl font-bold" style={{ color: '#2C2C2C' }}>
                    {obtenerNombreMes(mesActual)} {yearActual}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => cambiarMes(-1)}
                      className="p-2 hover:bg-gray-100 rounded-xl text-gray-700 transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => {
                        setMesActual(new Date().getMonth());
                        setYearActual(new Date().getFullYear());
                      }}
                      className="px-3 py-2 hover:bg-gray-100 rounded-xl text-sm font-semibold text-gray-700 transition-colors"
                    >
                      Hoy
                    </button>
                    <button
                      onClick={() => cambiarMes(1)}
                      className="p-2 hover:bg-gray-100 rounded-xl text-gray-700 transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                {/* Días de la semana */}
                <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
                  {diasSemana.map(dia => (
                    <div key={dia} className="text-center text-xs font-semibold text-gray-600 uppercase py-2">
                      {dia}
                    </div>
                  ))}
                </div>

                {/* Días del mes */}
                <div className="grid grid-cols-7 gap-1 md:gap-2">
                  {Array.from({ length: primerDiaSemana }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}
                  
                  {diasDelMes.map((dia, index) => {
                    const camionerosDia = obtenerCamionerosPorDia(dia);
                    const serviciosDia = obtenerServiciosPorDia(dia);
                    const esHoy = dia.toDateString() === new Date().toDateString();
                    const esSeleccionado = diaSeleccionado?.toDateString() === dia.toDateString();
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setDiaSeleccionado(dia)}
                        className={`aspect-square border rounded-xl p-1 md:p-2 transition-all shadow-sm ${
                          esSeleccionado ? 'ring-2 ring-accent-orange shadow-md' :
                          esHoy ? 'shadow-md' : 
                          'hover:shadow-md'
                        }`}
                        style={{
                          borderColor: esSeleccionado || esHoy ? '#F47C20' : '#A6A6A6',
                          backgroundColor: esSeleccionado || esHoy ? '#FFF7ED' : 'white'
                        }}
                      >
                        <div className="text-xs md:text-sm font-semibold mb-1"
                          style={{ color: esHoy || esSeleccionado ? '#F47C20' : '#2C2C2C' }}
                        >
                          {dia.getDate()}
                        </div>
                        <div className="space-y-1">
                          {camionerosDia.slice(0, 1).map(camionero => (
                            <div
                              key={camionero.ID}
                              className="text-xs bg-green-100 text-green-800 px-1 md:px-1.5 py-0.5 rounded truncate"
                              title={`${camionero.Nombre} - ${camionero.Turno}`}
                            >
                              {camionero.Nombre.split(' ')[0]}
                            </div>
                          ))}
                          {serviciosDia.slice(0, 1).map(s => (
                            <div
                              key={s.id}
                              className="text-xs bg-blue-100 text-blue-800 px-1 md:px-1.5 py-0.5 rounded truncate"
                              title={`${s.hora ? s.hora + ' - ' : ''}${s.origen} → ${s.destino}`}
                            >
                              🚚 {s.hora ? s.hora : s.tipo}
                            </div>
                          ))}
                          {(camionerosDia.length + serviciosDia.length) > 2 && (
                            <div className="text-xs text-gray-600 font-medium">
                              +{camionerosDia.length + serviciosDia.length - 2}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Panel Lateral - 30% */}
            <div className="flex-1 lg:flex-[0_0_30%]">
              <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 lg:sticky lg:top-6" style={{ borderWidth: '1px', borderColor: '#A6A6A6' }}>
                <h3 className="text-base md:text-lg font-bold mb-4" style={{ color: '#2C2C2C' }}>
                  {diaSeleccionado ? (
                    <span className="flex items-center gap-2">
                      <CalendarIcon size={20} style={{ color: '#F47C20' }} />
                      {formatearFecha(diaSeleccionado)}
                    </span>
                  ) : (
                    'Selecciona un día'
                  )}
                </h3>

                {cargando ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Truck size={32} className="text-gray-400 animate-pulse" />
                    <p className="text-sm text-gray-600 mt-2">Cargando...</p>
                  </div>
                ) : !diaSeleccionado ? (
                  <div className="text-center py-12">
                    <CalendarIcon size={32} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Selecciona un día del calendario</p>
                  </div>
) : camionerosDiaSeleccionado.length === 0 && serviciosDiaSeleccionado.length === 0 ? (
                  <div className="text-center py-12">
                    <User size={32} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No hay turnos ni servicios este día</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-150 overflow-y-auto">
                    {camionerosDiaSeleccionado.map(camionero => (
                      <div
                        key={camionero.ID}
                        className="p-4 rounded-xl transition-all shadow-sm hover:shadow-md"
                        style={{ borderWidth: '1px', borderColor: '#A6A6A6', backgroundColor: 'white' }}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold shrink-0" style={{ backgroundColor: '#1F4E79', color: 'white' }}>
                            {camionero.Nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold truncate" style={{ color: '#2C2C2C' }}>
                              {camionero.Nombre}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-700 mt-1">
                              <Clock size={12} />
                              {camionero.Turno}
                            </div>
                          </div>
                        </div>
                        <div className="pt-3" style={{ borderTopWidth: '1px', borderColor: '#A6A6A6' }}>
                          <div className="text-xs text-gray-600 mb-1">Período del turno</div>
                          <div className="text-xs font-medium" style={{ color: '#2C2C2C' }}>
                            {formatearFecha(camionero.FechaInicio)} - {formatearFecha(camionero.FechaFinal)}
                          </div>
                        </div>
                      </div>
                    ))}

                    {serviciosDiaSeleccionado.map(servicio => (
                      <div
                        key={servicio.id}
                        className="p-4 rounded-xl transition-all shadow-sm hover:shadow-md"
                        style={{ borderWidth: '1px', borderColor: '#93C5FD', backgroundColor: '#EFF6FF' }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Truck size={16} style={{ color: '#2563EB' }} />
                          <span className="text-sm font-bold" style={{ color: '#1E40AF' }}>Servicio asignado</span>
                          {servicio.hora && (
                            <span className="ml-auto flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8' }}>
                              <Clock size={11} />{servicio.hora}
                            </span>
                          )}
                        </div>
                        <div className="space-y-1.5 text-xs" style={{ color: '#1E3A5F' }}>
                          <div><span className="font-semibold">Cliente:</span> {servicio.cliente}</div>
                          <div><span className="font-semibold">Tipo:</span> {servicio.tipo}</div>
                          {servicio.hora && <div className="flex items-center gap-1"><Clock size={11} /><span className="font-semibold">Hora:</span> {servicio.hora}</div>}
                          {servicio.origen && <div><span className="font-semibold">Origen:</span> {servicio.origen}</div>}
                          {servicio.destino && <div><span className="font-semibold">Destino:</span> {servicio.destino}</div>}
                          {servicio.descripcion && <div className="text-gray-600 italic">{servicio.descripcion}</div>}
                        </div>
                        <button
                          onClick={() => setServicioDetalle(servicio)}
                          className="mt-3 w-full text-xs font-semibold py-1.5 rounded-lg transition-colors"
                          style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8' }}
                        >
                          Ver detalles y acciones
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Modal detalles servicio */}
      {servicioDetalle && !modalIncidencia && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setServicioDetalle(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Truck size={18} style={{ color: '#2563EB' }} />
                <h2 className="text-lg font-bold" style={{ color: '#1E40AF' }}>Detalles del servicio</h2>
              </div>
              <button onClick={() => setServicioDetalle(null)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
            </div>

            <div className="space-y-2.5 text-sm mb-5" style={{ color: '#1E3A5F' }}>
              <div className="flex justify-between">
                <span className="font-semibold">Cliente</span>
                <span>{servicioDetalle.cliente}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Tipo</span>
                <span>{servicioDetalle.tipo}</span>
              </div>
              {servicioDetalle.hora && (
                <div className="flex justify-between items-center">
                  <span className="font-semibold flex items-center gap-1"><Clock size={13} />Hora</span>
                  <span className="font-bold text-blue-700">{servicioDetalle.hora}</span>
                </div>
              )}
              {servicioDetalle.origen && (
                <div className="flex justify-between items-center">
                  <span className="font-semibold flex items-center gap-1"><MapPin size={13} />Origen</span>
                  <span>{servicioDetalle.origen}</span>
                </div>
              )}
              {servicioDetalle.destino && (
                <div className="flex justify-between items-center">
                  <span className="font-semibold flex items-center gap-1"><MapPin size={13} />Destino</span>
                  <span>{servicioDetalle.destino}</span>
                </div>
              )}
              {servicioDetalle.descripcion && (
                <div className="pt-1 text-gray-500 italic text-xs">{servicioDetalle.descripcion}</div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setModalIncidencia(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold border transition-colors"
                style={{ borderColor: '#F97316', color: '#EA580C', backgroundColor: '#FFF7ED' }}
              >
                <AlertTriangle size={15} />
                Reportar incidencia
              </button>
              <button
                onClick={() => handleFinalizar(servicioDetalle)}
                disabled={procesando}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#16A34A' }}
              >
                <CheckCircle2 size={15} />
                {procesando ? 'Procesando...' : 'Marcar finalizado'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal reportar incidencia */}
      {modalIncidencia && servicioDetalle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setModalIncidencia(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-orange-500" />
                <h2 className="text-lg font-bold text-slate-800">Reportar incidencia</h2>
              </div>
              <button onClick={() => setModalIncidencia(false)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tipo de incidencia</label>
                <select
                  value={tipoIncidencia}
                  onChange={e => setTipoIncidencia(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">Selecciona...</option>
                  <option value="Retraso">Retraso</option>
                  <option value="Avería">Avería</option>
                  <option value="Accidente">Accidente</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Descripción</label>
                <textarea
                  value={descIncidencia}
                  onChange={e => setDescIncidencia(e.target.value)}
                  rows={3}
                  placeholder="Describe la incidencia..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setModalIncidencia(false)}
                  className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleReportarIncidencia}
                  disabled={!tipoIncidencia || procesando}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 disabled:opacity-50"
                >
                  <AlertTriangle size={14} />
                  {procesando ? 'Enviando...' : 'Enviar reporte'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
