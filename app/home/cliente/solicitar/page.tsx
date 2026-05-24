"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Plus } from "lucide-react";
import { getClienteCompleto } from "./logic";
import Spinner from "@componentes/ui/Spinner";

const ESTADO_COLOR: Record<string, string> = {
  Pendiente:    "bg-accent-yellow/20 text-accent-yellow",
  "En proceso": "bg-primary/10 text-primary",
  Aceptada:     "bg-green-100 text-green-700",
  Rechazada:    "bg-red-100 text-red-600",
};

const FILTROS = ["Todas", "Pendiente", "En proceso", "Aceptada", "Rechazada"];

function formatFecha(f: string) {
  return new Date(f).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

export default function SolicitarPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [solicitudes, setSolicitudes] = useState<Array<{
    id: number;
    cliente: string;
    asunto: string;
    tipo: string;
    fecha: string;
    estado: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("Todas");

  useEffect(() => {
    if (!session?.user?.id) return;
    getClienteCompleto(session.user.id).then(async (cliente) => {
      if (!cliente) { setLoading(false); return; }
      const res = await fetch("/api/solicitudes");
      const data = await res.json();
      setSolicitudes(Array.isArray(data) ? data.filter((s: { cliente: string }) => s.cliente === cliente.Nombre) : []);
      setLoading(false);
    });
  }, [session]);

  const filtradas = filtro === "Todas" ? solicitudes : solicitudes.filter(s => s.estado === filtro);

  return (
    <div className="min-h-screen bg-white px-6 pt-24 pb-6 md:px-8 lg:px-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-text pb-4 font-arsenal">
            Mis solicitudes
          </h1>
          <p className="text-border pb-8">
            Crea y gestiona tus solicitudes de servicio.
          </p>
        </div>
        
        <button
          onClick={() => router.push("/home/cliente/solicitar/nueva")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent-orange text-white text-sm font-semibold rounded-xl hover:bg-[#d66a1a] transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva solicitud</span>
        </button>
      </div>

      <div className="flex gap-2 flex-wrap pb-8">
        {FILTROS.map(f => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition ${
              filtro === f
                ? "bg-primary text-white border-primary"
                : "bg-white text-border border-border/30 hover:bg-bg"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner size="lg" text="Cargando reservas..." />
      ) : filtradas.length === 0 ? (
        <div className="px-5 text-text text-xl">No hay solicitudes{filtro !== "Todas" ? ` con estado "${filtro}"` : ""}.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtradas.map((s) => (
            <button
              key={s.id}
              onClick={() => router.push(`/home/cliente/solicitar/${s.id}`)}
              className="text-left border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-accent-orange/50 transition-all bg-white"
            >
              <div className="flex items-center justify-between pb-3">
                <span className="font-bold text-sm text-text">
                  Solicitud #{String(s.id).padStart(6, "0")}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ESTADO_COLOR[s.estado] ?? "bg-gray-100 text-gray-600"}`}>
                  {s.estado}
                </span>
              </div>
              <span className="text-sm font-bold">Asunto: </span>
              <span className="text-sm font-medium truncate">{s.asunto}</span>
              <div className="text-sm py-1 pt-2">Tipo: {s.tipo}</div>
              <div className="text-sm">Fecha: {formatFecha(s.fecha)}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
