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

export async function obtenerCamionerosTurnos(mes?: number, year?: number): Promise<CamioneroTurno[]> {
  const params = mes && year ? `?mes=${mes}&year=${year}` : '';
  const res = await fetch(`/api/camioneros/turnos${params}`);
  if (!res.ok) throw new Error('Error al obtener turnos');
  return res.json();
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
