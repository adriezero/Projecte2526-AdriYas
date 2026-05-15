"use client";
import { useEffect, useState } from "react";

type Ruta = {
  ID: number;
  Origen: string;
  Destino: string;
  Estado: string | null;
  FechaInicio: string;
  EnTiempoReal: boolean;
  Cargas: string;
  Reservas: string;
};

type Documento = {
  id: number;
  nombre: string;
  url: string;
  tipo: string;
  fechaSubida: string;
};

const filtros = ["Hoy", "Esta Semana", "Este Mes", "Personalizado"];
const POR_PAGINA = 10;

export default function RutasPage() {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [rutaSeleccionada, setRutaSeleccionada] = useState<number | null>(null);
  const [filtroActivo, setFiltroActivo] = useState("Hoy");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [cargando, setCargando] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tipoIncidencia, setTipoIncidencia] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [enviandoReporte, setEnviandoReporte] = useState(false);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [tipoDoc, setTipoDoc] = useState("POD");
  const [subiendoDoc, setSubiendoDoc] = useState(false);

  useEffect(() => {
    setCargando(true);
    let rango: { desde: string; hasta: string } | null = null;
    const hoy = new Date();
    if (filtroActivo === "Hoy") {
      const str = hoy.toISOString().split("T")[0];
      rango = { desde: str, hasta: str };
    } else if (filtroActivo === "Esta Semana") {
      const inicio = new Date(hoy);
      inicio.setDate(hoy.getDate() - hoy.getDay());
      const fin = new Date(inicio);
      fin.setDate(inicio.getDate() + 6);
      rango = { desde: inicio.toISOString().split("T")[0], hasta: fin.toISOString().split("T")[0] };
    } else if (filtroActivo === "Este Mes") {
      const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      const fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
      rango = { desde: inicio.toISOString().split("T")[0], hasta: fin.toISOString().split("T")[0] };
    } else if (filtroActivo === "Personalizado" && fechaDesde && fechaHasta) {
      rango = { desde: fechaDesde, hasta: fechaHasta };
    }

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
    <div className="bg-bg min-h-screen p-4 md:p-8 md:ml-75" style={{ marginLeft: '256px' }}>
      <div className="max-w-400 mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-text">Mis Rutas</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tabla */}
          <div className="flex-3 bg-white rounded-xl shadow-sm border border-border/20 p-4 md:p-6 flex flex-col">
            <div className="flex gap-2 mb-10 flex-wrap items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {filtros.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFiltroActivo(f)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      filtroActivo === f
                        ? "bg-primary text-white shadow-sm"
                        : "bg-white text-text/70 border border-border/30 hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    {f === "Personalizado" ? (
                      <span className="flex items-center gap-1.5">
                        <i className="bi bi-calendar3" />
                        {f}
                      </span>
                    ) : f}
                  </button>
                ))}
              </div>
              {filtroActivo === "Personalizado" && (
                <div className="flex items-center border border-border/30 rounded-lg overflow-hidden">
                  <input
                    type="date"
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                    className="px-3 py-2 text-sm text-text focus:outline-none focus:ring-0 border-0"
                  />
                  <div className="px-3 py-2 bg-bg border-l border-r border-border/30">
                    <i className="bi bi-chevron-double-right text-text/40" />
                  </div>
                  <input
                    type="date"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                    className="px-3 py-2 text-sm text-text focus:outline-none focus:ring-0 border-0"
                  />
                </div>
              )}
            </div>

            {cargando ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-text/50">
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <span className="text-sm">Cargando rutas...</span>
                </div>
              </div>
            ) : rutas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-text/50">
                <i className="bi bi-inbox text-4xl mb-3" />
                <p className="text-sm">No tienes rutas asignadas en este período.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto -mx-4 md:mx-0 pt-6">
                  <table className="w-full text-sm min-w-175">
                    <thead>
                      <tr className="text-left text-text/60 border-b border-border/20">
                        <th className="pb-3 px-2 font-semibold">ID</th>
                        <th className="pb-3 px-2 font-semibold">Origen</th>
                        <th className="pb-3 px-2 font-semibold">Destino</th>
                        <th className="pb-3 px-2 font-semibold">Estado</th>
                        <th className="pb-3 px-2 font-semibold">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rutasPagina.map((r) => {
                        const activa = r.ID === rutaSeleccionada;
                        return (
                          <tr
                            key={r.ID}
                            onClick={() => setRutaSeleccionada(r.ID)}
                            className={`border-b border-border/10 cursor-pointer transition-all ${
                              activa ? "bg-primary/5" : "hover:bg-bg"
                            }`}
                          >
                            <td className={`py-3.5 px-2 font-semibold ${activa ? "text-primary" : "text-text"}`}>
                              R-{String(r.ID).padStart(5, "0")}
                            </td>
                            <td className={`py-3.5 px-2 ${activa ? "text-primary" : "text-text/80"}`}>{r.Origen}</td>
                            <td className={`py-3.5 px-2 ${activa ? "text-primary" : "text-text/80"}`}>{r.Destino}</td>
                            <td className="py-3.5 px-2">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                r.Estado === "Completada" ? "bg-green-100 text-green-700" :
                                r.Estado === "En Progreso" ? "bg-accent-orange/10 text-accent-orange" :
                                "bg-gray-100 text-gray-600"
                              }`}>
                                {r.Estado ?? "Pendiente"}
                              </span>
                            </td>
                            <td className={`py-3.5 px-2 ${activa ? "text-primary" : "text-text/70"}`}>
                              {new Date(r.FechaInicio).toLocaleDateString("es-ES")}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {totalPaginas > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
                    <button
                      onClick={() => setPagina((p) => Math.max(1, p - 1))}
                      disabled={pagina === 1}
                      className="px-3 py-1.5 rounded-lg border border-border/30 text-sm text-text/70 hover:bg-bg hover:border-primary/40 disabled:opacity-40 disabled:hover:bg-white transition-all"
                    >
                      <i className="bi bi-chevron-left" />
                    </button>
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        onClick={() => setPagina(n)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          pagina === n
                            ? "bg-primary text-white shadow-sm"
                            : "text-text/70 hover:bg-bg border border-transparent hover:border-border/30"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                      disabled={pagina === totalPaginas}
                      className="px-3 py-1.5 rounded-lg border border-border/30 text-sm text-text/70 hover:bg-bg hover:border-primary/40 disabled:opacity-40 disabled:hover:bg-white transition-all"
                    >
                      <i className="bi bi-chevron-right" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Panel de detalles */}
          <div className="flex-2 bg-white rounded-xl shadow-sm border border-border/20 p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-border/20 pb-4">
              <h2 className="text-lg font-bold text-text">
                {detalle ? `Ruta R-${String(detalle.ID).padStart(5, "0")}` : "Selecciona una ruta"}
              </h2>
              {detalle && (
                <button
                  onClick={() => setModalAbierto(true)}
                  className="px-3 py-1.5 bg-accent-orange text-white rounded-lg text-sm font-medium hover:bg-accent-orange/90 transition-all shadow-sm"
                >
                  <i className="bi bi-exclamation-triangle mr-1.5" />
                  Reportar
                </button>
              )}
            </div>

            {detalle ? (
              <>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <i className="bi bi-geo-alt-fill text-primary text-lg mt-0.5" />
                    <div>
                      <p className="text-text/60 text-xs mb-0.5">Origen</p>
                      <p className="text-text font-medium">{detalle.Origen}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <i className="bi bi-geo-fill text-accent-orange text-lg mt-0.5" />
                    <div>
                      <p className="text-text/60 text-xs mb-0.5">Destino</p>
                      <p className="text-text font-medium">{detalle.Destino}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <i className="bi bi-box-seam text-text/60 text-lg mt-0.5" />
                    <div>
                      <p className="text-text/60 text-xs mb-0.5">Carga</p>
                      <p className="text-text font-medium">{detalle.Cargas}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <i className="bi bi-calendar-check text-text/60 text-lg mt-0.5" />
                    <div>
                      <p className="text-text/60 text-xs mb-0.5">Reservas</p>
                      <p className="text-text font-medium">{detalle.Reservas}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/20 pt-5">
                  <h3 className="text-sm font-bold text-text mb-4 flex items-center gap-2">
                    <i className="bi bi-file-earmark-text" />
                    Documentos
                  </h3>
                  
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <select
                      value={tipoDoc}
                      onChange={(e) => setTipoDoc(e.target.value)}
                      className="flex-1 min-w-30 border border-border/30 rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="POD">POD</option>
                      <option value="Factura">Factura</option>
                      <option value="Otro">Otro</option>
                    </select>
                    <label className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-all cursor-pointer shadow-sm">
                      <i className="bi bi-upload mr-1.5" />
                      Subir
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && subirDocumento(e.target.files[0])}
                        disabled={subiendoDoc}
                      />
                    </label>
                  </div>

                  {subiendoDoc && (
                    <div className="flex items-center gap-2 text-primary text-sm mb-3">
                      <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      Subiendo...
                    </div>
                  )}

                  <div className="space-y-2 max-h-75 overflow-y-auto">
                    {documentos.length === 0 ? (
                      <p className="text-text/50 text-xs text-center py-4">No hay documentos</p>
                    ) : (
                      documentos.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 bg-bg rounded-lg border border-border/20 hover:border-primary/30 transition-all"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="text-xl">{iconoDoc(doc.nombre)}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-text truncate">{doc.nombre}</p>
                              <p className="text-xs text-text/50">{doc.tipo} • {new Date(doc.fechaSubida).toLocaleDateString("es-ES")}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-2">
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-primary hover:bg-primary/10 rounded transition-all"
                            >
                              <i className="bi bi-eye" />
                            </a>
                            <button
                              onClick={() => eliminarDocumento(doc.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-all"
                            >
                              <i className="bi bi-trash" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-text/40">
                <i className="bi bi-arrow-left-circle text-4xl mb-3" />
                <p className="text-sm">Selecciona una ruta para ver detalles</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de reporte */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-text">Reportar Incidencia</h3>
              <button
                onClick={() => setModalAbierto(false)}
                className="text-text/40 hover:text-text transition-all"
              >
                <i className="bi bi-x-lg text-xl" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">Tipo de incidencia</label>
                <select
                  value={tipoIncidencia}
                  onChange={(e) => setTipoIncidencia(e.target.value)}
                  className="w-full border border-border/30 rounded-lg px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  <option value="">Selecciona...</option>
                  <option value="Retraso">Retraso</option>
                  <option value="Avería">Avería</option>
                  <option value="Accidente">Accidente</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">Descripción</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={4}
                  placeholder="Describe la incidencia..."
                  className="w-full border border-border/30 rounded-lg px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setModalAbierto(false)}
                  className="flex-1 px-4 py-2.5 border border-border/30 text-text/70 rounded-lg text-sm font-medium hover:bg-bg transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={enviarReporte}
                  disabled={!tipoIncidencia || enviandoReporte}
                  className="flex-1 px-4 py-2.5 bg-accent-orange text-white rounded-lg text-sm font-medium hover:bg-accent-orange/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  {enviandoReporte ? "Enviando..." : "Enviar Reporte"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
