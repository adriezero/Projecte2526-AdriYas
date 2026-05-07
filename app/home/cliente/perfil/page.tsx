"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const FIELDS = [
  { label: "Nombre", key: "Nombre" },
  { label: "Empresa", key: "NombreEmpresa" },
  { label: "Razón Social", key: "RazonSocial" },
  { label: "Teléfono", key: "Telf" },
];

export default function PerfilClientePage() {
  const { data: session } = useSession();
  const id = (session?.user as any)?.id;

  const [form, setForm] = useState({ Nombre: "", NombreEmpresa: "", RazonSocial: "", Telf: "" });
  const [original, setOriginal] = useState({ Nombre: "", NombreEmpresa: "", RazonSocial: "", Telf: "" });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/clientes/${id}`)
      .then(r => r.json())
      .then(d => {
        const data = { Nombre: d.Nombre ?? "", NombreEmpresa: d.NombreEmpresa ?? "", RazonSocial: d.RazonSocial ?? "", Telf: d.Telf ?? "" };
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
      const data = { Nombre: updated.Nombre ?? "", NombreEmpresa: updated.NombreEmpresa ?? "", RazonSocial: updated.RazonSocial ?? "", Telf: updated.Telf ?? "" };
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
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row pt-16 sm:pt-20">
      {/* Panel izquierdo */}
      <div className="lg:w-80 bg-white border-r border-gray-200 flex flex-col items-center py-12 px-8 shrink-0">
        <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold mb-4">
          {initials}
        </div>
        <p className="font-semibold text-gray-900 text-lg text-center">{form.Nombre || "—"}</p>
        <p className="text-sm text-gray-500 mt-1 text-center">{session?.user?.email}</p>
        <span className="mt-3 inline-block bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">Cliente</span>

        <div className="mt-8 w-full space-y-3 text-sm text-gray-600">
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
            </svg>
            <span className="truncate">{form.NombreEmpresa || "—"}</span>
          </div>
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            <span>{form.Telf || "—"}</span>
          </div>
        </div>
      </div>

      {/* Panel derecho */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 px-6 sm:px-12 py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Mi Perfil</h1>
          <p className="text-sm text-gray-500 mb-8">Actualiza tu información personal y de empresa.</p>

          <form onSubmit={handleSubmit} className="max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {FIELDS.map(({ label, key }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">{label}</label>
                  {editing ? (
                    <input
                      className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      value={form[key as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    />
                  ) : (
                    <p className="px-3 py-2.5 text-sm text-gray-800 border border-transparent">{form[key as keyof typeof form] || "—"}</p>
                  )}
                </div>
              ))}

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="px-3 py-2.5 text-sm text-gray-400">{session?.user?.email ?? "—"}</p>
              </div>
            </div>

            {msg && (
              <p className={`text-sm mb-4 ${msg.ok ? "text-green-600" : "text-red-500"}`}>{msg.text}</p>
            )}

            {editing ? (
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-white border border-gray-300 text-gray-700 rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => { setEditing(true); setMsg(null); }}
                className="bg-white border border-gray-300 text-gray-700 rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-gray-50 transition"
              >
                Editar perfil
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
