"use client";

import { useState } from "react";
import BarraLateral from "@componentes/camionero/BarraLateral";

const rutas = [
  { id: "R-00123", fecha: "2023-10-26", origen: "Madrid", destino: "Barcelona", distancia: 620, estado: "Completada" },
  { id: "R-00122", fecha: "2023-10-25", origen: "Valencia", destino: "Sevilla", distancia: 660, estado: "Completada" },
  { id: "R-00121", fecha: "2023-10-24", origen: "Bilbao", destino: "Zaragoza", distancia: 300, estado: "Completada" },
  { id: "R-00120", fecha: "2023-10-23", origen: "Málaga", destino: "Granada", distancia: 130, estado: "Completada" },
  { id: "R-00119", fecha: "2023-10-22", origen: "Barcelona", destino: "Valencia", distancia: 350, estado: "Completada" },
  { id: "R-00118", fecha: "2023-10-21", origen: "Sevilla", destino: "Madrid", distancia: 530, estado: "Completada" },
  { id: "R-00117", fecha: "2023-10-20", origen: "Zaragoza", destino: "Barcelona", distancia: 300, estado: "Completada" },
];

const detalles: Record<string, { fecha: string; origen: string; destino: string; distancia: string; duracion: string; carga: string; estado: string; incidencias: string }> = {
  "R-00123": { fecha: "2023-10-26", origen: "Madrid, España", destino: "Barcelona, España", distancia: "620 km", duracion: "6h 30min", carga: "Electrónica (20 palets)", estado: "Completada", incidencias: "Ninguna" },
  "R-00122": { fecha: "2023-10-25", origen: "Valencia, España", destino: "Sevilla, España", distancia: "660 km", duracion: "7h 00min", carga: "Alimentación (15 palets)", estado: "Completada", incidencias: "Ninguna" },
};

const documentosPorRuta: Record<string, { nombre: string; tipo: "pdf" | "img" }[]> = {
  "R-00123": [
    { nombre: "Albarán_R00123.pdf", tipo: "pdf" },
    { nombre: "Factura_R00123.pdf", tipo: "pdf" },
    { nombre: "Comprobante_Entrega_R00123.jpg", tipo: "img" },
    { nombre: "Parte_Incidencia_R00123.pdf", tipo: "pdf" },
  ],
};

const filtros = ["Hoy", "Esta Semana", "Este Mes", "Últimos 3 Meses", "Personalizado"];
const POR_PAGINA = 7;

export default function Rutas() {
  const [filtroActivo, setFiltroActivo] = useState("Esta Semana");
  const [rutaSeleccionada, setRutaSeleccionada] = useState("R-00123");
  const [pagina, setPagina] = useState(1);

  const totalPaginas = Math.ceil(rutas.length / POR_PAGINA);
  const rutasPagina = rutas.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);
  const detalle = detalles[rutaSeleccionada];
  const docs = documentosPorRuta[rutaSeleccionada] ?? [];

  return (
   <div className="bg-gray-50 p-8" style={{ marginLeft: '300px' }}>
      <div className="max-w-full">

        {/* Título de la página */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Rutas</h1>
        </div>

        <div className="flex gap-8">
          {/* Tabla */}
          <div className="flex-1 bg-white rounded-xl shadow p-6">
            {/* Filtros */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {filtros.map((f) => (
                <button
                  key={f}
                  onClick={() => setFiltroActivo(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
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
            </div>

            {/* Tabla */}
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-3 font-medium">ID Ruta</th>
                  <th className="pb-3 font-medium">Fecha</th>
                  <th className="pb-3 font-medium">Origen</th>
                  <th className="pb-3 font-medium">Destino</th>
                  <th className="pb-3 font-medium">Distancia (km)</th>
                  <th className="pb-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {rutasPagina.map((r) => {
                  const activa = r.id === rutaSeleccionada;
                  return (
                    <tr
                      key={r.id}
                      onClick={() => setRutaSeleccionada(r.id)}
                      className={`border-b cursor-pointer transition ${activa ? "bg-blue-50" : "hover:bg-gray-50"}`}
                    >
                      <td className={`py-3 font-medium ${activa ? "text-blue-600" : "text-gray-700"}`}>{r.id}</td>
                      <td className={`py-3 ${activa ? "text-blue-600" : "text-gray-600"}`}>{r.fecha}</td>
                      <td className={`py-3 ${activa ? "text-blue-600" : "text-gray-600"}`}>{r.origen}</td>
                      <td className={`py-3 ${activa ? "text-blue-600" : "text-gray-600"}`}>{r.destino}</td>
                      <td className="py-3 text-gray-600">{r.distancia}</td>
                      <td className={`py-3 ${activa ? "text-blue-600" : "text-gray-600"}`}>{r.estado}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Paginación */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                disabled={pagina === 1}
                className="px-3 py-1 rounded border text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40"
              >
                Anterior
              </button>
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  onClick={() => setPagina(n)}
                  className={`px-3 py-1 rounded border text-sm transition ${pagina === n ? "bg-blue-600 text-white border-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  {n}
                </button>
              ))}
              <span className="text-gray-400 text-sm">...</span>
              <button onClick={() => setPagina(10)} className="px-3 py-1 rounded border text-sm text-gray-600 hover:bg-gray-100">10</button>
              <button
                onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                className="px-3 py-1 rounded border text-sm text-gray-600 hover:bg-gray-100"
              >
                Siguiente
              </button>
            </div>
          </div>

          {/* Panel de detalles */}
          <div className="w-80 bg-white rounded-xl shadow p-6 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-gray-800">Detalles de Ruta: {rutaSeleccionada}</h2>

            {detalle ? (
              <div className="text-sm text-gray-700 space-y-1">
                <p><span className="font-medium">Fecha:</span> {detalle.fecha}</p>
                <p><span className="font-medium">Origen:</span> {detalle.origen}</p>
                <p><span className="font-medium">Destino:</span> {detalle.destino}</p>
                <p><span className="font-medium">Distancia:</span> {detalle.distancia}</p>
                <p><span className="font-medium">Duración:</span> {detalle.duracion}</p>
                <p><span className="font-medium">Carga:</span> {detalle.carga}</p>
                <p><span className="font-medium">Estado:</span> {detalle.estado}</p>
                <p><span className="font-medium">Incidencias:</span> {detalle.incidencias}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Selecciona una ruta para ver los detalles.</p>
            )}

            {/* Documentos */}
            {docs.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Documentos de la Ruta</h3>
                <div className="space-y-2">
                  {docs.map((doc) => (
                    <div key={doc.nombre} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`text-lg ${doc.tipo === "pdf" ? "text-red-500" : "text-green-500"}`}>
                          {doc.tipo === "pdf" ? "📄" : "🖼️"}
                        </span>
                        <span className="text-xs text-gray-600 truncate">{doc.nombre}</span>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">Ver</button>
                        <button className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">Descargar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button className="mt-auto w-full py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition">
              Reportar Incidencia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
