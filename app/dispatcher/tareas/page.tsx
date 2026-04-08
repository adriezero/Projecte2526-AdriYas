"use client";

import BarraLateral from "@componentes/dispatcher/BarraLateral";
import { useState, useEffect } from "react";
import { Tarea, FiltroTarea } from '@interfaces/interfaces';

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
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('/api/tareas')
      .then(res => res.json())
      .then(data => {
        setTareas(data);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, []);
  const [filtro, setFiltro] = useState<FiltroTarea>('todas');
  const [vistaLista, setVistaLista] = useState(true);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [nuevaPrioridad, setNuevaPrioridad] = useState<'Alta' | 'Baja'>('Baja');
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [nuevaHora, setNuevaHora] = useState('');
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);

  const tareasFiltradas = filtrarTareas(tareas, filtro);
  const pendientes = contarPendientes(tareas);
  const completadas = contarCompletadas(tareas);

  async function agregarTarea() {
    if (!nuevaTarea.trim()) return;
    const nueva = crearTarea(nuevaTarea, nuevaPrioridad);
    if (nuevaFecha) {
      nueva.fecha = formatearFecha(nuevaFecha, nuevaHora);
    }
    
    const res = await fetch('/api/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nueva)
    });
    
    if (res.ok) {
      const tareaGuardada = await res.json();
      setTareas([...tareas, tareaGuardada]);
      setNuevaTarea('');
      setNuevaPrioridad('Baja');
      setNuevaFecha('');
      setNuevaHora('');
    }
  }

  async function toggleCompletada(id: number) {
    const tarea = tareas.find(t => t.id === id);
    if (!tarea) return;
    
    const res = await fetch(`/api/tareas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completada: !tarea.completada })
    });
    
    if (res.ok) {
      setTareas(toggleTareaCompletada(tareas, id));
    }
    setMenuAbierto(null);
  }

  async function eliminarTarea(id: number) {
    const res = await fetch(`/api/tareas/${id}`, { method: 'DELETE' });
    
    if (res.ok) {
      setTareas(eliminarTareaPorId(tareas, id));
    }
    setMenuAbierto(null);
  }

  return (
    <div>
      <BarraLateral />
      <div className="bg-gray-50 p-8" style={{ marginLeft: '256px' }}>
        <div className="max-w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Tareas</h1>
            <p className="text-gray-600 mt-2">Administra las tareas del dispatcher</p>
          </div>

          {cargando ? (
            <div className="text-center py-8">Cargando tareas...</div>
          ) : (
          <>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Todas mis tareas</h2>
            
            <div className="flex gap-4 items-center mb-6">
              <button
                onClick={() => setFiltro('pendientes')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filtro === 'pendientes' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pendientes ({pendientes})
              </button>
              <button
                onClick={() => setFiltro('completadas')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filtro === 'completadas' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completadas ({completadas})
              </button>
              <button
                onClick={() => setFiltro('todas')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filtro === 'todas' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas ({tareas.length})
              </button>

              <div className="ml-auto flex gap-2">
                <button
                  onClick={() => setVistaLista(!vistaLista)}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-900 font-medium"
                >
                  <i className={`bi bi-${vistaLista ? 'grid' : 'list'}`} /> {vistaLista ? 'Vista Grid' : 'Vista Lista'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tarea</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Prioridad</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Asignado</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tareasFiltradas.map(tarea => (
                    <tr key={tarea.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span className={tarea.completada ? 'line-through text-gray-400' : ''}>{tarea.nombre}</span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          tarea.prioridad === 'Alta' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {tarea.prioridad}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{tarea.fecha}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {tarea.usuario}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="relative">
                          <button
                            className="text-gray-600 hover:text-black"
                            onClick={() => setMenuAbierto(menuAbierto === tarea.id ? null : tarea.id)}
                          >
                            <i className="bi bi-three-dots-vertical" />
                          </button>
                          {menuAbierto === tarea.id && (
                            <div className="absolute right-0 z-20 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg w-44">
                              <button
                                className="w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 flex items-center gap-2"
                                onClick={() => toggleCompletada(tarea.id)}
                              >
                                <i className="bi bi-check-circle" /> {tarea.completada ? 'Marcar pendiente' : 'Marcar completada'}
                              </button>
                              <button
                                className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2"
                                onClick={() => eliminarTarea(tarea.id)}
                              >
                                <i className="bi bi-trash3" /> Eliminar
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={nuevaTarea}
                        onChange={e => setNuevaTarea(e.target.value)}
                        placeholder="Nueva tarea..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={nuevaPrioridad}
                        onChange={e => setNuevaPrioridad(e.target.value as 'Alta' | 'Baja')}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Baja">Baja</option>
                        <option value="Alta">Alta</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={nuevaFecha}
                          onChange={e => setNuevaFecha(e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="time"
                          value={nuevaHora}
                          onChange={e => setNuevaHora(e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        JD
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={agregarTarea}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 font-medium"
                      >
                        <i className="bi bi-plus-lg" /> Añadir
                      </button>
                    </td>
                  </tr>
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
