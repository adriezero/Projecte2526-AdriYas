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
  tipo: string;
  asunto: string;
  descripcion?: string | null;
  fecha: Date | string;
  estado: EstadoSolicitud;
}

export interface Cliente {
  ID: number;
  Nombre: string;
  NombreEmpresa: string;
}

export interface Reserva {
  ID: number;
  Fecha: Date | string;
  Hora: string;
  Representante: string;
  Origen: string;
  Destino: string;
  Motivo: string;
  Descripci_n?: string | null;
}

export interface Documento {
  id: number;
  nombre: string;
  tipo: string;
  fechaSubida: Date | string;
  asociadoA: string;
  tamano: string;
  rutaArchivo?: string;
  descripcion?: string;
}

export type EstadoDoc = 'verificado' | 'pendiente' | 'falta';

export interface DocumentoCamionero {
  tipo: string;
  estado: EstadoDoc;
  archivo?: string;
  fechaSubida?: Date;
}