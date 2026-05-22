"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const ESTADO_COLOR: Record<string, { badge: string; bg: string; border: string; text: string }> = {
  Pendiente:    { badge: "bg-accent-yellow/20 text-accent-yellow", bg: "bg-accent-yellow/5",  border: "border-accent-yellow/20", text: "text-accent-yellow" },
  "En Proceso": { badge: "bg-primary/10 text-primary",    bg: "bg-primary/5",    border: "border-primary/20",   text: "text-primary"   },
  Aceptada:     { badge: "bg-green-100 text-green-700",  bg: "bg-green-50",   border: "border-green-200",  text: "text-green-700"  },
  Rechazada:    { badge: "bg-red-100 text-red-600",      bg: "bg-red-50",     border: "border-red-200",    text: "text-red-600"    },
};

function formatFecha(f: string) {
  return new Date(f).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
}

export default function DetalleSolicitudPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<{
    id: number;
    cliente: string;
    tipo: string;
    asunto: string;
    origen?: string;
    destino?: string;
    fechaServicio?: string;
    fecha: string;
    estado: string;
    descripcion?: string;
    motivoRechazo?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/solicitudes/${id}`)
      .then(r => r.json())
      .then(d => { if (d.error) setError(d.error); else setData(d); setLoading(false); })
      .catch(() => { setError("Error al cargar"); setLoading(false); });
  }, [id]);

  if (loading) return <div className="min-h-screen bg-bg flex items-center justify-center"><p className="text-border text-sm">Cargando...</p></div>;
  if (error || !data) return <div className="min-h-screen bg-bg flex items-center justify-center"><p className="text-red-500 text-sm">{error || "No se encontraron datos"}</p></div>;

  const colores = ESTADO_COLOR[data.estado] ?? { badge: "bg-gray-100 text-border", bg: "bg-white", border: "border-gray-200", text: "text-text" };

  return (
    <div className="min-h-screen bg-bg pt-20">

      {/* Hero banner */}
      <div className={`w-full px-10 py-8 ${colores.bg} border-b ${colores.border}`}>
        <button onClick={() => router.back()} className="text-sm text-border hover:text-text flex items-center gap-1 mb-4">
          ← Volver a mis solicitudes
        </button>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-border mb-1">Detalle de la solicitud</p>
            <h1 className="text-3xl font-bold text-text">
              Solicitud <span className={colores.text}>#{String(data.id).padStart(6, "0")}</span>
            </h1>
            <p className="text-sm text-border mt-1">{formatFecha(data.fecha)}</p>
          </div>
          <span className={`text-sm font-semibold px-4 py-1.5 rounded-full ${colores.badge}`}>
            {data.estado}
          </span>
        </div>
      </div>

      <div className="px-10 py-8">
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm max-w-2xl">
          <p className="text-xs font-semibold text-border/70 uppercase tracking-widest mb-6">Información de la solicitud</p>
          <div className="space-y-4">
            {[
              { label: "Cliente", value: data.cliente },
              { label: "Tipo",    value: data.tipo },
              { label: "Asunto",  value: data.asunto },
              { label: "Origen",  value: data.origen },
              { label: "Destino", value: data.destino },
              { label: "Fecha servicio", value: data.fechaServicio ? formatFecha(data.fechaServicio) : null },
              { label: "Fecha",   value: formatFecha(data.fecha) },
              { label: "Estado",  value: data.estado },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start gap-4 border-b border-gray-50 pb-3">
                <span className="text-xs text-border/70 shrink-0 w-24">{label}</span>
                <span className="text-sm font-medium text-text text-right">{value ?? "—"}</span>
              </div>
            ))}
            {data.descripcion && (
              <div className="pt-2">
                <p className="text-xs text-border/70 mb-2">Descripción</p>
                <p className="text-sm text-text bg-bg rounded-lg p-4">{data.descripcion}</p>
              </div>
            )}
            {data.estado === "Rechazada" && (
              <div className="mt-4 rounded-xl border border-red-200 bg-linear-to-br from-red-50 to-rose-50 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-red-100/60 border-b border-red-200">
                  <span className="text-base">🚫</span>
                  <p className="text-xs font-semibold text-red-600 uppercase tracking-widest">Solicitud rechazada</p>
                </div>
                <div className="px-4 py-4">
                  <p className="text-xs text-red-400 mb-1">Motivo</p>
                  <p className="text-sm font-medium text-red-700 leading-relaxed">{data.motivoRechazo ?? "Sin especificar"}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
