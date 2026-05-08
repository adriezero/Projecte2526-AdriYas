"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const FIELDS = [
  { label: "Nombre completo", key: "Nombre" },
  { label: "Empresa", key: "NombreEmpresa" },
  { label: "Razón Social", key: "RazonSocial" },
  { label: "Teléfono", key: "Telf" },
];

function ModalCambioGmail({ onClose }: { onClose: () => void }) {
  const [descripcion, setDescripcion] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function enviar() {
    setEnviando(true);
    await fetch("/api/reportes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Tipo: "Incidencia", Descripcion: `Solicitud de cambio de Gmail: ${descripcion}` }),
    });
    setEnviando(false);
    setEnviado(true);
    setTimeout(onClose, 1500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl">
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-lg">✉️</div>
            <h2 className="text-lg font-bold text-gray-900">Solicitar cambio de Gmail</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-xl leading-none transition">&times;</button>
        </div>
        <div className="px-8 py-6 space-y-5">
          <div className="bg-amber-50 rounded-xl px-4 py-3 border border-amber-200">
            <p className="text-sm text-amber-700">⚠️ El Gmail está vinculado a tu cuenta. Para cambiarlo, un administrador debe gestionarlo manualmente.</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Nuevo Gmail y motivo</label>
            <textarea
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              rows={4}
              placeholder="Indica el nuevo Gmail que deseas usar y el motivo del cambio..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 resize-none bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          {enviado && <p className="text-sm text-green-600">✓ Incidencia enviada correctamente.</p>}
        </div>
        <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition">Cancelar</button>
          <button onClick={enviar} disabled={!descripcion || enviando || enviado} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50">
            {enviando ? "Enviando..." : "Enviar incidencia"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PerfilClientePage() {
  const { data: session } = useSession();
  const id = (session?.user as any)?.id;

  const [form, setForm] = useState({ Nombre: "", NombreEmpresa: "", RazonSocial: "", Telf: "", Gmail: "" });
  const [original, setOriginal] = useState({ Nombre: "", NombreEmpresa: "", RazonSocial: "", Telf: "", Gmail: "" });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [modalGmail, setModalGmail] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/clientes/${id}`)
      .then(r => r.json())
      .then(d => {
        const data = { Nombre: d.Nombre ?? "", NombreEmpresa: d.NombreEmpresa ?? "", RazonSocial: d.RazonSocial ?? "", Telf: d.Telf ?? "", Gmail: d.Gmail ?? session?.user?.email ?? "" };
        setForm(data);
        setOriginal(data);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const res = await fetch(`/api/clientes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      const updated = await res.json();
      const data = { Nombre: updated.Nombre ?? "", NombreEmpresa: updated.NombreEmpresa ?? "", RazonSocial: updated.RazonSocial ?? "", Telf: updated.Telf ?? "", Gmail: updated.Gmail ?? "" };
      setOriginal(data);
      setEditing(false);
      setMsg({ text: "Perfil actualizado correctamente.", ok: true });
    } else {
      setMsg({ text: "Error al guardar los cambios.", ok: false });
    }
  };

  const handleCancel = () => {
    setForm(original);
    setEditing(false);
    setMsg(null);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-gray-400 text-sm">Cargando...</div>
    </div>
  );

  const initials = form.Nombre ? form.Nombre.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() : "?";

  return (
    <div className="h-screen flex flex-col pt-16 bg-gray-100 overflow-hidden">
      {modalGmail && <ModalCambioGmail onClose={() => setModalGmail(false)} />}

      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar ── */}
        <aside className="w-80 shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">

          {/* Avatar */}
          <div className="flex flex-col items-center px-8 pt-14 pb-10 bg-gradient-to-b from-blue-600 to-blue-700">
            <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center text-white text-3xl font-bold mb-5 shadow-xl">
              {initials}
            </div>
            <p className="font-bold text-white text-xl text-center leading-tight">{form.Nombre || "—"}</p>
            <p className="text-blue-200 text-sm mt-1 text-center truncate w-full">{form.Gmail || session?.user?.email}</p>
            <span className="mt-4 inline-block bg-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full tracking-wide">Cliente</span>
          </div>

          {/* Info cards */}
          <div className="flex flex-col gap-1 px-4 py-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 mb-3">Resumen</p>

            {[
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />,
                label: "Nombre", value: form.Nombre,
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />,
                label: "Empresa", value: form.NombreEmpresa,
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />,
                label: "Razón Social", value: form.RazonSocial,
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />,
                label: "Teléfono", value: form.Telf,
              },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-medium text-gray-700 truncate">{value || "—"}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="flex-1 flex flex-col overflow-y-auto">

          {/* Page header */}
          <div className="bg-white border-b border-gray-200 px-12 py-7 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
                <p className="text-sm text-gray-500 mt-1">Gestiona tu información personal y de empresa.</p>
              </div>
              {!editing && (
                <button
                  type="button"
                  onClick={() => { setEditing(true); setMsg(null); }}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition shadow-sm shadow-blue-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                  </svg>
                  Editar perfil
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 px-12 py-8 flex flex-col gap-6">

            {/* Sección: Información personal */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 px-8 py-5 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Información personal</p>
                  <p className="text-xs text-gray-400">Datos de identificación y contacto</p>
                </div>
              </div>
              <div className="px-8 py-7 grid grid-cols-2 gap-x-8 gap-y-6">
                {FIELDS.map(({ label, key }) => (
                  <div key={key} className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-600">{label}</label>
                    {editing ? (
                      <input
                        className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
                        value={form[key as keyof typeof form]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      />
                    ) : (
                      <p className="px-4 py-3 text-sm text-gray-800 bg-gray-50 rounded-xl border border-gray-100">{form[key as keyof typeof form] || "—"}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sección: Acceso y seguridad */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 px-8 py-5 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Acceso y seguridad</p>
                  <p className="text-xs text-gray-400">Credenciales vinculadas a tu cuenta</p>
                </div>
              </div>
              <div className="px-8 py-7">
                <label className="text-sm font-medium text-gray-600 block mb-2">Gmail</label>
                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 gap-6">
                  <div className="flex items-center gap-3 min-w-0">
                    <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 truncate">{form.Gmail || "—"}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      <span className="text-xs text-amber-700 font-medium">Requiere incidencia para cambiar</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setModalGmail(true)}
                      className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-5 py-2 rounded-xl transition"
                    >
                      Solicitar cambio
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones al editar */}
            {editing && (
              <div className="flex items-center gap-4 pt-2">
                {msg && (
                  <p className={`text-sm ${msg.ok ? "text-green-600" : "text-red-500"}`}>{msg.text}</p>
                )}
                <div className="flex gap-3 ml-auto">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-white border border-gray-300 text-gray-700 rounded-xl px-6 py-2.5 text-sm font-medium hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 text-white rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition shadow-sm shadow-blue-200"
                  >
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </div>
            )}

            {!editing && msg && (
              <p className={`text-sm ${msg.ok ? "text-green-600" : "text-red-500"}`}>{msg.text}</p>
            )}

          </form>
        </main>
      </div>
    </div>
  );
}
