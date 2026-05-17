"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const PASOS = [
  { key: "Programado", label: "Programado", icon: "📋", desc: "Reserva confirmada" },
  { key: "Cargando",   label: "Cargando",   icon: "📦", desc: "Cargando mercancía" },
  { key: "En_ruta",    label: "En Ruta",    icon: "🚛", desc: "En camino al destino" },
  { key: "Finalizado", label: "Finalizado", icon: "✅", desc: "Entrega completada" },
];

const ESTADO_COLOR: Record<string, { badge: string; bg: string; border: string; text: string }> = {
  Programado: { badge: "bg-yellow-100 text-yellow-700", bg: "bg-yellow-50",  border: "border-yellow-200", text: "text-yellow-700" },
  Cargando:   { badge: "bg-blue-100 text-blue-700",     bg: "bg-blue-50",    border: "border-blue-200",   text: "text-blue-700"   },
  En_ruta:    { badge: "bg-green-100 text-green-700",   bg: "bg-green-50",   border: "border-green-200",  text: "text-green-700"  },
  En_pausa:   { badge: "bg-orange-100 text-orange-700", bg: "bg-orange-50",  border: "border-orange-200", text: "text-orange-700" },
  Finalizado: { badge: "bg-gray-100 text-gray-600",     bg: "bg-gray-50",    border: "border-gray-200",   text: "text-gray-600"   },
  Incidente:  { badge: "bg-red-100 text-red-600",       bg: "bg-red-50",     border: "border-red-200",    text: "text-red-600"    },
};

const ESTADO_LABEL: Record<string, string> = {
  Programado: "Programado", Cargando: "Cargando", En_ruta: "En Ruta",
  En_pausa: "En Pausa", Finalizado: "Finalizado", Incidente: "Incidente",
};

