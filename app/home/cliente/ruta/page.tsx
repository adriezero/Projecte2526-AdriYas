"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, FileText, Calendar, User, ArrowRight } from "lucide-react";
import Spinner from "@componentes/ui/Spinner";

const ESTADO_COLOR: Record<string, string> = {
  Programado:  "bg-accent-yellow/20 text-accent-yellow border border-accent-yellow/30",
  Cargando:    "bg-primary/10 text-primary border border-primary/20",
  En_ruta:     "bg-green-50 text-green-700 border border-green-200",
  En_pausa:    "bg-accent-orange/10 text-accent-orange border border-accent-orange/20",
  Finalizado:  "bg-gray-100 text-border border border-gray-200",
  Incidente:   "bg-red-50 text-red-600 border border-red-200",
};

const ESTADO_LABEL: Record<string, string> = {
  Programado: "Programado",
  Cargando:   "Cargando",
  En_ruta:    "En ruta",
  En_pausa:   "En pausa",
  Finalizado: "Finalizado",
  Incidente:  "Incidente",
};

const FILTROS = ["Todas", "Programado", "Cargando", "En_ruta", "En_pausa", "Finalizado", "Incidente"];

function formatFecha(fecha: string | null) {
  if (!fecha) return "-";
  return new Date(fecha).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

export default function RutaListPage() {
  const router = useRouter();
  const [reservas, setReservas] = useState<Array<{
    idReserva: number;
    rutaEstado?: string;
    rutaOrigen?: string;
    rutaDestino?: string;
    reservaMotivo: string;
    reservaFecha: string;
    conductorNombre: string;
  }>>([]);
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
    <div className="min-h-screen bg-linear-to-br from-white to-bg px-6 py-24 md:px-8 lg:px-12">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-text pb-4 font-arsenal">
          Mis reservas
        </h1>
        <p className="text-border pb-8">
          Gestiona y rastrea tus envíos.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 flex-wrap pb-8">
        {FILTROS.map(f => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              filtro === f
                ? "bg-primary text-white shadow-md scale-105"
                : "bg-white text-border border border-gray-200 hover:border-accent-orange hover:text-accent-orange hover:shadow-sm"
            }`}
          >
            {f === "Todas" ? "Todas" : ESTADO_LABEL[f]}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner size="lg" text="Cargando reservas..." />
      ) : filtradas.length === 0 ? (
        <div className="px-5 text-text text-xl">No hay rutas{filtro !== "Todas" ? ` con estado "${ESTADO_LABEL[filtro]}"` : ""}.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtradas.map((r) => (
            <button
              key={r.idReserva}
              onClick={() => router.push(`/home/cliente/ruta/${r.idReserva}`)}
              className="group text-left bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-accent-orange/50 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Header with ID and status */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-base text-text">
                  Reserva #{String(r.idReserva).padStart(6, "0")}
                </span>
                {r.rutaEstado ? (
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${ESTADO_COLOR[r.rutaEstado] ?? "bg-gray-100 text-border border border-gray-200"}`}>
                    {ESTADO_LABEL[r.rutaEstado] ?? r.rutaEstado}
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 text-border border border-gray-200">Sin ruta</span>
                )}
              </div>

              {/* Route information */}
              <div className="flex items-center gap-2 pb-4">
                <MapPin className="w-6 h-6 text-accent-orange shrink-0" />
                <div className="flex items-center gap-2">
                  <p className="text-sm text-text truncate">
                    {r.rutaOrigen ?? "-"}
                  </p>
                  <ArrowRight className="w-3 h-3 text-border shrink-0" />
                  <p className="text-sm text-text truncate">
                    {r.rutaDestino ?? "-"}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="space-y-2 pb-4 text-sm">
                <div className="flex items-center gap-2 pb-2">
                  <FileText className="w-4 h-4" />
                  <span>Motivo: {r.reservaMotivo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Fecha: {formatFecha(r.reservaFecha)}</span>
                </div>
              </div>

              {/* Driver info */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary to-[#163a5f] flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm text-text font-medium">
                  {r.conductorNombre}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
