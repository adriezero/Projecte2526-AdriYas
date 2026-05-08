"use client";

import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Truck, User, Calendar, Clock, MapPin } from 'lucide-react';

interface Camionero {
  ID: number;
  Nombre: string;
  Licencia: string;
  Disponible: boolean;
}

interface Solicitud {
  id: number;
  cliente: string;
  tipo: string;
  asunto: string;
  descripcion?: string;
  fechaServicio?: string;
  hora?: string;
  origen?: string;
  destino?: string;
  representante?: string;
}

interface ModalAceptarSolicitudProps {
  solicitud: Solicitud;
  onClose: () => void;
  onAceptar: (idCamionero: number) => Promise<void>;
  onRechazar: (motivo: string) => Promise<void>;
}

export default function ModalAceptarSolicitud({ 
  solicitud, 
  onClose, 
  onAceptar,
  onRechazar 
}: ModalAceptarSolicitudProps) {
  const [camioneros, setCamioneros] = useState<Camionero[]>([]);
  const [camioneroSeleccionado, setCamioneroSeleccionado] = useState<number | null>(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [accion, setAccion] = useState<'aceptar' | 'rechazar' | null>(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    fetch('/api/camioneros')
      .then(res => res.json())
      .then(data => setCamioneros(data.filter((c: Camionero) => c.Disponible)))
      .catch(console.error);
  }, []);

  async function handleAceptar() {
    if (!camioneroSeleccionado) return;
    setCargando(true);
    try {
      await onAceptar(camioneroSeleccionado);
      onClose();
    } catch (error) {
      console.error('Error al aceptar:', error);
    } finally {
      setCargando(false);
    }
  }

  async function handleRechazar() {
    if (!motivoRechazo.trim()) return;
    setCargando(true);
    try {
      await onRechazar(motivoRechazo);
      onClose();
    } catch (error) {
      console.error('Error al rechazar:', error);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-800">Procesar Solicitud #{solicitud.id}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <XCircle size={24} />
          </button>
        </div>

        {/* Detalles de la solicitud */}
        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Cliente</label>
              <p className="text-slate-800 font-medium mt-1">{solicitud.cliente}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Tipo</label>
              <p className="text-slate-800 font-medium mt-1">{solicitud.tipo}</p>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Asunto</label>
              <p className="text-slate-800 font-medium mt-1">{solicitud.asunto}</p>
            </div>
            {solicitud.descripcion && (
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">Descripción</label>
                <p className="text-slate-600 text-sm mt-1">{solicitud.descripcion}</p>
              </div>
            )}
            {solicitud.fechaServicio && (
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                  <Calendar size={12} /> Fecha Servicio
                </label>
                <p className="text-slate-800 font-medium mt-1">{new Date(solicitud.fechaServicio).toLocaleDateString('es-ES')}</p>
              </div>
            )}
            {solicitud.hora && (
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                  <Clock size={12} /> Hora
                </label>
                <p className="text-slate-800 font-medium mt-1">{solicitud.hora}</p>
              </div>
            )}
            {solicitud.origen && (
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                  <MapPin size={12} /> Origen
                </label>
                <p className="text-slate-800 font-medium mt-1">{solicitud.origen}</p>
              </div>
            )}
            {solicitud.destino && (
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                  <MapPin size={12} /> Destino
                </label>
                <p className="text-slate-800 font-medium mt-1">{solicitud.destino}</p>
              </div>
            )}
          </div>
        </div>

        {!accion && (
          <div className="flex gap-3">
            <button
              onClick={() => setAccion('rechazar')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700"
            >
              <XCircle size={18} />
              Rechazar Solicitud
            </button>
            <button
              onClick={() => setAccion('aceptar')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700"
            >
              <CheckCircle2 size={18} />
              Aceptar y Asignar
            </button>
          </div>
        )}

        {accion === 'aceptar' && (
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                <Truck size={14} /> Seleccionar Camionero Disponible
              </label>
              <select
                value={camioneroSeleccionado || ''}
                onChange={e => setCamioneroSeleccionado(parseInt(e.target.value))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Seleccionar camionero...</option>
                {camioneros.map(c => (
                  <option key={c.ID} value={c.ID}>
                    {c.Nombre} - Licencia {c.Licencia}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setAccion(null)}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleAceptar}
                disabled={!camioneroSeleccionado || cargando}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 size={16} />
                {cargando ? 'Procesando...' : 'Confirmar Asignación'}
              </button>
            </div>
          </div>
        )}

        {accion === 'rechazar' && (
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                Motivo del Rechazo
              </label>
              <textarea
                value={motivoRechazo}
                onChange={e => setMotivoRechazo(e.target.value)}
                placeholder="Explica por qué se rechaza esta solicitud..."
                rows={4}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setAccion(null)}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleRechazar}
                disabled={!motivoRechazo.trim() || cargando}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XCircle size={16} />
                {cargando ? 'Procesando...' : 'Confirmar Rechazo'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
