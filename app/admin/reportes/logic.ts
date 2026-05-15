export type Reporte = {
  ID: number;
  Tipo: string;
  Descripcion: string | null;
  FechaHora: string;
  Estado: string;
  idReportante: number;
  rolReportante: string;
  nombreReportante: string | null;
};

export const TIPOS = ["Problema Técnico", "Incidencia", "Sugerencia"];
export const PAGE_SIZE = 10;

export const badgeTipo: Record<string, string> = {
  "Problema Técnico": "bg-red-50 text-red-700 border-red-200",
  Incidencia: "bg-accent-orange/10 text-accent-orange border-accent-orange/30",
  Sugerencia: "bg-accent-yellow/20 text-accent-yellow border-accent-yellow/40",
};

export const badgeEstado: Record<string, string> = {
  Pendiente: "bg-accent-orange/10 text-accent-orange border-accent-orange/30",
  "En revisión": "bg-primary/10 text-primary border-primary/30",
  Resuelto: "bg-green-50 text-green-700 border-green-200",
  Cerrado: "bg-border/20 text-text/50 border-border/30",
};

export const iconoTipo: Record<string, string> = {
  "Problema Técnico": "bi-wrench-adjustable-circle-fill",
  Incidencia: "bi-exclamation-triangle-fill",
  Sugerencia: "bi-lightbulb-fill",
};

export const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export async function fetchReportes(params: {
  busqueda: string;
  tipo: string;
  orden: string;
  pagina: number;
  fecha?: string;
  estado?: string;
}) {
  const searchParams = new URLSearchParams({
    busqueda: params.busqueda,
    tipo: params.tipo,
    orden: params.orden,
    pagina: String(params.pagina),
    limite: String(PAGE_SIZE),
    ...(params.fecha ? { fecha: params.fecha } : {}),
    ...(params.estado ? { estado: params.estado } : {}),
  });
  const res = await fetch(`/api/admin/reportes?${searchParams}`);
  return res.json();
}

export async function cambiarEstado(id: number, estado: string) {
  await fetch(`/api/admin/reportes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Estado: estado }),
  });
}

export async function eliminarReportes(ids: number[]) {
  await Promise.all(
    ids.map((id) => fetch(`/api/admin/reportes/${id}`, { method: "DELETE" }))
  );
}

export function formatId(id: number) {
  const hoy = new Date();
  return `#RP-${hoy.getFullYear()}${String(hoy.getMonth() + 1).padStart(2, "0")}${String(hoy.getDate()).padStart(2, "0")}-${String(id).padStart(3, "0")}`;
}

export function diasEnMes(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}

export function primerDia(y: number, m: number) {
  return new Date(y, m, 1).getDay();
}

export function calcularEstadisticas(reportes: Reporte[]) {
  return {
    pendientes: reportes.filter((r) => r.Estado === "Pendiente").length,
    enRevision: reportes.filter((r) => r.Estado === "En revisión").length,
    resueltos: reportes.filter((r) => r.Estado === "Resuelto").length,
  };
}
