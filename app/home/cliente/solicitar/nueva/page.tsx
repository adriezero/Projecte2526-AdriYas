'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Cliente } from '@interfaces/interfaces';
import { getClienteCompleto, enviarSolicitud } from '../logic';

function Modal({ ok, onClose }: { ok: boolean; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center gap-4">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${ok ? 'bg-green-100' : 'bg-red-100'}`}>
          {ok ? <i className="bi bi-check-circle-fill text-green-600 text-3xl"></i> : <i className="bi bi-x-circle-fill text-red-600 text-3xl"></i>}
        </div>
        <p className="text-text font-semibold text-center">
          {ok
            ? 'Solicitud enviada correctamente. El dispatcher la revisará pronto.'
            : 'Error al enviar la solicitud. Por favor, inténtalo de nuevo.'}
        </p>
        <button
          onClick={onClose}
          className={`mt-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition ${
            ok ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {ok ? 'Ver mis solicitudes' : 'Cerrar'}
        </button>
      </div>
    </div>
  );
}

export default function NuevaSolicitudPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [modal, setModal] = useState<{ show: boolean; ok: boolean }>({ show: false, ok: false });

  useEffect(() => {
    if (session?.user?.id) {
      getClienteCompleto(session.user.id).then(setCliente);
    }
  }, [session]);

  const handleSolicitud = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    if (!cliente) return;
    const success = await enviarSolicitud({
      servicio: formData.get('servicio') as string,
      cliente: cliente.Nombre,
      email: cliente.Email || '',
      detalles: formData.get('detalles') as string,
      origen: formData.get('origen') as string,
      destino: formData.get('destino') as string,
      fechaServicio: formData.get('fechaServicio') as string,
      fechaFin: formData.get('fechaFin') as string,
    });
    setModal({ show: true, ok: success });
    if (success) form.reset();
  };

  return (
    <div className="min-h-screen bg-bg p-8 flex items-center justify-center">
      {modal.show && (
        <Modal
          ok={modal.ok}
          onClose={() => {
            setModal({ show: false, ok: false });
            if (modal.ok) router.push('/home/cliente/solicitar');
          }}
        />
      )}
      <div className="max-w-lg w-full">
        <button onClick={() => router.back()} className="text-sm text-border hover:text-text flex items-center gap-1 mb-6">
          ← Volver a mis solicitudes
        </button>
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-3xl font-bold mb-8 text-text">Solicitar un Servicio</h2>
          <form onSubmit={handleSolicitud} className="space-y-6">
            <input
              type="text"
              name="servicio"
              placeholder="Nombre del servicio"
              className="w-full px-5 py-3 text-lg border border-border/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-text bg-white transition"
              required
            />
            <input
              type="text"
              name="cliente"
              value={cliente?.Nombre || ''}
              disabled
              className="w-full px-5 py-3 text-lg border border-border/30 rounded-xl bg-bg text-text cursor-not-allowed"
            />
            <input
              type="email"
              name="email"
              value={cliente?.Email || ''}
              disabled
              className="w-full px-5 py-3 text-lg border border-border/30 rounded-xl bg-bg text-text cursor-not-allowed"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="origen"
                placeholder="Origen *"
                className="w-full px-5 py-3 text-lg border border-border/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-text bg-white transition"
                required
              />
              <input
                type="text"
                name="destino"
                placeholder="Destino *"
                className="w-full px-5 py-3 text-lg border border-border/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-text bg-white transition"
                required
              />
            </div>
            <div>
              <label className="block text-base font-medium text-text mb-2">Rango de fechas del servicio:</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-border mb-1">Fecha inicio:</label>
                  <input
                    type="date"
                    name="fechaServicio"
                    className="w-full px-5 py-3 text-lg border border-border/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-text bg-white transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-border mb-1">Fecha fin (opcional):</label>
                  <input
                    type="date"
                    name="fechaFin"
                    className="w-full px-5 py-3 text-lg border border-border/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-text bg-white transition"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-base font-medium text-text mb-2">Detalles del servicio:</label>
              <textarea
                name="detalles"
                placeholder="Indica los detalles..."
                rows={6}
                className="w-full px-5 py-3 text-lg border border-border/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-text bg-white transition resize-none"
                required
              />
            </div>
            <button type="submit" className="w-full bg-primary text-white py-3 px-6 text-lg rounded-xl hover:bg-[#163a5f] transition shadow-sm">
              Enviar solicitud
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
