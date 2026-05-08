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
  fechaServicio?: Date | string | null;
  hora?: string | null;
  origen?: string | null;
  destino?: string | null;
  representante?: string | null;
  motivoRechazo?: string | null;
}

export interface Cliente {
  ID: number;
  Nombre: string;
  NombreEmpresa: string;
  RazonSocial: string | null;
  Email: string | null;
  Telf: string;
  EstadoCuenta: string;
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
  estado?: 'Pendiente' | 'Aceptado' | 'Rechazado';
}

export type EstadoDoc = 'verificado' | 'pendiente' | 'falta' | 'rechazado';

export interface DocumentoCamionero {
  tipo: string;
  estado: EstadoDoc;
  archivo?: string;
  fechaSubida?: Date;
  id?: number;
}

export interface Informe {
  ID: number;
  FechaSubida: string;
  Tipo: string;
  Formato: string | null;
}

export interface Ruta {
  ID: number;
  Origen: string;
  Destino: string;
  Estado: string | null;
  FechaInicio: string;
  Cargas: string;
  Reservas: string;
}

export interface EstadisticasCliente {
  totalEntregas: number;
  porcentajeCumplimiento: number;
  ingresosGenerados: number;
  promedioTiempoEntrega: number;
}