"use client";
import { useState, useEffect } from "react";

const ESTADO_STEPS = [
  { label: "Pedido Confirmado", key: "Programado" },
  { label: "Preparando Pedido", key: "Cargando" },
  { label: "Pedido Recogido por Conductor", key: "En_ruta" },
  { label: "En Camino", key: "En_ruta" },
  { label: "Llegada Estimada", key: "Finalizado" },
];

const ESTADO_ORDER = ["Programado", "Cargando", "En_ruta", "En_pausa", "Finalizado"];

function getSteps(estado: string | null) {
  const idx = ESTADO_ORDER.indexOf(estado ?? "");
  return [
    { label: "Pedido Confirmado", done: idx >= 0, active: idx === 0 },
    { label: "Preparando Pedido", done: idx >= 1, active: idx === 1 },
    { label: "Pedido Recogido por Conductor", done: idx >= 2, active: false },
    { label: "En Camino", done: idx >= 2, active: idx === 2 || idx === 3 },
    { label: "Llegada Estimada", done: idx >= 4, active: idx === 4 },
  ];
}

function formatFecha(fecha: string | null) {
  if (!fecha) return "—";
  return new Date(fecha).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

export default function RutaPage() {
  const [mapType, setMapType] = useState<"standard" | "satellite">("standard");
  const [showPopup, setShowPopup] = useState(false);
  const [copied, setCopied] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cliente/ruta")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const phone = data?.camionero?.telf ?? "—";
  const conductorNombre = data?.camionero?.nombre ?? "—";
  const ruta = data?.ruta;
  const reserva = data?.reserva;
  const steps = getSteps(ruta?.estado ?? null);

  function copyPhone() {
    navigator.clipboard.writeText(phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-white px-6 pt-24 pb-6">
      <div>
        <h1 className="text-xl font-bold mb-4">Seguimiento de Pedido en Tiempo Real</h1>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-400">Cargando...</div>
        ) : !ruta && !reserva ? (
          <div className="flex items-center justify-center h-64 text-gray-400">No tienes ninguna ruta activa.</div>
        ) : (
          <div className="flex gap-8" style={{ height: 520 }}>
            {/* Mapa */}
            <div className="flex-[3] min-w-0 h-full">
              <div className="relative rounded overflow-hidden h-full bg-gray-300">
                <div className="absolute" style={{ top: "20%", left: "20%" }}>
                  <span style={{ fontSize: 26 }}>🏭</span>
                </div>
                <div className="absolute" style={{ top: "43%", left: "43%" }}>
                  <span style={{ fontSize: 24 }}>🚚</span>
                </div>
                <div className="absolute" style={{ top: "62%", left: "63%" }}>
                  <div className="w-5 h-5 border-2 border-green-500 bg-transparent" />
                </div>
                {/* Etiquetas origen/destino */}
                {ruta && (
                  <>
                    <div className="absolute bg-white/80 text-xs px-2 py-0.5 rounded shadow" style={{ top: "14%", left: "20%" }}>
                      {ruta.origen}
                    </div>
                    <div className="absolute bg-white/80 text-xs px-2 py-0.5 rounded shadow" style={{ top: "68%", left: "58%" }}>
                      {ruta.destino}
                    </div>
                  </>
                )}
                <div className="absolute top-3 right-3 flex flex-col shadow bg-white rounded overflow-hidden border border-gray-300">
                  <button className="w-8 h-8 text-base font-bold text-gray-700 hover:bg-gray-100 flex items-center justify-center border-b border-gray-300">+</button>
                  <button className="w-8 h-8 text-base font-bold text-gray-700 hover:bg-gray-100 flex items-center justify-center">-</button>
                </div>
                <div className="absolute bottom-3 left-3 flex shadow rounded overflow-hidden border border-gray-300 bg-white text-sm">
                  <button
                    onClick={() => setMapType("standard")}
                    className={`px-4 py-1.5 font-medium transition-colors ${mapType === "standard" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                  >
                    Standard
                  </button>
                  <button
                    onClick={() => setMapType("satellite")}
                    className={`px-4 py-1.5 font-medium transition-colors border-l border-gray-300 ${mapType === "satellite" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                  >
                    Satellite
                  </button>
                </div>
              </div>
            </div>

            {/* Panel derecho */}
            <div className="flex flex-col h-full gap-3 flex-[2] min-w-0">
              {/* Info pedido */}
              <div className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
                <p className="font-bold text-sm mb-1">
                  Reserva #{reserva ? String(reserva.id).padStart(8, "0") : "—"}
                </p>
                <p className="text-blue-600 font-semibold text-sm mb-1">
                  Fecha: {formatFecha(reserva?.fecha ?? null)}
                </p>
                <p className="text-gray-400 text-xs mb-2">
                  {ruta?.estado === "En_ruta" || ruta?.estado === "En_pausa"
                    ? "En camino a tu dirección"
                    : ruta?.estado === "Programado"
                    ? "Pedido confirmado"
                    : ruta?.estado === "Cargando"
                    ? "Preparando carga"
                    : "—"}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full transition-all"
                    style={{ width: `${((ESTADO_ORDER.indexOf(ruta?.estado ?? "") + 1) / ESTADO_ORDER.length) * 100}%` }}
                  />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 border border-gray-300 flex items-center justify-center bg-gray-100 rounded shrink-0">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">Conductor: {conductorNombre}</span>
                </div>
                <button
                  onClick={() => setShowPopup(true)}
                  className="w-full bg-blue-600 text-white py-2 rounded-md flex items-center justify-center gap-2 text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
                  </svg>
                  Contactar al conductor
                </button>

                {showPopup && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowPopup(false)}>
                    <div className="bg-white rounded-xl shadow-xl p-6 w-80" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-between mb-4">
                        <p className="font-semibold text-gray-800">Contactar conductor</p>
                        <button onClick={() => setShowPopup(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">{conductorNombre}</p>
                      <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                        <svg className="w-5 h-5 text-blue-600 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
                        </svg>
                        <span className="flex-1 font-medium text-gray-800">{phone}</span>
                        <button onClick={copyPhone} className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors">
                          {copied ? "✓ Copiado" : "Copiar"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Estado del pedido */}
              <div className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white flex-1 overflow-auto">
                <p className="font-semibold text-sm mb-3">Estado del Pedido</p>
                <div className="flex flex-col gap-3">
                  {steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      {step.done ? (
                        <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      ) : step.active ? (
                        <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM3 4h1.5l2.5 7h7l2-5H6" />
                          </svg>
                        </span>
                      ) : (
                        <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-gray-300 inline-block" />
                      )}
                      <div>
                        <p className={`text-xs font-semibold leading-tight ${step.active ? "text-blue-600" : "text-gray-800"}`}>
                          {step.label}
                        </p>
                        {step.done && (
                          <p className="text-xs text-gray-400">{formatFecha(ruta?.fechaInicio ?? null)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acciones */}
              <div className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
                <p className="font-semibold text-sm mb-3 text-center">Acciones</p>
                <div className="flex flex-col gap-2">
                  <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-md text-sm hover:bg-gray-200 transition-colors">
                    Reportar un problema
                  </button>
                  <button className="w-full bg-red-50 text-red-400 py-2 rounded-md text-sm hover:bg-red-100 transition-colors">
                    Cancelar pedido
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
