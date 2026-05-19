"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Reseña } from "@interfaces/interfaces";

export default function SobreNosotros() {
  const t  = useTranslations("about");
  const tr = useTranslations("reviews");

  const [reseñas, setReseñas]          = useState<Reseña[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [filtro, setFiltro]            = useState("todas");
  const [busqueda, setBusqueda]        = useState("");
  const reseñasPorPagina               = 4;

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar reseñas");
        return res.json();
      })
      .then((data) => setReseñas(data))
      .catch((err) => { console.error(err); setReseñas([]); });
  }, []);

  const positivas = reseñas.filter((r) => r.isPositive).length;
  const totales   = reseñas.length;

  let reseñasFiltradas = reseñas;
  if (filtro === "positivas") {
    reseñasFiltradas = reseñas.filter((r) => r.isPositive);
  } else if (filtro === "recientes") {
    reseñasFiltradas = [...reseñas].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } else if (filtro === "negativas") {
    reseñasFiltradas = reseñas.filter((r) => !r.isPositive);
  }

  if (busqueda) {
    reseñasFiltradas = reseñasFiltradas.filter(
      (r) =>
        r.comment.toLowerCase().includes(busqueda.toLowerCase()) ||
        r.name.toLowerCase().includes(busqueda.toLowerCase())
    );
  }

  const totalPaginas     = Math.ceil(reseñasFiltradas.length / reseñasPorPagina);
  const indiceInicio     = (paginaActual - 1) * reseñasPorPagina;
  const reseñasPaginadas = reseñasFiltradas.slice(indiceInicio, indiceInicio + reseñasPorPagina);

  const filtros = [
    { valor: "todas",     label: tr("all") },
    { valor: "recientes", label: tr("recent") },
    { valor: "positivas", label: tr("positive") },
    { valor: "negativas", label: tr("negative") },
  ];

  return (
    <>
      {/* ══════════════════════════════════════
          SECCIÓN 1 — INFORMACIÓN / HISTORIA
      ══════════════════════════════════════ */}
      <section className="bg-primary py-28 px-4 sm:px-8 flex flex-col items-center">

        {/* Encabezado centrado */}
        <div className="text-center w-full max-w-2xl mx-auto mb-16 space-y-6">
          <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            {t("title")}
          </h1>
          <p className="text-sm sm:text-base text-white/60 leading-relaxed">
            {t("subtitle")}
          </p>
          <div className="mx-auto w-10 h-0.75 bg-accent-orange rounded-full" />
        </div>

        {/* Historia + imagen */}
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-xl">

          {/* Panel texto */}
          <div className="bg-white px-12 py-16 flex flex-col justify-center">
            <h3 className="text-xl font-semibold text-primary mb-3">
              {t("historyTitle")}
            </h3>
            <div className="w-8 h-0.75 bg-accent-orange rounded-full mb-8" />
            <div className="space-y-5 text-sm text-text/80 leading-relaxed">
              <p>{t("historyText1")}</p>
              <p>{t("historyText2")}</p>
              <p>{t("historyText3")}</p>
            </div>
          </div>

          {/* Panel imagen */}
          <div
            className="relative min-h-80 md:min-h-0
                       bg-[url('/img/camionFamilia.jpg')] bg-cover bg-center"
          >
            <div className="absolute inset-x-0 bottom-0 h-24
                            bg-linear-to-t from-primary/70 to-transparent" />
          </div>
        </div>

        {/* Estadísticas */}
        <div className="w-full max-w-5xl mx-auto mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { num: "30+",  label: t("statYears") },
            { num: "80",   label: t("statTeam") },
            { num: "12k+", label: t("statShipments") },
          ].map(({ num, label }) => (
            <div
              key={label}
              className="bg-white/8 border border-white/[0.14] rounded-xl
                         py-7 px-4 text-center"
            >
              <span className="block text-3xl font-semibold text-accent-yellow">{num}</span>
              <span className="block text-xs text-white/55 mt-2">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECCIÓN 2 — RESEÑAS
      ══════════════════════════════════════ */}
      <section className="bg-bg py-24 px-4 sm:px-8 w-full flex flex-col items-center">
        <div className="w-full max-w-5xl mx-auto space-y-16">

          {/* Encabezado centrado */}
          <div className="flex flex-col items-center text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-semibold text-primary tracking-tight">
              {tr("title")}
            </h2>
            <p className="text-text/65 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              {tr("subtitle")}
            </p>

            {/* Pills de puntuación */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <span className="inline-flex items-center gap-2 bg-white border border-border
                               text-text text-sm font-medium px-4 py-2 rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                {positivas} {tr("positive")}
              </span>
              <span className="text-border">·</span>
              <span className="inline-flex items-center gap-2 bg-white border border-border
                               text-text text-sm font-medium px-4 py-2 rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                {totales - positivas} {tr("negative")}
              </span>
            </div>
          </div>

          {/* Controles: filtros + búsqueda */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-center">
            <div className="flex flex-wrap gap-3 justify-center">
              {filtros.map((f) => (
                <button
                  key={f.valor}
                  onClick={() => { setFiltro(f.valor); setPaginaActual(1); }}
                  className={`
                    px-5 py-2.5 text-sm font-medium rounded-xl border transition duration-150
                    ${filtro === f.valor
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-white text-text border-border hover:border-accent-orange hover:text-accent-orange"
                    }
                  `}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2
                            text-border text-sm pointer-events-none" />
              <input
                type="text"
                placeholder={tr("search")}
                value={busqueda}
                onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
                className="w-full pl-9 pr-4 py-2.5 text-sm text-text
                           bg-white border border-border rounded-xl shadow-sm
                           placeholder-border transition duration-150
                           hover:border-primary
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Grid de cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {reseñasPaginadas.map((r) => (
              <div
                key={r.id}
                className="bg-white border border-border rounded-2xl p-8
                           transition duration-200
                           hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(31,78,121,0.10)]"
              >
                {/* Barra de acento */}
                <div
                  className={`h-0.75 w-8 rounded-full mb-6
                    ${r.isPositive ? "bg-green-500" : "bg-red-400"}`}
                />

                {/* Cabecera */}
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center
                                text-sm font-semibold shrink-0
                                ${r.isPositive
                                  ? "bg-[#E1F5EE] text-[#0F6E56]"
                                  : "bg-[#FCEBEB] text-[#A32D2D]"}`}
                  >
                    {r.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text truncate">{r.name}</p>
                    {r.route && (
                      <p className="text-xs text-border truncate mt-1">{r.route}</p>
                    )}
                  </div>

                  <span
                    className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1
                      ${r.isPositive
                        ? "bg-[#E1F5EE] text-[#0F6E56]"
                        : "bg-[#FCEBEB] text-[#A32D2D]"}`}
                  >
                    <i className={r.isPositive ? "bi bi-hand-thumbs-up-fill" : "bi bi-hand-thumbs-down-fill"} />
                    {r.isPositive ? "Positiva" : "Negativa"}
                  </span>
                </div>

                <p className="text-sm text-text/80 leading-relaxed">
                  &ldquo;{r.comment}&rdquo;
                </p>
                <p className="text-xs text-border mt-5">
                  {new Date(r.date).toLocaleDateString("es-ES", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="flex justify-center gap-3 flex-wrap pb-4">
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setPaginaActual(num)}
                  className={`w-10 h-10 rounded-xl text-sm font-medium border transition duration-150
                    ${paginaActual === num
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-white text-text border-border hover:border-accent-orange hover:text-accent-orange"
                    }`}
                >
                  {num}
                </button>
              ))}
            </div>
          )}

        </div>
      </section>
    </>
  );
}
