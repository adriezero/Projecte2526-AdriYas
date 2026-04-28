'use client';

import { useState, useEffect } from 'react';
import { Cliente, Informe } from '@interfaces/interfaces';
import { getClientes, getInformesPorEmpresa, enviarSolicitud, generarCSV, generarPDF } from './logic';

export default function SolicitarPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [informes, setInformes] = useState<Informe[]>([]);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState('');
  const [formato, setFormato] = useState('PDF');

  useEffect(() => {
    const fetchClientes = async () => {
      const data = await getClientes();
      setClientes(data);
    };
    fetchClientes();
  }, []);

  useEffect(() => {
    const fetchInformes = async () => {
      if (fechaDesde && fechaHasta && empresaSeleccionada) {
        const data = await getInformesPorEmpresa(empresaSeleccionada);
        setInformes(data);
      }
    };
    fetchInformes();
  }, [fechaDesde, fechaHasta, empresaSeleccionada]);

  const handleSolicitud = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const success = await enviarSolicitud({
      servicio: formData.get('servicio') as string,
      cliente: formData.get('cliente') as string,
      email: formData.get('email') as string,
      detalles: formData.get('detalles') as string,
    });

    if (success) {
      alert('Solicitud enviada correctamente');
      e.currentTarget.reset();
    }
  };

  const handleDescargar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (informes.length === 0) {
      alert('No hay informes disponibles para descargar.');
      return;
    }

    if (formato === 'CSV') {
      generarCSV(informes, empresaSeleccionada, fechaDesde, fechaHasta);
    } else {
      const empresaNombre = clientes.find(c => c.ID.toString() === empresaSeleccionada)?.NombreEmpresa || 'Empresa';
      await generarPDF(informes, empresaNombre, empresaSeleccionada, fechaDesde, fechaHasta);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="max-w-350 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        
        {/* Formulario 1: Solicitar un Servicio */}
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
              placeholder="Nombre del cliente"
              className="w-full px-5 py-3 text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email de contacto"
              className="w-full px-5 py-3 text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              required
            />
            <div>
              <label className="block text-base font-medium text-black mb-2">
                Detalles del servicio:
              </label>
              <textarea
                name="detalles"
                placeholder="Indica los detalles..."
                rows={6}
                className="w-full px-5 py-3 text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 text-lg rounded-md hover:bg-blue-700 transition"
            >
              Enviar solicitud
            </button>
          </form>
        </div>

        {/* Formulario 2: Descargar Informe */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-3xl font-bold mb-8 text-black">Descargar informe</h2>
          <form onSubmit={handleDescargar} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-medium text-black mb-2">
                  Desde
                </label>
                <input
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  className="w-full px-5 py-3 text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-base font-medium text-black mb-2">
                  Hasta
                </label>
                <input
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  className="w-full px-5 py-3 text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-base font-medium text-black mb-2">
                Seleccionar empresa
              </label>
              <select
                value={empresaSeleccionada}
                onChange={(e) => setEmpresaSeleccionada(e.target.value)}
                className="w-full px-5 py-3 text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                required
              >
                <option value="">Selecciona una empresa</option>
                {clientes.map((cliente) => (
                  <option key={cliente.ID} value={cliente.ID}>
                    {cliente.NombreEmpresa}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-black">Informes disponibles:</h3>
              <div className="bg-gray-50 p-5 rounded-md min-h-37.5">
                {informes.length > 0 ? (
                  <ul className="space-y-2">
                    {informes.map((informe) => (
                      <li key={informe.ID} className="text-black text-base">
                        • Informe - {new Date(informe.FechaSubida).toLocaleDateString('es-ES', { 
                          day: '2-digit', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No hay informes disponibles</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-base font-medium text-black mb-2">
                Formato de descarga:
              </label>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="formato"
                    id="pdf"
                    value="PDF"
                    checked={formato === 'PDF'}
                    onChange={(e) => setFormato(e.target.value)}
                    className="cursor-pointer"
                  />
                  <label htmlFor="pdf" className="text-black text-base cursor-pointer">
                    PDF
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="formato"
                    id="csv"
                    value="CSV"
                    checked={formato === 'CSV'}
                    onChange={(e) => setFormato(e.target.value)}
                    className="cursor-pointer"
                  />
                  <label htmlFor="csv" className="text-black text-base cursor-pointer">
                    CSV
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 px-6 text-lg rounded-md hover:bg-green-700 transition"
            >
              Descargar informe
            </button>
          </form>
        </div>
        </div>
      </div>
    </div>
  );
}
