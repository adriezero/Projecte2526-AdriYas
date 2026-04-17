import { Tarea, FiltroTarea } from '@interfaces/interfaces';

export function filtrarTareas(tareas: Tarea[], filtro: FiltroTarea): Tarea[] {
  if (filtro === 'pendientes') return tareas.filter(t => !t.completada);
  if (filtro === 'completadas') return tareas.filter(t => t.completada);
  return tareas;
}

export function contarPendientes(tareas: Tarea[]): number {
  return tareas.filter(t => !t.completada).length;
}

export function contarCompletadas(tareas: Tarea[]): number {
  return tareas.filter(t => t.completada).length;
}

export function crearTarea(nombre: string, prioridad: 'Alta' | 'Baja', usuario: string): Tarea {
  return {
    id: Date.now(),
    nombre,
    prioridad,
    fecha: 'Por definir',
    usuario,
    completada: false,
  };
}

export function toggleTareaCompletada(tareas: Tarea[], id: number): Tarea[] {
  return tareas.map(t => t.id === id ? { ...t, completada: !t.completada } : t);
}

export function eliminarTareaPorId(tareas: Tarea[], id: number): Tarea[] {
  return tareas.filter(t => t.id !== id);
}

export function formatearFecha(fecha: string, hora?: string): string {
  if (!fecha) return 'Por definir';
  
  const fechaSeleccionada = new Date(fecha + 'T00:00:00');
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  const diffDias = Math.floor((fechaSeleccionada.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
  
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  
  let resultado = '';
  
  if (diffDias === 0) {
    resultado = 'Hoy';
  } else if (diffDias === 1) {
    resultado = 'Mañana';
  } else if (diffDias > 1 && diffDias <= 7) {
    resultado = diasSemana[fechaSeleccionada.getDay()];
  } else {
    const dia = fechaSeleccionada.getDate();
    const mes = meses[fechaSeleccionada.getMonth()];
    resultado = `${diasSemana[fechaSeleccionada.getDay()]}, ${dia} ${mes}`;
  }
  
  if (hora) {
    resultado += `, ${hora}`;
  }
  
  return resultado;
}
