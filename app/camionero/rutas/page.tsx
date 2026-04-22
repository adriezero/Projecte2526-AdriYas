"use client";

import { useState, useEffect, useRef } from "react";
import BarraLateral from "@componentes/camionero/BarraLateral";

type Ruta = {
  ID: number;
  Origen: string;
  Destino: string;
  Estado: string | null;
  Cargas: string;
  Reservas: string;
  EnTiempoReal: boolean;
};

const filtros = ["Hoy", "Esta Semana", "Este Mes", "Últimos 3 Meses", "Personalizado"];
const POR_PAGINA = 7;

export default function Rutas() {
  const [filtroActivo, setFiltroActivo] = useState("Esta Semana");
  const [rutaSeleccionada, setRutaSeleccionada] = useState<number | null>(null);
  const [pagina, setPagina] = useState(1);
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tipoIncidencia, setTipoIncidencia] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [prioridad, setPrioridad] = useState("Media");
  const [archivo, setArchivo] = useState<File | null>(null);
  const inputArchivo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/camionero/rutas")
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        setRutas(data);
        if (data.length > 0) setRutaSeleccionada(data[0].ID);
      })
      .finally(() => setCargando(false));
  }, []);

  const totalPaginas = Math.ceil(rutas.length / POR_PAGINA);
  const rutasPagina = rutas.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);
  const detalle = rutas.find((r) => r.ID === rutaSeleccionada);

  return (
    <div className="bg-gray-50 p-10 min-h-screen" style={{ marginLeft: "300px" }}>
      <div className="max-w-full">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Mis Rutas</h1>
        </div>

        <div className="flex gap-8 flex-1">
          {/* Tabla */}
          <div className="flex-[3] bg-white rounded-xl shadow p-6 flex flex-col">
            <div className="flex gap-3 mb-6 flex-wrap">
              {filtros.map((f) => (
                <button
                  key={f}
                  onClick={() => setFiltroActivo(f)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium border transition ${
                    filtroActivo === f
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {f === "Personalizado" ? (
                    <span className="flex items-center gap-1">{f} <i className="bi bi-calendar3" /></span>
                  ) : f}
                </button>
              ))}
            </div>

            {cargando ? (
              <p className="text-gray-400 text-sm">Cargando rutas...</p>
            ) : rutas.length === 0 ? (
              <p className="text-gray-400 text-sm">No tienes rutas asignadas.</p>
            ) : (
              <>
                <table className="w-full text-base">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="pb-4 font-medium">ID Ruta</th>
                      <th className="pb-4 font-medium">Origen</th>
                      <th className="pb-4 font-medium">Destino</th>
                      <th className="pb-4 font-medium">Estado</th>
                      <th className="pb-4 font-medium">En Tiempo Real</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rutasPagina.map((r) => {
                      const activa = r.ID === rutaSeleccionada;
                      return (
                        <tr
                          key={r.ID}
                          onClick={() => setRutaSeleccionada(r.ID)}
                          className={`border-b cursor-pointer transition ${activa ? "bg-blue-50" : "hover:bg-gray-50"}`}
                        >
                          <td className={`py-4 font-medium ${activa ? "text-blue-600" : "text-gray-700"}`}>R-{String(r.ID).padStart(5, "0")}</td>
                          <td className={`py-4 ${activa ? "text-blue-600" : "text-gray-600"}`}>{r.Origen}</td>
                          <td className={`py-4 ${activa ? "text-blue-600" : "text-gray-600"}`}>{r.Destino}</td>
                          <td className={`py-4 ${activa ? "text-blue-600" : "text-gray-600"}`}>{r.Estado ?? "—"}</td>
                          <td className="py-4 text-gray-600">{r.EnTiempoReal ? "Sí" : "No"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {totalPaginas > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      onClick={() => setPagina((p) => Math.max(1, p - 1))}
                      disabled={pagina === 1}
                      className="px-3 py-1 rounded border text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                    >
                      Anterior
                    </button>
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        onClick={() => setPagina(n)}
                        className={`px-3 py-1 rounded border text-sm transition ${pagina === n ? "bg-blue-600 text-white border-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                      className="px-3 py-1 rounded border text-sm text-gray-600 hover:bg-gray-100"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Panel de detalles */}
          <div className="flex-[2] bg-white rounded-xl shadow p-8 flex flex-col gap-6 self-stretch">
            <h2 className="text-xl font-bold text-gray-800">
              Detalles de Ruta: {detalle ? `R-${String(detalle.ID).padStart(5, "0")}` : "—"}
            </h2>

            {detalle ? (
              <>
                <div className="text-lg text-gray-700 space-y-5">
                  <p><span className="font-medium">Origen:</span> {detalle.Origen}</p>
                  <p><span className="font-medium">Destino:</span> {detalle.Destino}</p>
                  <p><span className="font-medium">Estado:</span> {detalle.Estado ?? "—"}</p>
                  <p><span className="font-medium">Carga:</span> {detalle.Cargas}</p>
                  <p><span className="font-medium">Reservas:</span> {detalle.Reservas}</p>
                  <p><span className="font-medium">En Tiempo Real:</span> {detalle.EnTiempoReal ? "Sí" : "No"}</p>
                </div>
                <button onClick={() => setModalAbierto(true)} className="mt-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition">
                  Reportar Incidencia
                </button>
              </>
            ) : (
              <p className="text-sm text-gray-400">Selecciona una ruta para ver los detalles.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal Reportar Incidencia */}
      {modalAbierto && detalle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl relative">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-lg">⚠️</div>
                <h2 className="text-lg font-bold text-gray-900">Reportar Incidencia con Archivo</h2>
              </div>
              <button onClick={() => setModalAbierto(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-xl leading-none transition">&times;</button>
            </div>

            <div className="px-8 py-6 space-y-5">
              {/* Ruta afectada */}
              <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Archivo Afectado</p>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-lg">📄</span>
                  <span className="text-sm font-medium text-gray-700">R-{String(detalle.ID).padStart(5, "0")} — {detalle.Origen} → {detalle.Destino}</span>
                </div>
              </div>

              {/* Ubicación */}
              <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Ubicación</p>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-lg">📁</span>
                  <span className="text-sm text-gray-600">{detalle.Origen} › {detalle.Destino}</span>
                </div>
              </div>

              {/* Tipo */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Tipo de Incidencia</label>
                <select
                  value={tipoIncidencia}
                  onChange={(e) => setTipoIncidencia(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="">Selecciona el tipo de incidencia</option>
                  <option value="accidente">Accidente</option>
                  <option value="averia">Avería</option>
                  <option value="retraso">Retraso</option>
                  <option value="carga">Problema con la carga</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              {/* Descripción */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Descripción Detallada</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={4}
                  placeholder="Describe la incidencia con el archivo, incluyendo los pasos para reproducirla si aplica."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 resize-none bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Prioridad */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-3">Prioridad <span className="text-gray-400 font-normal">(Opcional)</span></label>
                <div className="flex gap-3">
                  {["Baja", "Media", "Alta"].map((p) => (
                    <label key={p} className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-medium cursor-pointer text-center transition ${
                      prioridad === p ? "border-gray-700 bg-gray-100 text-gray-800" : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                    }`}>
                      <input type="radio" name="prioridad" value={p} checked={prioridad === p} onChange={() => setPrioridad(p)} className="hidden" />
                      {p}
                    </label>
                  ))}
                </div>
              </div>

              {/* Adjuntar */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Adjuntar Captura <span className="text-gray-400 font-normal">(Opcional)</span></label>
                <button
                  onClick={() => inputArchivo.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition w-full justify-center"
                >
                  <span>📎</span> Seleccionar Archivo
                </button>
                <input ref={inputArchivo} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={(e) => setArchivo(e.target.files?.[0] ?? null)} />
                <p className="text-xs text-gray-400 mt-1.5 text-center">Formatos permitidos: JPG, PNG · Máximo 5MB</p>
                {archivo && (
                  <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700">
                    <span className="text-gray-500">📎</span>
                    <span className="flex-1 truncate">{archivo.name}</span>
                    <button onClick={() => setArchivo(null)} className="w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs hover:bg-red-600 transition">&times;</button>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setModalAbierto(false)} className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition">Cancelar</button>
              <button className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm shadow-blue-200 transition">Enviar Reporte</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
