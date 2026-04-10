import { Solicitud, EstadoSolicitud, FiltroSolicitud } from '@interfaces/interfaces';

export { Solicitud, EstadoSolicitud, FiltroSolicitud };

export function filtrarSolicitudes(solicitudes: Solicitud[], filtro: FiltroSolicitud): Solicitud[] {
  if (filtro === 'todas') return solicitudes;
  if (filtro === 'pendientes') return solicitudes.filter(s => s.estado === 'Pendiente');
  if (filtro === 'en-proceso') return solicitudes.filter(s => s.estado === 'En Proceso');
  if (filtro === 'aceptadas') return solicitudes.filter(s => s.estado === 'Aceptada');
  if (filtro === 'rechazadas') return solicitudes.filter(s => s.estado === 'Rechazada');
  return solicitudes;
}

export function contarPorEstado(solicitudes: Solicitud[], estado: EstadoSolicitud): number {
  return solicitudes.filter(s => s.estado === estado).length;
}

export function getEstadoColor(estado: EstadoSolicitud): string {
  switch (estado) {
    case 'Pendiente': return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'En Proceso': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Aceptada': return 'bg-green-50 text-green-700 border-green-200';
    case 'Rechazada': return 'bg-red-50 text-red-700 border-red-200';
  }
}

export function formatearFecha(fecha: Date | string): string {
  const d = new Date(fecha);
  return d.toLocaleString('es-ES', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export async function obtenerSolicitudes(): Promise<Solicitud[]> {
  const res = await fetch('/api/solicitudes');
  if (!res.ok) throw new Error('Error al obtener solicitudes');
  return res.json();
}

export async function crearSolicitud(cliente: string, servicio: string, estado: EstadoSolicitud): Promise<Solicitud> {
  const res = await fetch('/api/solicitudes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cliente, servicio, estado })
  });
  if (!res.ok) throw new Error('Error al crear solicitud');
  return res.json();
}

export async function eliminarSolicitud(id: number): Promise<void> {
  const res = await fetch(`/api/solicitudes/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar solicitud');
}

export async function actualizarEstadoSolicitud(id: number, estado: EstadoSolicitud): Promise<Solicitud> {
  const res = await fetch(`/api/solicitudes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado })
  });
  if (!res.ok) throw new Error('Error al actualizar solicitud');
  return res.json();
}
