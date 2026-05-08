"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getClienteCompleto } from "./logic";

const ESTADO_COLOR: Record<string, string> = {
  Pendiente:    "bg-yellow-100 text-yellow-700",
  "En Proceso": "bg-blue-100 text-blue-700",
  Aceptada:     "bg-green-100 text-green-700",
  Rechazada:    "bg-red-100 text-red-600",
};

const FILTROS = ["Todas", "Pendiente", "En Proceso", "Aceptada", "Rechazada"];

function formatFecha(f: string) {
  return new Date(f).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

export default function SolicitarPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("Todas");

  useEffect(() => {
    if (!session?.user?.id) return;
    getClienteCompleto(session.user.id).then(async (cliente) => {
      if (!cliente) { setLoading(false); return; }
      const res = await fetch("/api/solicitudes");
      const data = await res.json();
      setSolicitudes(Array.isArray(data) ? data.filter((s: any) => s.cliente === cliente.Nombre) : []);
      setLoading(false);
    });
  }, [session]);

  const filtradas = filtro === "Todas" ? solicitudes : solicitudes.filter(s => s.estado === filtro);

  return (
    <div className="min-h-screen bg-white px-6 pt-24 pb-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-black">Mis Solicitudes</h1>
        <button
          onClick={() => router.push("/home/cliente/solicitar/nueva")}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          + Nueva solicitud
        </button>
      </div>

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
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm">Cargando...</div>
      ) : filtradas.length === 0 ? (
        <div className="text-gray-400 text-sm">No hay solicitudes{filtro !== "Todas" ? ` con estado "${filtro}"` : ""}.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtradas.map((s) => (
            <button
              key={s.id}
              onClick={() => router.push(`/home/cliente/solicitar/${s.id}`)}
              className="text-left border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all bg-white"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm text-gray-800">
                  Solicitud #{String(s.id).padStart(6, "0")}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ESTADO_COLOR[s.estado] ?? "bg-gray-100 text-gray-600"}`}>
                  {s.estado}
                </span>
              </div>
              <div className="text-sm font-medium text-gray-700 mb-1 truncate">{s.asunto}</div>
              <div className="text-xs text-gray-400 mb-1">Tipo: {s.tipo}</div>
              <div className="text-xs text-gray-400">Fecha: {formatFecha(s.fecha)}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
