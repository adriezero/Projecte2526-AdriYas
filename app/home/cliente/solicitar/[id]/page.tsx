"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const ESTADO_COLOR: Record<string, { badge: string; bg: string; border: string; text: string }> = {
  Pendiente:    { badge: "bg-yellow-100 text-yellow-700", bg: "bg-yellow-50",  border: "border-yellow-200", text: "text-yellow-700" },
  "En Proceso": { badge: "bg-blue-100 text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200",   text: "text-blue-700"   },
  Aceptada:     { badge: "bg-green-100 text-green-700",  bg: "bg-green-50",   border: "border-green-200",  text: "text-green-700"  },
  Rechazada:    { badge: "bg-red-100 text-red-600",      bg: "bg-red-50",     border: "border-red-200",    text: "text-red-600"    },
};

function formatFecha(f: string) {
  return new Date(f).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
}

export default function DetalleSolicitudPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/solicitudes/${id}`)
      .then(r => r.json())
      .then(d => { if (d.error) setError(d.error); else setData(d); setLoading(false); })
      .catch(() => { setError("Error al cargar"); setLoading(false); });
  }, [id]);

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-400 text-sm">Cargando...</p></div>;
  if (error)   return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-red-500 text-sm">{error}</p></div>;

  const colores = ESTADO_COLOR[data.estado] ?? { badge: "bg-gray-100 text-gray-600", bg: "bg-white", border: "border-gray-200", text: "text-gray-800" };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">

      {/* Hero banner */}
      <div className={`w-full px-10 py-8 ${colores.bg} border-b ${colores.border}`}>
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4">
          ← Volver a mis solicitudes
        </button>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Detalle de la solicitud</p>
            <h1 className="text-3xl font-bold text-gray-900">
              Solicitud <span className={colores.text}>#{String(data.id).padStart(6, "0")}</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">{formatFecha(data.fecha)}</p>
          </div>
          <span className={`text-sm font-semibold px-4 py-1.5 rounded-full ${colores.badge}`}>
            {data.estado}
          </span>
        </div>
      </div>

      <div className="px-10 py-8">
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm max-w-2xl">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">Información de la solicitud</p>
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
                <span className="text-xs text-gray-400 shrink-0 w-24">{label}</span>
                <span className="text-sm font-medium text-gray-800 text-right">{value ?? "—"}</span>
              </div>
            ))}
            {data.descripcion && (
              <div className="pt-2">
                <p className="text-xs text-gray-400 mb-2">Descripción</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-4">{data.descripcion}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
