export interface Turno {
  ID: number;
  Descripci_n: string;
  camioneros: {
    ID: number;
    Nombre: string;
    FechaInicio: Date | string;
    FechaFinal: Date | string;
  }[];
}

export interface CamioneroTurno {
  ID: number;
  Nombre: string;
  Turno: string;
  FechaInicio: Date | string;
  FechaFinal: Date | string;
}

export interface ServicioCamionero {
  id: number;
  cliente: string;
  tipo: string;
  asunto: string;
  descripcion?: string | null;
  fechaServicio: Date | string;
  fechaFin?: Date | string | null;
  hora?: string | null;
  origen?: string | null;
  destino?: string | null;
}

export async function obtenerCamionerosTurnos(mes?: number, year?: number): Promise<CamioneroTurno[]> {
  const params = mes && year ? `?mes=${mes}&year=${year}` : '';
  const res = await fetch(`/api/camioneros/turnos${params}`);
  if (!res.ok) throw new Error('Error al obtener turnos');
  return res.json();
}

export async function obtenerServiciosCamionero(mes?: number, year?: number): Promise<ServicioCamionero[]> {
  const params = mes && year ? `?mes=${mes}&year=${year}` : '';
  const res = await fetch(`/api/camionero/servicios${params}`);
  if (!res.ok) throw new Error('Error al obtener servicios');
  return res.json();
}

export async function finalizarServicio(id: number): Promise<void> {
  const res = await fetch(`/api/camionero/servicios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idSolicitud: id }),
  });
  if (!res.ok) throw new Error('Error al finalizar servicio');
}

export async function reportarIncidencia(descripcion: string, tipo: string): Promise<void> {
  const res = await fetch('/api/reportes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Tipo: 'Incidencia', Descripcion: `[${tipo}] ${descripcion}` }),
  });
  if (!res.ok) throw new Error('Error al reportar incidencia');
}

export function obtenerDiasDelMes(mes: number, year: number): Date[] {
  const dias: Date[] = [];
  const ultimoDia = new Date(year, mes + 1, 0);
  
  for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
    dias.push(new Date(year, mes, dia));
  }
  
  return dias;
}

export function obtenerNombreMes(mes: number): string {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return meses[mes];
}

export function formatearFecha(fecha: Date | string): string {
  const d = new Date(fecha);
  return d.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit'
  });
}
