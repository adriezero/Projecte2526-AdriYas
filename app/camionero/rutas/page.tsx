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
  FechaInicio: string;
};

type Documento = {
  id: number;
  nombre: string;
  tipo: string;
  tamano: string | null;
  rutaArchivo: string;
  fechaSubida: string;
};

const filtros = ["Todos", "Hoy", "Esta Semana", "Este Mes", "Últimos 3 Meses", "Personalizado"];
const POR_PAGINA = 7;

function getRangoFechas(filtro: string): { desde: string; hasta: string } | null {
  const hoy = new Date();
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  const hasta = fmt(hoy);
  if (filtro === "Hoy") return { desde: hasta, hasta };
  if (filtro === "Esta Semana") {
    const d = new Date(hoy); d.setDate(hoy.getDate() - 7);
    return { desde: fmt(d), hasta };
  }
  if (filtro === "Este Mes") {
    const d = new Date(hoy); d.setMonth(hoy.getMonth() - 1);
    return { desde: fmt(d), hasta };
  }
  if (filtro === "Últimos 3 Meses") {
    const d = new Date(hoy); d.setMonth(hoy.getMonth() - 3);
    return { desde: fmt(d), hasta };
  }
  return null;
}

export default function Rutas() {
  const [filtroActivo, setFiltroActivo] = useState("Todos");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [rutaSeleccionada, setRutaSeleccionada] = useState<number | null>(null);
  const [pagina, setPagina] = useState(1);
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tipoIncidencia, setTipoIncidencia] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [enviandoReporte, setEnviandoReporte] = useState(false);

  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [subiendoDoc, setSubiendoDoc] = useState(false);
  const [tipoDoc, setTipoDoc] = useState("Otro");
  const inputDoc = useRef<HTMLInputElement>(null);
  const [modalVerDoc, setModalVerDoc] = useState<Documento | null>(null);

  useEffect(() => {
    setCargando(true);
    const rango = filtroActivo === "Todos" ? null
      : filtroActivo === "Personalizado"
      ? (fechaDesde && fechaHasta ? { desde: fechaDesde, hasta: fechaHasta } : null)
      : getRangoFechas(filtroActivo);

    const url = rango
      ? `/api/camionero/rutas?desde=${rango.desde}&hasta=${rango.hasta}`
      : "/api/camionero/rutas";

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        setRutas(data);
        setPagina(1);
        setRutaSeleccionada(data.length > 0 ? data[0].ID : null);
      })
      .finally(() => setCargando(false));
  }, [filtroActivo, fechaDesde, fechaHasta]);

  useEffect(() => {
    if (!rutaSeleccionada) return;
    fetch(`/api/camionero/rutas/documentos?idRuta=${rutaSeleccionada}`)
      .then(r => r.json())
      .then(setDocumentos)
      .catch(() => setDocumentos([]));
  }, [rutaSeleccionada]);

  const totalPaginas = Math.ceil(rutas.length / POR_PAGINA);
  const rutasPagina = rutas.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);
  const detalle = rutas.find((r) => r.ID === rutaSeleccionada);

  async function enviarReporte() {
    if (!tipoIncidencia) return;
    setEnviandoReporte(true);
    const res = await fetch('/api/reportes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Tipo: tipoIncidencia, Descripcion: descripcion }),
    });
    setEnviandoReporte(false);
    if (res.ok) {
      setModalAbierto(false);
      setTipoIncidencia("");
      setDescripcion("");
    }
  }

  async function subirDocumento(file: File) {
    if (!rutaSeleccionada) return;
    setSubiendoDoc(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("idRuta", String(rutaSeleccionada));
    fd.append("tipo", tipoDoc);
    const res = await fetch("/api/camionero/rutas/documentos", { method: "POST", body: fd });
    if (res.ok) {
      const nuevo = await res.json();
      setDocumentos(prev => [nuevo, ...prev]);
    }
    setSubiendoDoc(false);
  }

  async function eliminarDocumento(id: number) {
    await fetch(`/api/documentos/${id}`, { method: "DELETE" });
    setDocumentos(prev => prev.filter(d => d.id !== id));
  }

  function iconoDoc(nombre: string) {
    const ext = nombre.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext ?? "")) return "🖼️";
    if (ext === "pdf") return "📄";
    return "📎";
  }

  return (
    <div className="bg-gray-50 p-10 min-h-screen" style={{ marginLeft: "300px" }}>
      <div className="max-w-full">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Mis Rutas</h1>
        </div>

        <div className="flex gap-8 flex-1">
          {/* Tabla */}
          <div className="flex-[3] bg-white rounded-xl shadow p-6 flex flex-col">
            <div className="flex gap-3 mb-6 flex-wrap items-center">
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
              {filtroActivo === "Personalizado" && (
                <div className="flex items-center gap-2 ml-1">
                  <input
                    type="date"
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-400 text-xs">—</span>
                  <input
                    type="date"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
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
                      <th className="pb-4 font-medium">Fecha</th>
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
                          <td className={`py-4 ${activa ? "text-blue-600" : "text-gray-600"}`}>{new Date(r.FechaInicio).toLocaleDateString("es-ES")}</td>
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

                {/* Documentos de la Ruta */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-gray-800">Documentos de la Ruta</h3>
                    <div className="flex items-center gap-2">
                     
                      <button
                        onClick={() => inputDoc.current?.click()}
                        disabled={subiendoDoc}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
                      >
                        {subiendoDoc ? "Subiendo..." : "⬆ Subir archivo"}
                      </button>
                      <input
                        ref={inputDoc}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) subirDocumento(f); e.target.value = ""; }}
                      />
                    </div>
                  </div>

                  {documentos.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-xl">No hay documentos subidos para esta ruta.</p>
                  ) : (
                    <div className="space-y-2">
                      {documentos.map(doc => (
                        <div key={doc.id} className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-100">
                          <span className="text-xl">{iconoDoc(doc.nombre)}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">{doc.nombre}</p>
                            <p className="text-xs text-gray-400">{doc.tipo} · {doc.tamano ?? ""}</p>
                          </div>
                          <button
                            onClick={() => setModalVerDoc(doc)}
                            className="px-2.5 py-1 text-xs border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                          >
                            Ver
                          </button>
                          <a
                            href={doc.rutaArchivo}
                            download={doc.nombre}
                            className="px-2.5 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          >
                            Descargar
                          </a>
                          <button
                            onClick={() => eliminarDocumento(doc.id)}
                            className="px-2.5 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                          >
                            🗑
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
                <h2 className="text-lg font-bold text-gray-900">Reportar Incidencia</h2>
              </div>
              <button onClick={() => setModalAbierto(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-xl leading-none transition">&times;</button>
            </div>

            <div className="px-8 py-6 space-y-5">
              {/* Ruta afectada */}
              <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Ruta Afectada</p>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-lg">🚛</span>
                  <span className="text-sm font-medium text-gray-700">R-{String(detalle.ID).padStart(5, "0")} — {detalle.Origen} → {detalle.Destino}</span>
                </div>
              </div>

              {/* Tipo */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Tipo de Reporte</label>
                <select
                  value={tipoIncidencia}
                  onChange={(e) => setTipoIncidencia(e.target.value)}
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
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={4}
                  placeholder="Describe el problema o incidencia con detalle..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 resize-none bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setModalAbierto(false)} className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition">Cancelar</button>
              <button onClick={enviarReporte} disabled={!tipoIncidencia || enviandoReporte} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm shadow-blue-200 transition disabled:opacity-50">
                {enviandoReporte ? 'Enviando...' : 'Enviar Reporte'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Ver Documento */}
      {modalVerDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setModalVerDoc(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-800 truncate">{modalVerDoc.nombre}</p>
              <button onClick={() => setModalVerDoc(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-xl leading-none">&times;</button>
            </div>
            <div className="p-4 flex items-center justify-center bg-gray-50 min-h-[400px]">
              {["jpg","jpeg","png","gif","webp"].includes(modalVerDoc.nombre.split(".").pop()?.toLowerCase() ?? "") ? (
                <img src={modalVerDoc.rutaArchivo} alt={modalVerDoc.nombre} className="max-h-[500px] max-w-full rounded-lg object-contain" />
              ) : modalVerDoc.nombre.endsWith(".pdf") ? (
                <iframe src={modalVerDoc.rutaArchivo} className="w-full h-[500px] rounded-lg" />
              ) : (
                <div className="text-center">
                  <p className="text-4xl mb-3">📎</p>
                  <p className="text-sm text-gray-500">Vista previa no disponible para este tipo de archivo.</p>
                  <a href={modalVerDoc.rutaArchivo} download={modalVerDoc.nombre} className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">Descargar</a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
