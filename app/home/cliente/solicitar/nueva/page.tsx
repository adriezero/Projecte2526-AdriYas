'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Cliente } from '@interfaces/interfaces';
import { getClienteCompleto, enviarSolicitud } from '../logic';

export default function NuevaSolicitudPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [cliente, setCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      getClienteCompleto(session.user.id).then(setCliente);
    }
  }, [session]);

  const handleSolicitud = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    if (!cliente) { alert('Error: No se pudo obtener la información del cliente'); return; }
    const success = await enviarSolicitud({
      servicio: formData.get('servicio') as string,
      cliente: cliente.Nombre,
      email: cliente.Email || '',
      detalles: formData.get('detalles') as string,
      origen: formData.get('origen') as string,
      destino: formData.get('destino') as string,
      fechaServicio: formData.get('fechaServicio') as string,
    });
    if (success) {
      alert('✅ Solicitud enviada correctamente. El dispatcher la revisará pronto.');
      router.push('/home/cliente/solicitar');
    } else {
      alert('❌ Error al enviar la solicitud. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="max-w-lg w-full">
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-6">
          ← Volver a mis solicitudes
        </button>
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-3xl font-bold mb-8 text-black">Solicitar un Servicio</h2>
          <form onSubmit={handleSolicitud} className="space-y-6">
            <input
              type="text"
              name="servicio"
              placeholder="Nombre del servicio"
              className="w-full px-5 py-3 text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              required
            />
            <input
              type="text"
              name="cliente"
              value={cliente?.Nombre || ''}
              disabled
              className="w-full px-5 py-3 text-lg border border-gray-300 rounded-md bg-gray-100 text-black cursor-not-allowed"
            />
            <input
              type="email"
              name="email"
              value={cliente?.Email || ''}
              disabled
              className="w-full px-5 py-3 text-lg border border-gray-300 rounded-md bg-gray-100 text-black cursor-not-allowed"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="origen"
                placeholder="Origen *"
                className="w-full px-5 py-3 text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                required
              />
              <input
                type="text"
                name="destino"
                placeholder="Destino *"
                className="w-full px-5 py-3 text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                required
              />
            </div>
            <div>
              <label className="block text-base font-medium text-black mb-2">Fecha del servicio:</label>
              <input
                type="date"
                name="fechaServicio"
                className="w-full px-5 py-3 text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                required
              />
            </div>
            <div>
              <label className="block text-base font-medium text-black mb-2">Detalles del servicio:</label>
              <textarea
                name="detalles"
                placeholder="Indica los detalles..."
                rows={6}
                className="w-full px-5 py-3 text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                required
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 px-6 text-lg rounded-md hover:bg-blue-700 transition">
              Enviar solicitud
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
