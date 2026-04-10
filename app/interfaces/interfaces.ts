export interface Usuario {
  email: string;
  name: string;
  password: string;
}

export interface Reseña {
  id: number;
  name: string;
  comment: string;
  isPositive: boolean;
  date: string;
  route: string;
}

export interface Props {
  name: string;
  comment: string;
  isPositive: boolean;
  date?: string;
  route?: string;
}

export type Tarea = {
  id: number;
  nombre: string;
  prioridad: 'Alta' | 'Baja';
  fecha: string;
  usuario: string;
  completada: boolean;
};

export type FiltroTarea = 'todas' | 'pendientes' | 'completadas';

export type EstadoSolicitud = 'Pendiente' | 'En Proceso' | 'Aceptada' | 'Rechazada';
export type FiltroSolicitud = 'todas' | 'pendientes' | 'en-proceso' | 'aceptadas' | 'rechazadas';

export interface Solicitud {
  id: number;
  cliente: string;
  servicio: string;
  fecha: Date | string;
  estado: EstadoSolicitud;
}