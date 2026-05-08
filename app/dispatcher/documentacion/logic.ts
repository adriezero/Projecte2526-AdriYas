import { Documento } from '@interfaces/interfaces';

export const TIPOS_DOCUMENTO = [
  'Todos',
  'Factura',
  'Contrato',
  'Permiso',
  'Seguro',
  'Licencia',
  'Certificado',
  'Otro'
];

export function filtrarDocumentos(documentos: Documento[], tipo: string, desde: string, hasta: string): Documento[] {
  let filtrados = documentos;
  
  if (tipo && tipo !== 'Todos') {
    filtrados = filtrados.filter(d => d.tipo === tipo);
  }
  
  if (desde) {
    filtrados = filtrados.filter(d => new Date(d.fechaSubida) >= new Date(desde));
  }
  
  if (hasta) {
    filtrados = filtrados.filter(d => new Date(d.fechaSubida) <= new Date(hasta));
  }
  
  return filtrados;
}

export function formatearFecha(fecha: Date | string): string {
  const d = new Date(fecha);
  return d.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit'
  });
}

export async function obtenerDocumentos(tipo?: string, desde?: string, hasta?: string): Promise<Documento[]> {
  const params = new URLSearchParams();
  if (tipo) params.append('tipo', tipo);
  if (desde) params.append('desde', desde);
  if (hasta) params.append('hasta', hasta);
  
  const res = await fetch(`/api/documentos?${params.toString()}`);
  if (!res.ok) throw new Error('Error al obtener documentos');
  return res.json();
}

export async function eliminarDocumento(id: number): Promise<void> {
  const res = await fetch(`/api/documentos/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar documento');
}

export async function actualizarDocumento(id: number, datos: Partial<Documento>): Promise<Documento> {
  const res = await fetch(`/api/documentos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  if (!res.ok) throw new Error('Error al actualizar documento');
  return res.json();
}

export async function cambiarEstadoDocumento(id: number, estado: 'Aceptado' | 'Rechazado'): Promise<Documento> {
  return actualizarDocumento(id, { estado });
}

export async function descargarDocumento(id: number): Promise<void> {
  window.open(`/api/documentos/download?id=${id}`, '_blank');
}

export async function subirDocumento(formData: FormData): Promise<Documento> {
  const res = await fetch('/api/documentos/upload', {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Error al subir documento');
  }
  return res.json();
}
