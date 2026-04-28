"use client";

import BarraLateral from "@componentes/camionero/BarraLateral";
import { useState, useEffect } from "react";
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon,
  Clock, User, Truck
} from 'lucide-react';
import {
  CamioneroTurno,
  obtenerCamionerosTurnos,
  formatearFecha,
  obtenerDiasDelMes,
  obtenerNombreMes
} from './logic';

export default function Horario() {
  const [camioneros, setCamioneros] = useState<CamioneroTurno[]>([]);
  const [cargando, setCargando] = useState(true);
  
  const [mesActual, setMesActual] = useState(new Date().getMonth());
  const [yearActual, setYearActual] = useState(new Date().getFullYear());
  const [diaSeleccionado, setDiaSeleccionado] = useState<Date | null>(null);

  useEffect(() => {
    cargarCamioneros();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mesActual, yearActual]);

  async function cargarCamioneros() {
    setCargando(true);
    try {
      const data = await obtenerCamionerosTurnos(mesActual + 1, yearActual);
      setCamioneros(data);
    } catch (error) {
      console.error('Error al cargar turnos:', error);
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

  const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const diasDelMes = obtenerDiasDelMes(mesActual, yearActual);
  const primerDiaSemana = (new Date(yearActual, mesActual, 1).getDay() + 6) % 7;
  
  const camionerosDiaSeleccionado = diaSeleccionado ? obtenerCamionerosPorDia(diaSeleccionado) : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <BarraLateral />

      <div className="p-6 lg:p-8" style={{ marginLeft: '256px' }}>
        <div className="max-w-screen-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Horarios y Turnos</h1>
            <p className="text-slate-500 mt-1 text-sm">Visualiza los turnos de los camioneros en el calendario</p>
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
                    const camionerosDia = obtenerCamionerosPorDia(dia);
                    const esHoy = dia.toDateString() === new Date().toDateString();
                    const esSeleccionado = diaSeleccionado?.toDateString() === dia.toDateString();
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setDiaSeleccionado(dia)}
                        className={`aspect-square border rounded-lg p-2 transition-all ${
                          esSeleccionado ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' :
                          esHoy ? 'border-blue-500 bg-blue-50' : 
                          'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`text-sm font-semibold mb-1 ${
                          esHoy || esSeleccionado ? 'text-blue-600' : 'text-slate-700'
                        }`}>
                          {dia.getDate()}
                        </div>
                        <div className="space-y-1">
                          {camionerosDia.slice(0, 2).map(camionero => (
                            <div
                              key={camionero.ID}
                              className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded truncate"
                              title={`${camionero.Nombre} - ${camionero.Turno}`}
                            >
                              {camionero.Nombre.split(' ')[0]}
                            </div>
                          ))}
                          {camionerosDia.length > 2 && (
                            <div className="text-xs text-slate-500 font-medium">
                              +{camionerosDia.length - 2}
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
            <div className="flex-[0_0_30%]">
              <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  {diaSeleccionado ? (
                    <span className="flex items-center gap-2">
                      <CalendarIcon size={20} />
                      {formatearFecha(diaSeleccionado)}
                    </span>
                  ) : (
                    'Selecciona un día'
                  )}
                </h3>

                {cargando ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Truck size={32} className="text-slate-400 animate-pulse" />
                    <p className="text-sm text-slate-500 mt-2">Cargando...</p>
                  </div>
                ) : !diaSeleccionado ? (
                  <div className="text-center py-12">
                    <CalendarIcon size={32} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Selecciona un día del calendario</p>
                  </div>
                ) : camionerosDiaSeleccionado.length === 0 ? (
                  <div className="text-center py-12">
                    <User size={32} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No hay turnos este día</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-150 overflow-y-auto">
                    {camionerosDiaSeleccionado.map(camionero => (
                      <div
                        key={camionero.ID}
                        className="p-4 border border-slate-200 rounded-lg hover:border-green-300 hover:bg-green-50/50 transition-colors"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-semibold shrink-0">
                            {camionero.Nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-slate-800 truncate">
                              {camionero.Nombre}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                              <Clock size={12} />
                              {camionero.Turno}
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-3 border-t border-slate-100">
                          <div className="text-xs text-slate-500 mb-1">Período del turno</div>
                          <div className="text-xs font-medium text-slate-700">
                            {formatearFecha(camionero.FechaInicio)} - {formatearFecha(camionero.FechaFinal)}
                          </div>
                        </div>
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
  );
}
