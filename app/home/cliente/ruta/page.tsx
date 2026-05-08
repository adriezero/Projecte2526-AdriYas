"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ESTADO_COLOR: Record<string, string> = {
  Programado:  "bg-yellow-100 text-yellow-700",
  Cargando:    "bg-blue-100 text-blue-700",
  En_ruta:     "bg-green-100 text-green-700",
  En_pausa:    "bg-orange-100 text-orange-700",
  Finalizado:  "bg-gray-100 text-gray-600",
  Incidente:   "bg-red-100 text-red-600",
};

const ESTADO_LABEL: Record<string, string> = {
  Programado: "Programado",
  Cargando:   "Cargando",
  En_ruta:    "En Ruta",
  En_pausa:   "En Pausa",
  Finalizado: "Finalizado",
  Incidente:  "Incidente",
};

const FILTROS = ["Todas", "Programado", "Cargando", "En_ruta", "En_pausa", "Finalizado", "Incidente"];

function formatFecha(fecha: string | null) {
  if (!fecha) return "—";
  return new Date(fecha).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

export default function RutaListPage() {
  const router = useRouter();
  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("Todas");

  useEffect(() => {
    fetch("/api/cliente/ruta")
      .then(r => r.json())
      .then(d => { setReservas(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtradas = filtro === "Todas"
    ? reservas
    : reservas.filter(r => r.rutaEstado === filtro);

  return (
    <div className="min-h-screen bg-white px-6 pt-24 pb-6">
      <h1 className="text-xl font-bold mb-5">Mis Reservas</h1>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap mb-6">
        {FILTROS.map(f => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition ${
              filtro === f
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {f === "Todas" ? "Todas" : ESTADO_LABEL[f]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm">Cargando...</div>
      ) : filtradas.length === 0 ? (
        <div className="text-gray-400 text-sm">No hay rutas{filtro !== "Todas" ? ` con estado "${ESTADO_LABEL[filtro]}"` : ""}.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtradas.map((r) => (
            <button
              key={r.idReserva}
              onClick={() => router.push(`/home/cliente/ruta/${r.idReserva}`)}
              className="text-left border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all bg-white"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm text-gray-800">
                  Reserva #{String(r.idReserva).padStart(6, "0")}
                </span>
                {r.rutaEstado ? (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ESTADO_COLOR[r.rutaEstado] ?? "bg-gray-100 text-gray-600"}`}>
                    {ESTADO_LABEL[r.rutaEstado] ?? r.rutaEstado}
                  </span>
                ) : (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Sin ruta</span>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <span>📍</span>
                <span className="truncate">{r.rutaOrigen ?? "—"} → {r.rutaDestino ?? "—"}</span>
              </div>

              <div className="text-xs text-gray-400 mb-1">Motivo: {r.reservaMotivo}</div>
              <div className="text-xs text-gray-400 mb-3">Fecha: {formatFecha(r.reservaFecha)}</div>

              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600">{r.conductorNombre}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