function formatFecha(f: string | null) {
  if (!f) return "—";
  return new Date(f).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

function ModalReporte({ onClose, reservaId, origen, destino }: { onClose: () => void; reservaId: number; origen: string; destino: string }) {
  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviarReporte() {
    if (!tipo) return;
    setEnviando(true);
    await fetch("/api/reportes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Tipo: tipo, Descripcion: descripcion }),
    });
    setEnviando(false);
    setTipo("");
    setDescripcion("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl relative">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-lg">⚠️</div>
            <h2 className="text-lg font-bold text-gray-900">Reportar Incidencia</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-xl leading-none transition">&times;</button>
        </div>

        <div className="px-8 py-6 space-y-5">
          {/* Reserva afectada */}
          <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Reserva Afectada</p>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-lg">🚛</span>
              <span className="text-sm font-medium text-gray-700">#{String(reservaId).padStart(6, "0")} — {origen} → {destino}</span>
            </div>
          </div>

          {/* Tipo */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Tipo de Reporte</label>
            <select
              value={tipo}
              onChange={e => setTipo(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="">Selecciona el tipo de reporte</option>
              <option value="Problema Técnico">Problema Técnico</option>
              <option value="Incidencia">Incidencia</option>
              <option value="Sugerencia">Sugerencia</option>
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Descripción</label>
            <textarea
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              rows={4}
              placeholder="Describe el problema o incidencia con detalle..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 resize-none bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition">Cancelar</button>
          <button onClick={enviarReporte} disabled={!tipo || enviando} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm shadow-blue-200 transition disabled:opacity-50">
            {enviando ? "Enviando..." : "Enviar Reporte"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DetallePedidoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<{
    idReserva: number;
    rutaEstado: string | null;
    rutaOrigen?: string;
    rutaDestino?: string;
    rutaFechaInicio?: string;
    rutaCargas?: string;
    reservaOrigen?: string;
    reservaDestino?: string;
    reservaFecha: string;
    reservaHora: string;
    reservaMotivo: string;
    reservaRepresentante?: string;
    reservaDescripcion?: string;
    conductorNombre: string;
    conductorTelf: string;
    conductorLicencia: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalReporte, setModalReporte] = useState(false);

  useEffect(() => {
    fetch(`/api/cliente/ruta/${id}`)
      .then(r => r.json())
      .then(d => { if (d.error) setError(d.error); else setData(d); setLoading(false); })
      .catch(() => { setError("Error al cargar"); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400 text-sm">Cargando...</p>
    </div>
  );
  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-red-500 text-sm">{error}</p>
    </div>
  );

  const estado = data.rutaEstado as string | null;
  const esIncidente = estado === "Incidente";
  const enPausa = estado === "En_pausa";
  const idxActual = PASOS.findIndex(p => p.key === estado);
  const colores = estado ? ESTADO_COLOR[estado] : null;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">

      {modalReporte && (
        <ModalReporte
          onClose={() => setModalReporte(false)}
          reservaId={data.idReserva}
          origen={data.rutaOrigen ?? data.reservaOrigen ?? "—"}
          destino={data.rutaDestino ?? data.reservaDestino ?? "—"}
        />
      )}

      {/* Hero banner */}
      <div className={`w-full px-10 py-8 ${colores?.bg ?? "bg-white"} border-b ${colores?.border ?? "border-gray-200"}`}>
        <div>
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4"
          >
            ← Volver a mis rutas
          </button>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Detalle del pedido</p>
              <h1 className="text-3xl font-bold text-gray-900">
                Reserva <span className={colores?.text ?? "text-gray-900"}>#{String(data.idReserva).padStart(6, "0")}</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">{formatFecha(data.reservaFecha)} · {data.reservaHora}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setModalReporte(true)}
                className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 bg-white rounded-lg text-sm font-semibold hover:bg-red-50 transition"
              >
                ⚠️ Reportar problema
              </button>
              {estado ? (
                <span className={`text-sm font-semibold px-4 py-1.5 rounded-full ${colores?.badge ?? "bg-gray-100 text-gray-600"}`}>
                  {esIncidente ? "⚠️ Incidente" : enPausa ? "⏸️ En Pausa" : ESTADO_LABEL[estado]}
                </span>
              ) : (
                <span className="text-sm font-medium px-4 py-1.5 rounded-full bg-gray-100 text-gray-500">Sin ruta asignada</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-10 py-8">

        {/* Banners de alerta */}
        {esIncidente && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
            ⚠️ Se ha reportado un incidente en esta ruta. El equipo está gestionando la situación.
          </div>
        )}
        {enPausa && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-700 text-sm font-medium">
            ⏸️ La ruta está temporalmente en pausa.
          </div>
        )}

        {/* Timeline */}
        {estado && !esIncidente && (
          <div className="bg-white border border-gray-200 rounded-xl p-8 mb-12 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-8">Estado del pedido</p>
            <div className="relative flex items-start justify-between">
              <div className="absolute top-6 left-[6%] right-[6%] h-0.5 bg-gray-200" />
              {idxActual > 0 && (
                <div
                  className="absolute top-6 left-[6%] h-0.5 bg-blue-500 transition-all duration-500"
                  style={{ width: `${(idxActual / (PASOS.length - 1)) * 88}%` }}
                />
              )}
              {PASOS.map((paso, i) => {
                const completado = i < idxActual;
                const activo = i === idxActual;
                return (
                  <div key={paso.key} className="flex flex-col items-center z-10 flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 transition-all duration-300 ${
                      activo     ? "border-blue-500 bg-white shadow-lg shadow-blue-100 scale-110" :
                      completado ? "border-blue-400 bg-blue-500" :
                                   "border-gray-200 bg-white"
                    }`}>
                      {completado
                        ? <span className="text-white font-bold text-base">✓</span>
                        : <span className={activo ? "" : "opacity-40"}>{paso.icon}</span>
                      }
                    </div>
                    <span className={`text-sm mt-3 font-semibold ${
                      activo ? "text-blue-600" : completado ? "text-blue-400" : "text-gray-300"
                    }`}>
                      {paso.label}
                    </span>
                    <span className={`text-xs mt-0.5 text-center ${
                      activo ? "text-gray-500" : completado ? "text-gray-400" : "text-gray-300"
                    }`}>
                      {paso.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Grid de tarjetas */}
        <br />
        <div className="grid grid-cols-3 gap-5">

          {/* Ruta */}
          {estado && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Ruta asignada</p>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">🟢</span>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Origen</p>
                    <p className="text-sm font-semibold text-gray-800">{data.rutaOrigen ?? data.reservaOrigen ?? "—"}</p>
                  </div>
                </div>
                <div className="ml-3.5 w-px h-4 bg-gray-200" />
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">🔴</span>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Destino</p>
                    <p className="text-sm font-semibold text-gray-800">{data.rutaDestino ?? data.reservaDestino ?? "—"}</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-0.5">Fecha de inicio</p>
                <p className="text-sm font-semibold text-gray-800">{formatFecha(data.rutaFechaInicio)}</p>
              </div>
              {data.rutaCargas && (
                <div className="mt-3">
                  <p className="text-xs text-gray-400 mb-0.5">Cargas</p>
                  <p className="text-sm font-semibold text-gray-800">{data.rutaCargas}</p>
                </div>
              )}
            </div>
          )}

          {/* Conductor */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Conductor asignado</p>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-base font-bold text-gray-800">{data.conductorNombre}</p>
                <p className="text-xs text-gray-400">Conductor</p>
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Teléfono</span>
                <span className="text-sm font-semibold text-gray-800">{data.conductorTelf}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Licencia</span>
                <span className="text-sm font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">{data.conductorLicencia}</span>
              </div>
            </div>
          </div>

          {/* Reserva */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Detalles de la reserva</p>
            <div className="space-y-3">
              {[
                { label: "Motivo",        value: data.reservaMotivo },
                { label: "Fecha",         value: formatFecha(data.reservaFecha) },
                { label: "Hora",          value: data.reservaHora },
                { label: "Origen",        value: data.reservaOrigen },
                { label: "Destino",       value: data.reservaDestino },
                { label: "Representante", value: data.reservaRepresentante },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start gap-4">
                  <span className="text-xs text-gray-400 shrink-0">{label}</span>
                  <span className="text-sm font-medium text-gray-800 text-right">{value ?? "—"}</span>
                </div>
              ))}
              {data.reservaDescripcion && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">Descripción</p>
                  <p className="text-sm text-gray-700">{data.reservaDescripcion}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
