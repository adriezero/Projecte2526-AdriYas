"use client";
import { useEffect, useState } from "react";
import { PageHeader, Spinner, EmptyState } from "@componentes/ui";

type Review = {
  id: number;
  name: string;
  comment: string | null;
  isPositive: boolean;
  date: string;
  moderado: boolean | null;
  route: string;
};

type Filtro = "todas" | "pendientes" | "aprobadas";

export default function ModerarResenasPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<Filtro>("pendientes");

  useEffect(() => {
    fetch("/api/admin/reviews")
      .then((r) => r.json())
      .then((data) => setReviews(data))
      .finally(() => setLoading(false));
  }, []);

  async function aprobar(id: number) {
    await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, moderado: true }),
    });
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, moderado: true } : r)));
  }

  async function rechazar(id: number) {
    await fetch("/api/admin/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  const filtradas =
    filtro === "pendientes"
      ? reviews.filter((r) => !r.moderado)
      : filtro === "aprobadas"
      ? reviews.filter((r) => r.moderado)
      : reviews;

  const pendientesCount = reviews.filter((r) => !r.moderado).length;
  const aprobadasCount = reviews.filter((r) => r.moderado).length;

  return (
    <div className="bg-bg min-h-screen p-10" style={{ marginLeft: "256px" }}>
      <PageHeader
        title="Moderación de reseñas"
        subtitle="Aprueba o rechaza las valoraciones de los clientes antes de publicarlas"
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 pb-8">
        {[
          { label: "Total", value: reviews.length, icon: "bi-chat-square-text-fill", color: "bg-primary" },
          { label: "Pendientes", value: pendientesCount, icon: "bi-hourglass-split", color: "bg-accent-orange" },
          { label: "Aprobadas", value: aprobadasCount, icon: "bi-check-circle-fill", color: "bg-green-600" },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="bg-white rounded-2xl shadow border border-border/20 p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
              <i className={`bi ${icon} text-white text-xl`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">{value}</p>
              <p className="text-xs text-text/60 uppercase tracking-wide font-semibold">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex gap-2 pb-5 mb-6">
        {(["pendientes", "aprobadas", "todas"] as Filtro[]).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition capitalize ${
              filtro === f
                ? "bg-primary text-white border-primary"
                : "bg-white text-text border-border/30 hover:border-primary/50"
            }`}
          >
            {f === "pendientes" ? "Pendientes" : f === "aprobadas" ? "Aprobadas" : "Todas"}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="bg-white rounded-2xl shadow-xl border border-border/20 overflow-hidden">
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <i className="bi bi-star-fill text-white text-xl" />
            <h2 className="text-white font-bold text-lg">Reseñas de clientes</h2>
          </div>
          <span className="bg-white/20 px-4 py-1.5 rounded-lg text-white text-sm font-bold">
            {filtradas.length} reseñas
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner size="lg" text="Cargando reseñas..." />
          </div>
        ) : filtradas.length === 0 ? (
          <div className="py-20">
            <EmptyState icon="bi-chat-square-text text-gray-400 text-4xl" title="No hay reseñas en esta categoría" />
          </div>
        ) : (
          <div className="divide-y divide-border/20">
            {filtradas.map((r) => (
              <div key={r.id} className="px-6 py-5 flex items-start gap-5 hover:bg-primary/5 transition">
                {/* Avatar */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                    r.isPositive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {r.name.slice(0, 2).toUpperCase()}
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span className="font-bold text-text text-sm">{r.name}</span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                        r.isPositive
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      <i className={`bi ${r.isPositive ? "bi-hand-thumbs-up-fill" : "bi-hand-thumbs-down-fill"} mr-1`} />
                      {r.isPositive ? "Positiva" : "Negativa"}
                    </span>
                    {r.moderado ? (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                        <i className="bi bi-check-circle-fill mr-1" />Aprobada
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
                        <i className="bi bi-hourglass-split mr-1" />Pendiente
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text/75 italic mb-1">&ldquo;{r.comment}&rdquo;</p>
                  <div className="flex items-center gap-4 text-xs text-text/50">
                    <span><i className="bi bi-geo-alt mr-1" />{r.route}</span>
                    <span>
                      <i className="bi bi-calendar3 mr-1" />
                      {new Date(r.date).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2 shrink-0">
                  {!r.moderado && (
                    <button
                      onClick={() => aprobar(r.id)}
                      className="px-3 py-2 text-xs font-bold text-green-700 hover:bg-green-600 hover:text-white rounded-lg transition border border-green-200 hover:border-green-600 uppercase tracking-wide"
                    >
                      <i className="bi bi-check-lg mr-1" />Aprobar
                    </button>
                  )}
                  {r.moderado && (
                    <button
                      onClick={() => aprobar(r.id)}
                      disabled
                      className="px-3 py-2 text-xs font-bold text-green-700 rounded-lg border border-green-200 opacity-40 uppercase tracking-wide cursor-default"
                    >
                      <i className="bi bi-check-lg mr-1" />Aprobada
                    </button>
                  )}
                  <button
                    onClick={() => rechazar(r.id)}
                    className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition border border-red-200 hover:border-red-600 uppercase tracking-wide"
                  >
                    <i className="bi bi-trash3 mr-1" />Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
