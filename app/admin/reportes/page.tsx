"use client";
import { useEffect, useRef, useState } from "react";
import { 
  PageHeader, SearchInput, Spinner, EmptyState, 
  Pagination, StatCard, Button 
} from "@componentes/ui";
import {
  Reporte,
  TIPOS,
  PAGE_SIZE,
  badgeTipo,
  badgeEstado,
  iconoTipo,
  meses,
  fetchReportes,
  cambiarEstado as cambiarEstadoAPI,
  eliminarReportes,
  formatId,
  diasEnMes,
  primerDia,
  calcularEstadisticas,
} from "./logic";

export default function ReportesPage() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [orden, setOrden] = useState<"asc" | "desc">("desc");
  const [pagina, setPagina] = useState(1);
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [reporteVer, setReporteVer] = useState<Reporte | null>(null);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [tipoOpen, setTipoOpen] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [calMes, setCalMes] = useState(() => new Date());
  const [fechaFiltro, setFechaFiltro] = useState<string>("");
  const tipoRef = useRef<HTMLDivElement>(null);
  const calRef = useRef<HTMLDivElement>(null);

  const totalPaginas = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (tipoRef.current && !tipoRef.current.contains(e.target as Node))
        setTipoOpen(false);
      if (calRef.current && !calRef.current.contains(e.target as Node))
        setCalOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setLoading(true);
    setSeleccionados([]);
    fetchReportes({
      busqueda,
      tipo: filtroTipo,
      orden,
      pagina,
      fecha: fechaFiltro,
      estado: filtroEstado,
    })
      .then((data) => {
        setReportes(data.reportes ?? []);
        setTotal(data.total ?? 0);
      })
      .finally(() => setLoading(false));
  }, [busqueda, filtroTipo, orden, pagina, fechaFiltro, filtroEstado]);

  async function cambiarEstado(id: number, estado: string) {
    await cambiarEstadoAPI(id, estado);
    setReportes((prev) =>
      prev.map((r) => (r.ID === id ? { ...r, Estado: estado } : r)),
    );
  }

  async function eliminarSeleccionados() {
    await eliminarReportes(seleccionados);
    setReportes((prev) => prev.filter((r) => !seleccionados.includes(r.ID)));
    setTotal((prev) => prev - seleccionados.length);
    setSeleccionados([]);
  }

  async function marcarMasivo(estado: string) {
    await Promise.all(seleccionados.map((id) => cambiarEstadoAPI(id, estado)));
    setReportes((prev) =>
      prev.map((r) =>
        seleccionados.includes(r.ID) ? { ...r, Estado: estado } : r,
      ),
    );
    setSeleccionados([]);
  }

  function toggleSeleccion(id: number) {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function toggleTodos() {
    setSeleccionados((prev) =>
      prev.length === reportes.length ? [] : reportes.map((r) => r.ID),
    );
  }

  function seleccionarDia(dia: number) {
    const y = calMes.getFullYear();
    const m = String(calMes.getMonth() + 1).padStart(2, "0");
    const d = String(dia).padStart(2, "0");
    const fecha = `${y}-${m}-${d}`;
    setFechaFiltro((prev) => (prev === fecha ? "" : fecha));
    setCalOpen(false);
    setPagina(1);
  }

  const { pendientes, enRevision, resueltos } = calcularEstadisticas(reportes);

  return (
    <div className="bg-bg min-h-screen p-10" style={{ marginLeft: '256px' }}>
      <PageHeader 
        title="Centro de reportes" 
        subtitle="Supervisión y gestión centralizada de incidencias" 
      />

      <div className="grid grid-cols-4 gap-8 pb-8">
        {[
          {
            label: "Total Reportes",
            value: total,
            icon: "bi-clipboard-data-fill",
            bgColor: "bg-primary",
            filtro: "",
          },
          {
            label: "Pendientes",
            value: pendientes,
            icon: "bi-hourglass-split",
            bgColor: "bg-accent-orange",
            filtro: "Pendiente",
          },
          {
            label: "En Revisión",
            value: enRevision,
            icon: "bi-search",
            bgColor: "bg-primary",
            filtro: "En revisión",
          },
          {
            label: "Resueltos",
            value: resueltos,
            icon: "bi-check-circle-fill",
            bgColor: "bg-green-600",
            filtro: "Resuelto",
          },
        ].map(({ label, value, icon, bgColor, filtro }) => (
          <StatCard
            key={label}
            label={label}
            value={value}
            icon={icon}
            bgColor={bgColor}
            isActive={filtroEstado === filtro && filtro !== ""}
            onClick={() => {
              setFiltroEstado((prev) => (prev === filtro ? "" : filtro));
              setPagina(1);
            }}
          />
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-border/20 p-6 pb-8">
        <div className="flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-75">
            <SearchInput
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPagina(1);
              }}
              placeholder="ID, usuario o palabra clave..."
              label="Búsqueda global"
            />
          </div>

          <div ref={tipoRef}>
            <label className="block text-xs font-bold text-text/60 uppercase tracking-wider pb-2">
              Tipo
            </label>
            <div className="relative">
              <button
                onClick={() => setTipoOpen((o) => !o)}
                className="flex items-center gap-3 border-2 border-border/30 rounded-xl bg-white px-4 py-3 text-sm min-w-45 justify-between hover:border-primary/50 transition-all"
              >
                <span>{filtroTipo || "Todos los tipos"}</span>
                <i className="bi bi-chevron-down text-xs" />
              </button>
              {tipoOpen && (
                <div className="absolute z-20 mt-2 bg-white border-2 border-border/30 rounded-xl shadow-2xl w-full overflow-hidden">
                  <button
                    onClick={() => {
                      setFiltroTipo("");
                      setTipoOpen(false);
                      setPagina(1);
                    }}
                    className="w-full text-left px-5 py-3 text-sm hover:bg-primary/10 hover:text-primary transition-colors border-b border-border/10"
                  >
                    Todos los tipos
                  </button>
                  {TIPOS.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setFiltroTipo(t);
                        setTipoOpen(false);
                        setPagina(1);
                      }}
                      className="w-full text-left px-5 py-3 text-sm hover:bg-primary/10 hover:text-primary flex items-center gap-3 transition-colors border-b border-border/10 last:border-b-0"
                    >
                      <i className={`${iconoTipo[t]} text-base`} /> {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div ref={calRef}>
            <label className="block text-xs font-bold text-text/60 uppercase tracking-wider pb-2">
              Fecha
            </label>
            <div className="relative">
              <button
                onClick={() => setCalOpen((o) => !o)}
                className={`flex items-center gap-3 border-2 rounded-xl bg-white px-4 py-3 text-sm font-bold min-w-45 justify-between transition-all ${fechaFiltro ? "border-primary text-primary ring-2 ring-primary/20" : "border-border/30 hover:border-primary/50"}`}
              >
                <i className="bi bi-calendar3 text-base" />
                <span className="text-xs font-normal">{fechaFiltro || "Seleccionar"}</span>
                <i className="bi bi-chevron-down text-xs" />
              </button>
              {calOpen && (
                <div className="absolute z-20 right-0 mt-2 bg-white border-2 border-border/30 rounded-2xl shadow-2xl p-5 w-80">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() =>
                        setCalMes(
                          (d) => new Date(d.getFullYear(), d.getMonth() - 1, 1),
                        )
                      }
                      className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <i className="bi bi-chevron-left text-primary" />
                    </button>
                    <span className="font-black text-sm text-primary uppercase tracking-wide">
                      {meses[calMes.getMonth()]} {calMes.getFullYear()}
                    </span>
                    <button
                      onClick={() =>
                        setCalMes(
                          (d) => new Date(d.getFullYear(), d.getMonth() + 1, 1),
                        )
                      }
                      className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <i className="bi bi-chevron-right text-primary" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 text-center text-xs text-text/60 mb-3 font-black uppercase">
                    {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"].map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 text-center text-sm gap-1">
                    {Array.from({
                      length: primerDia(
                        calMes.getFullYear(),
                        calMes.getMonth(),
                      ),
                    }).map((_, i) => (
                      <span key={`e${i}`} />
                    ))}
                    {Array.from(
                      {
                        length: diasEnMes(
                          calMes.getFullYear(),
                          calMes.getMonth(),
                        ),
                      },
                      (_, i) => i + 1,
                    ).map((dia) => {
                      const y = calMes.getFullYear();
                      const m = String(calMes.getMonth() + 1).padStart(2, "0");
                      const d = String(dia).padStart(2, "0");
                      const isSelected = fechaFiltro === `${y}-${m}-${d}`;
                      return (
                        <button
                          key={dia}
                          onClick={() => seleccionarDia(dia)}
                          className={`rounded-lg w-9 h-9 mx-auto flex items-center justify-center text-xs font-bold transition-all ${isSelected ? "bg-primary text-white shadow-md scale-110" : "text-text hover:bg-primary/10 hover:text-primary"}`}
                        >
                          {dia}
                        </button>
                      );
                    })}
                  </div>
                  {fechaFiltro && (
                    <button
                      onClick={() => {
                        setFechaFiltro("");
                        setPagina(1);
                      }}
                      className="mt-4 w-full text-xs font-bold text-accent-orange hover:underline uppercase tracking-wide"
                    >
                      Limpiar fecha
                    </button>
                  )}
                  <div className="mt-4 flex gap-2 pt-4 border-t-2 border-border/20">
                    <button
                      onClick={() => {
                        setOrden("asc");
                        setCalOpen(false);
                      }}
                      className={`flex-1 text-xs py-2.5 rounded-xl font-bold transition-all uppercase tracking-wide ${orden === "asc" ? "bg-primary text-white shadow-md" : "bg-border/20 text-text hover:bg-border/30"}`}
                    >
                      <i className="bi bi-sort-up mr-1" /> Antiguo
                    </button>
                    <button
                      onClick={() => {
                        setOrden("desc");
                        setCalOpen(false);
                      }}
                      className={`flex-1 text-xs py-2.5 rounded-xl font-bold transition-all uppercase tracking-wide ${orden === "desc" ? "bg-primary text-white shadow-md" : "bg-border/20 text-text hover:bg-border/30"}`}
                    >
                      <i className="bi bi-sort-down mr-1" /> Reciente
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <br />

      <div className="bg-white rounded-2xl shadow-xl border border-border/20 overflow-hidden">
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <i className="bi bi-file-earmark-text-fill text-white text-2xl" />
            <h2 className="text-white font-bold text-lg tracking-wide">
              Registro de reportes
            </h2>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <span className="text-white font-bold text-sm">
              Total: {total} reportes
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner size="lg" text="Cargando reportes..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary/5 border-b-2 border-primary/20">
                  <th className="px-6 py-4 w-12">
                    <input
                      type="checkbox"
                      checked={
                        seleccionados.length === reportes.length &&
                        reportes.length > 0
                      }
                      onChange={toggleTodos}
                      className="w-5 h-5 rounded accent-primary"
                    />
                  </th>
                  {[
                    "ID Reporte",
                    "Usuario",
                    "Tipo",
                    "Fecha y Hora",
                    "Estado",
                    "Control",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-4 text-left text-xs font-black text-primary uppercase tracking-widest"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {reportes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20">
                      <EmptyState 
                        icon="bi-inbox text-gray-500 text-4xl" 
                        title="No hay reportes disponibles" 
                      />
                    </td>
                  </tr>
                ) : (
                  reportes.map((r) => (
                    <tr
                      key={r.ID}
                      className={`hover:bg-accent-yellow/5 transition-colors ${seleccionados.includes(r.ID) ? "bg-primary/5" : ""}`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={seleccionados.includes(r.ID)}
                          onChange={() => toggleSeleccion(r.ID)}
                          className="w-5 h-5 rounded accent-primary"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-black font-mono text-primary bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
                          {formatId(r.ID)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-text">
                            {r.rolReportante}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border-2 ${badgeTipo[r.Tipo] ?? "bg-border/20 text-text border-border/30"}`}
                        >
                          <i className={`${iconoTipo[r.Tipo] ?? "bi-file-text"} text-sm`}/>
                          {r.Tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-text/70">
                        {new Date(r.FechaHora).toLocaleString("es-ES", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border-2 ${badgeEstado[r.Estado] ?? "bg-border/20 text-text/50 border-border/30"}`}
                        >
                          {r.Estado}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setReporteVer(r)}
                            className="px-3 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-white rounded-lg transition-all border border-primary/20 hover:border-primary uppercase tracking-wide"
                          >
                            Ver
                          </button>
                          {r.Estado !== "Cerrado" && (
                            <>
                              <button
                                onClick={() => cambiarEstado(r.ID, "Resuelto")}
                                className="px-3 py-2 text-xs font-bold text-green-700 hover:bg-green-600 hover:text-white rounded-lg transition-all border border-green-200 hover:border-green-600 uppercase tracking-wide"
                              >
                                <i className="bi bi-check-lg" />
                              </button>
                              <button
                                onClick={() => cambiarEstado(r.ID, "Cerrado")}
                                className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all border border-red-200 hover:border-red-600 uppercase tracking-wide"
                              >
                                <i className="bi bi-x-lg" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-8 flex-wrap gap-4">
        {seleccionados.length > 0 ? (
          <div className="flex items-center gap-3 bg-white border-2 border-primary/30 rounded-xl px-5 py-3 shadow-lg">
            <span className="text-sm font-bold text-primary mr-2 uppercase tracking-wide">
              {seleccionados.length} seleccionados
            </span>
            <button
              onClick={() => marcarMasivo("Resuelto")}
              className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-all shadow-md uppercase tracking-wide"
            >
              <i className="bi bi-check-circle-fill mr-1" /> Resolver
            </button>
            <button
              onClick={() => marcarMasivo("En revisión")}
              className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-all shadow-md uppercase tracking-wide"
            >
              <i className="bi bi-eye-fill mr-1" /> Revisar
            </button>
            <button
              onClick={eliminarSeleccionados}
              className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-all shadow-md uppercase tracking-wide"
            >
              <i className="bi bi-trash3-fill mr-1" /> Eliminar
            </button>
          </div>
        ) : (
          <p className="text-sm font-bold text-text/60 uppercase tracking-wide pt-2">
            <i className="bi bi-database-fill pr-2" />
            Total: {total} registros
          </p>
        )}

        {totalPaginas > 1 && (
          <Pagination
            currentPage={pagina}
            totalPages={totalPaginas}
            onPageChange={setPagina}
          />
        )}
      </div>

      {reporteVer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setReporteVer(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl mx-4 border-2 border-primary/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                  <i className={`${iconoTipo[reporteVer.Tipo] ?? "bi-file-text"} text-primary text-2xl`} />
                </div>
                <div className="py-2">
                  <h2 className="text-2xl font-bold text-primary">
                    Detalle del reporte
                  </h2>
                  <p className="text-sm font-black font-mono text-text/60 uppercase tracking-wider">
                    {formatId(reporteVer.ID)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReporteVer(null)}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-text/40 hover:text-text hover:bg-border/10 transition-all"
              >
                <i className="bi bi-x-lg text-2xl" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-5 mb-6">
              <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
                <p className="text-xs font-black text-primary/60 uppercase tracking-widest pb-2">
                  Tipo de reporte
                </p>
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide border-2 ${badgeTipo[reporteVer.Tipo] ?? "bg-border/20 text-text border-border/30"}`}
                >
                  <i
                    className={`${iconoTipo[reporteVer.Tipo] ?? "bi-file-text"}`}
                  />{" "}
                  {reporteVer.Tipo}
                </span>
              </div>
              <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
                <p className="text-xs font-black text-primary/60 uppercase tracking-widest pb-2">
                  Estado actual
                </p>
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide border-2 ${badgeEstado[reporteVer.Estado] ?? "bg-border/20 text-text/50 border-border/30"}`}
                >
                  {reporteVer.Estado}
                </span>
              </div>
              <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
                <p className="text-xs font-black text-primary/60 uppercase tracking-widest pb-2">
                  Reportado por
                </p>
                <p className="text-sm font-bold text-text">
                  {reporteVer.nombreReportante ?? "-"}
                </p>
                <p className="text-xs font-medium text-text/60 uppercase tracking-wide pt-1">
                  {reporteVer.rolReportante}
                </p>
              </div>
              <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
                <p className="text-xs font-black text-primary/60 uppercase tracking-widest pb-2">
                  Fecha y hora
                </p>
                <p className="text-sm text-text">
                  {new Date(reporteVer.FechaHora).toLocaleString("es-ES", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs font-black text-primary/60 uppercase tracking-widest py-2">
                Descripción del reporte
              </p>
              <div className="bg-primary/5 rounded-xl p-5 border border-primary/20 min-h-35">
                <p className="text-text leading-relaxed text-sm font-medium">
                  {reporteVer.Descripcion ?? (
                    <span className="text-text/40 italic">
                      Sin descripción proporcionada.
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-8 pt-6 border-t-2 border-border/20">
              <Button onClick={() => setReporteVer(null)} variant="outline">
                Cerrar
              </Button>
              {reporteVer.Estado !== "Resuelto" &&
                reporteVer.Estado !== "Cerrado" && (
                  <Button
                    onClick={() => {
                      cambiarEstado(reporteVer.ID, "Resuelto");
                      setReporteVer(null);
                    }}
                    variant="success"
                  >
                    <i className="bi bi-check-circle-fill pr-2" />
                    Marcar Resuelto
                  </Button>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
