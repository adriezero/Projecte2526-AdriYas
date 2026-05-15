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
    <div className="min-h-screen" style={{ backgroundColor: '#F2F2F2' }}>
      <BarraLateral />

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
                        <div className={`text-xs md:text-sm font-semibold mb-1`}
                          style={{ color: esHoy || esSeleccionado ? '#F47C20' : '#2C2C2C' }}
                        >
                          {dia.getDate()}
                        </div>
                        <div className="space-y-1">
                          {camionerosDia.slice(0, 2).map(camionero => (
                            <div
                              key={camionero.ID}
                              className="text-xs bg-green-100 text-green-800 px-1 md:px-1.5 py-0.5 rounded truncate"
                              title={`${camionero.Nombre} - ${camionero.Turno}`}
                            >
                              {camionero.Nombre.split(' ')[0]}
                            </div>
                          ))}
                          {camionerosDia.length > 2 && (
                            <div className="text-xs text-gray-600 font-medium">
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
                ) : camionerosDiaSeleccionado.length === 0 ? (
                  <div className="text-center py-12">
                    <User size={32} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No hay turnos este día</p>
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
