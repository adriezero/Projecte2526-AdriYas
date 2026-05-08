import { Reserva, Cliente } from '@interfaces/interfaces';

export type { Reserva, Cliente };

export async function obtenerReservas(mes?: number, year?: number): Promise<Reserva[]> {
  const params = mes && year ? `?mes=${mes}&year=${year}` : '';
  const res = await fetch(`/api/reservas${params}`);
  if (!res.ok) throw new Error('Error al obtener reservas');
  return res.json();
}

export async function crearReserva(
  fechaInicio: string,
  fechaFin: string,
  hora: string,
  representante: string,
  origen: string,
  destino: string,
  motivo: string,
  descripcion?: string
): Promise<Reserva> {
  const res = await fetch('/api/reservas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fechaInicio, fechaFin, hora, representante, origen, destino, motivo, descripcion })
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.details || 'Error al crear reserva');
  }
  return res.json();
}

export function formatearFecha(fecha: Date | string): string {
  const d = new Date(fecha);
  return d.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit'
  });
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
