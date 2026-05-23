"use client";

import { useState, useEffect } from "react";
import { Tarea, FiltroTarea } from '@interfaces/interfaces';
import { useSession } from "next-auth/react";
import { 
  Clock, Flag, Calendar, User, Settings, Plus, 
  CheckCircle2, Trash2, MoreVertical, Inbox, Hourglass, List, Truck
} from 'lucide-react';

import { 
  filtrarTareas, 
  contarPendientes, 
  contarCompletadas, 
  crearTarea, 
  toggleTareaCompletada, 
  eliminarTareaPorId,
  formatearFecha
} from './logic';

export default function Tareas() {
  const { data: session } = useSession();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [cargando, setCargando] = useState(true);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);

  const obtenerIniciales = (nombre?: string | null) => {
    if (!nombre) return 'U';
    const palabras = nombre.trim().split(' ');
    if (palabras.length >= 2) return (palabras[0][0] + palabras[1][0]).toUpperCase();
    return palabras[0].substring(0, 2).toUpperCase();
  };

  const iniciales = obtenerIniciales(session?.user?.name);

  useEffect(() => {
    fetch('/api/tareas')
      .then(res => res.json())
      .then(data => {
        const tareasMapeadas = data.map((t: any) => {
          let fecha = 'Por definir';
          let usuario = iniciales;
          
          if (t.descripcion) {
            const fechaMatch = t.descripcion.match(/Fecha: ([^|]+)/);
            const usuarioMatch = t.descripcion.match(/Asignado: ([^|]+)/);
            if (fechaMatch) fecha = fechaMatch[1].trim();
            if (usuarioMatch) usuario = usuarioMatch[1].trim();
          }
          
          return {
            id: t.id,
            nombre: t.titulo,
            prioridad: t.prioridad || 'Baja',
            fecha,
            usuario,
            completada: t.estado === 'Completada'
          };
        });
        setTareas(tareasMapeadas);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, [iniciales]);

  const [filtro, setFiltro] = useState<FiltroTarea>('pendientes');
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [nuevaPrioridad, setNuevaPrioridad] = useState<'Alta' | 'Baja'>('Baja');
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [nuevaHora, setNuevaHora] = useState('');
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);

  const tareasFiltradas = filtrarTareas(tareas, filtro);
  const pendientes = contarPendientes(tareas);
  const completadas = contarCompletadas(tareas);

  function abrirMenu(e: React.MouseEvent<HTMLButtonElement>, id: number) {
    if (menuAbierto === id) {
      setMenuAbierto(null);
      setMenuPos(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + window.scrollY + 4, left: rect.right - 176 });
    setMenuAbierto(id);
  }

  useEffect(() => {
    function handleClick() { setMenuAbierto(null); setMenuPos(null); }
    if (menuAbierto !== null) document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [menuAbierto]);

  async function agregarTarea() {
    if (!nuevaTarea.trim()) return;
    const fechaFormateada = nuevaFecha ? formatearFecha(nuevaFecha, nuevaHora) : 'Por definir';
    const res = await fetch('/api/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: nuevaTarea,
        descripcion: `Fecha: ${fechaFormateada} | Asignado: ${iniciales}`,
        prioridad: nuevaPrioridad,
        estado: 'Pendiente'
      })
    });
    if (res.ok) {
      const tareaGuardada = await res.json();
      const tareaParaUI: Tarea = {
        id: tareaGuardada.id,
        nombre: tareaGuardada.titulo,
        prioridad: tareaGuardada.prioridad,
        fecha: fechaFormateada,
        usuario: iniciales,
        completada: tareaGuardada.estado !== 'Pendiente'
      };
      setTareas([...tareas, tareaParaUI]);
      setNuevaTarea(''); setNuevaPrioridad('Baja'); setNuevaFecha(''); setNuevaHora('');
    }
  }

  async function toggleCompletada(id: number) {
    const tarea = tareas.find(t => t.id === id);
    if (!tarea) return;
    const nuevoEstado = tarea.completada ? 'Pendiente' : 'Completada';
    const res = await fetch(`/api/tareas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado })
    });
    if (res.ok) setTareas(toggleTareaCompletada(tareas, id));
    setMenuAbierto(null); setMenuPos(null);
  }

  async function eliminarTarea(id: number) {
    const res = await fetch(`/api/tareas/${id}`, { method: 'DELETE' });
    if (res.ok) setTareas(eliminarTareaPorId(tareas, id));
    setMenuAbierto(null); setMenuPos(null);
  }

  const tareaMenuAbierta = tareas.find(t => t.id === menuAbierto);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Portal del menú — fuera del scroll, siempre encima */}
      {menuAbierto !== null && menuPos && tareaMenuAbierta && (
        <div
          className="fixed z-1 bg-white rounded-lg border border-slate-200 w-44 py-1 shadow-lg"
          style={{ top: menuPos.top, left: menuPos.left }}
          onClick={e => e.stopPropagation()}
        >
          <button
            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            onClick={() => toggleCompletada(tareaMenuAbierta.id)}
          >
            <CheckCircle2 size={14} className="text-slate-400" />
            {tareaMenuAbierta.completada ? 'Marcar pendiente' : 'Marcar completada'}
          </button>
          <div className="border-t border-slate-100 my-1" />
          <button
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            onClick={() => eliminarTarea(tareaMenuAbierta.id)}
          >
            <Trash2 size={14} />
            Eliminar tarea
          </button>
        </div>
      )}

      <div className="p-6 lg:p-8" style={{ marginLeft: '256px' }}>
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Gestión de Tareas</h1>
              <p className="text-slate-500 mt-1 text-sm">Organiza y controla tus tareas diarias</p>
            </div>
          </div>

          {cargando ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="animate-[slide_1.5s_ease-in-out_infinite]">
                <Truck size={48} className="text-slate-600" />
              </div>
              <p className="text-slate-600 font-medium mt-4">Cargando tareas...</p>
              <style jsx>{`
                @keyframes slide {
                  0%, 100% { transform: translateX(-20px); }
                  50% { transform: translateX(20px); }
                }
              `}</style>
            </div>
          ) : (
            <>
              {/* Filtros */}
              <div className="bg-white rounded-xl border border-slate-200 p-1.5 mb-5">
                <div className="flex gap-1">
                  {[
                    { key: 'pendientes', label: 'Pendientes', count: pendientes, icon: <Hourglass size={14} /> },
                    { key: 'completadas', label: 'Completadas', count: completadas, icon: <CheckCircle2 size={14} /> },
                    { key: 'todas', label: 'Todas', count: tareas.length, icon: <List size={14} /> },
                  ].map(({ key, label, count, icon }) => (
                    <button
                      key={key}
                      onClick={() => setFiltro(key as FiltroTarea)}
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
                          <span className="flex items-center gap-1.5"><List size={13} /> Tarea</span>
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5"><Flag size={13} /> Prioridad</span>
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5"><Calendar size={13} /> Fecha</span>
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5"><User size={13} /> Asignado</span>
                        </th>
                        <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          <span className="flex items-center justify-center gap-1.5"><Settings size={13} /> Acciones</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tareasFiltradas.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-5 py-16 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <Inbox size={36} className="text-slate-300" />
                              <p className="text-slate-700 font-semibold">No hay tareas {filtro === 'todas' ? '' : filtro}</p>
                              <p className="text-sm text-slate-400">Agrega una nueva tarea para comenzar</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        tareasFiltradas.map(tarea => (
                          <tr key={tarea.id} className="hover:bg-slate-50">
                            <td className="px-5 py-4">
                              <span className={`text-sm font-medium ${
                                tarea.completada ? 'line-through text-slate-400' : 'text-slate-800'
                              }`}>
                                {tarea.nombre}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${
                                tarea.prioridad === 'Alta'
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}>
                                <Flag size={11} />
                                {tarea.prioridad}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="flex items-center gap-1.5 text-sm text-slate-600">
                                <Clock size={13} className="text-slate-400" />
                                {tarea.fecha}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-700 text-xs font-semibold">
                                {tarea.usuario}
                              </div>
                            </td>
                            <td className="px-5 py-4 text-center">
                              <button
                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                                onClick={e => abrirMenu(e, tarea.id)}
                              >
                                <MoreVertical size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Formulario */}
                <div className="border-t border-slate-200 bg-slate-50 p-5">
                  <div className="grid grid-cols-12 gap-3 items-end">
                    <div className="col-span-4">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5">
                        <List size={13} /> Nueva tarea
                      </label>
                      <input
                        type="text"
                        value={nuevaTarea}
                        onChange={e => setNuevaTarea(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && agregarTarea()}
                        placeholder="Nombre de la tarea..."
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 bg-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5">
                        <Flag size={13} /> Prioridad
                      </label>
                      <select
                        value={nuevaPrioridad}
                        onChange={e => setNuevaPrioridad(e.target.value as 'Alta' | 'Baja')}
                        className="w-full border border-slate-300 text-slate-800 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
                      >
                        <option value="Baja">Baja</option>
                        <option value="Alta">Alta</option>
                      </select>
                    </div>
                    <div className="col-span-3">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5">
                        <Calendar size={13} /> Fecha y hora
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={nuevaFecha}
                          onChange={e => setNuevaFecha(e.target.value)}
                          className="flex-1 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                        />
                        <input
                          type="time"
                          value={nuevaHora}
                          onChange={e => setNuevaHora(e.target.value)}
                          className="flex-1 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                        />
                      </div>
                    </div>
                    <div className="col-span-3 flex items-end gap-2">
                      <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center text-slate-700 text-xs font-semibold shrink-0">
                        {iniciales}
                      </div>
                      <button
                        onClick={agregarTarea}
                        disabled={!nuevaTarea.trim()}
                        className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus size={16} />
                        Añadir tarea
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}