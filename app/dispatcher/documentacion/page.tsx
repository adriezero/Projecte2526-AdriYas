"use client";

import BarraLateral from "@componentes/dispatcher/BarraLateral";
import { useState, useEffect } from "react";
import { 
  Eye, Edit, Trash2, Download, FileText, Calendar, 
  HardDrive, Truck, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Documento } from '@interfaces/interfaces';
import {
  TIPOS_DOCUMENTO,
  filtrarDocumentos,
  formatearFecha,
  obtenerDocumentos,
  eliminarDocumento,
  actualizarDocumento,
  descargarDocumento
} from './logic';

const ITEMS_POR_PAGINA = 10;

export default function Documentacion() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [documentosFiltrados, setDocumentosFiltrados] = useState<Documento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  
  // Filtros
  const [tipoFiltro, setTipoFiltro] = useState('Todos');
  const [desdeFiltro, setDesdeFiltro] = useState('');
  const [hastaFiltro, setHastaFiltro] = useState('');
  
  // Modales
  const [modalDetalles, setModalDetalles] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState<Documento | null>(null);
  
  // Edición
  const [nombreEdit, setNombreEdit] = useState('');
  const [tipoEdit, setTipoEdit] = useState('');
  const [fechaEdit, setFechaEdit] = useState('');
  const [asociadoEdit, setAsociadoEdit] = useState('');

  useEffect(() => {
    cargarDocumentos();
  }, []);

  async function cargarDocumentos() {
    try {
      setCargando(true);
      const docs = await obtenerDocumentos();
      setDocumentos(docs);
      setDocumentosFiltrados(docs);
    } catch (error) {
      console.error('Error al cargar documentos:', error);
    } finally {
      setCargando(false);
    }
  }

  function handleAplicarFiltros() {
    const filtrados = filtrarDocumentos(documentos, tipoFiltro, desdeFiltro, hastaFiltro);
    setDocumentosFiltrados(filtrados);
    setPaginaActual(1);
  }

  function handleSeleccionar(id: number) {
    setSeleccionados(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }

  function handleSeleccionarTodos() {
    if (seleccionados.length === documentosPaginados.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(documentosPaginados.map(d => d.id));
    }
  }

  async function handleDescargarSeleccionados() {
    if (seleccionados.length === 0) {
      alert('No hay documentos seleccionados');
      return;
    }
    for (const id of seleccionados) {
      await descargarDocumento(id);
    }
  }

  async function handleEliminarSeleccionados() {
    if (seleccionados.length === 0) {
      alert('No hay documentos seleccionados');
      return;
    }
    if (confirm(`¿Eliminar ${seleccionados.length} documento(s)?`)) {
      try {
        for (const id of seleccionados) {
          await eliminarDocumento(id);
        }
        await cargarDocumentos();
        setSeleccionados([]);
      } catch (error) {
        console.error('Error al eliminar documentos:', error);
        alert('Error al eliminar algunos documentos');
      }
    }
  }

  function handleVerDetalles(doc: Documento) {
    setDocumentoSeleccionado(doc);
    setModalDetalles(true);
  }

  function handleAbrirEditar(doc: Documento) {
    setDocumentoSeleccionado(doc);
    setNombreEdit(doc.nombre);
    setTipoEdit(doc.tipo);
    setFechaEdit(typeof doc.fechaSubida === 'string' ? doc.fechaSubida : doc.fechaSubida.toISOString().split('T')[0]);
    setAsociadoEdit(doc.asociadoA);
    setModalEditar(true);
  }

  async function handleGuardarEdicion() {
    if (!documentoSeleccionado) return;
    try {
      await actualizarDocumento(documentoSeleccionado.id, {
        nombre: nombreEdit,
        tipo: tipoEdit,
        fechaSubida: fechaEdit,
        asociadoA: asociadoEdit
      });
      await cargarDocumentos();
      setModalEditar(false);
    } catch (error) {
      console.error('Error al editar documento:', error);
      alert('Error al editar documento');
    }
  }

  async function handleEliminar(id: number) {
    if (confirm('¿Eliminar este documento?')) {
      try {
        await eliminarDocumento(id);
        await cargarDocumentos();
      } catch (error) {
        console.error('Error al eliminar documento:', error);
        alert('Error al eliminar documento');
      }
    }
  }

  async function handleDescargar(doc: Documento) {
    try {
      await descargarDocumento(doc.id);
    } catch (error) {
      console.error('Error al descargar documento:', error);
      alert('Error al descargar documento');
    }
  }

  // Paginación
  const totalPaginas = Math.ceil(documentosFiltrados.length / ITEMS_POR_PAGINA);
  const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const fin = inicio + ITEMS_POR_PAGINA;
  const documentosPaginados = documentosFiltrados.slice(inicio, fin);

  return (
    <div className="min-h-screen bg-slate-50">
      <BarraLateral />

      {/* Modal Ver Detalles */}
      {modalDetalles && documentoSeleccionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setModalDetalles(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-800">Detalles del Documento</h2>
              <button onClick={() => setModalDetalles(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Nombre</label>
                <p className="text-slate-800 font-medium mt-1">{documentoSeleccionado.nombre}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Tipo</label>
                <p className="text-slate-800 font-medium mt-1">{documentoSeleccionado.tipo}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Fecha de Subida</label>
                <p className="text-slate-800 font-medium mt-1">{formatearFecha(documentoSeleccionado.fechaSubida)}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Asociado A</label>
                <p className="text-slate-800 font-medium mt-1">{documentoSeleccionado.asociadoA}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Tamaño</label>
                <p className="text-slate-800 font-medium mt-1">{documentoSeleccionado.tamano}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModalDetalles(false)}
                className="flex-1 px-4 py-2.5 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {modalEditar && documentoSeleccionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setModalEditar(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-800">Editar Documento</h2>
              <button onClick={() => setModalEditar(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                  <FileText size={14} /> Nombre del Documento
                </label>
                <input
                  type="text"
                  value={nombreEdit}
                  onChange={e => setNombreEdit(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                  Tipo
                </label>
                <select
                  value={tipoEdit}
                  onChange={e => setTipoEdit(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {TIPOS_DOCUMENTO.filter(t => t !== 'Todos').map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                  <Calendar size={14} /> Fecha
                </label>
                <input
                  type="date"
                  value={fechaEdit}
                  onChange={e => setFechaEdit(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                  Asociado A
                </label>
                <input
                  type="text"
                  value={asociadoEdit}
                  onChange={e => setAsociadoEdit(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModalEditar(false)}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardarEdicion}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
              >
                <Edit size={16} />
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 lg:p-8" style={{ marginLeft: '256px' }}>
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Gestión de Documentación</h1>
            <p className="text-slate-500 mt-1 text-sm">Administra todos los documentos del sistema</p>
          </div>

          {cargando ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="animate-[slide_1.5s_ease-in-out_infinite]">
                <Truck size={48} className="text-slate-600" />
              </div>
              <p className="text-slate-600 font-medium mt-4">Cargando documentos...</p>
              <style jsx>{`
                @keyframes slide {
                  0%, 100% { transform: translateX(-20px); }
                  50% { transform: translateX(20px); }
                }
              `}</style>
            </div>
          ) : (
            <>
              {/* Filtros */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Tipo</label>
                    <select
                      value={tipoFiltro}
                      onChange={e => setTipoFiltro(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {TIPOS_DOCUMENTO.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Desde</label>
                    <input
                      type="date"
                      value={desdeFiltro}
                      onChange={e => setDesdeFiltro(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Hasta</label>
                    <input
                      type="date"
                      value={hastaFiltro}
                      onChange={e => setHastaFiltro(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={handleAplicarFiltros}
                      className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                    >
                      Consultar
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 mt-4 pt-4 border-t border-slate-200">
                  <button
                    onClick={handleDescargarSeleccionados}
                    disabled={seleccionados.length === 0}
                    className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download size={16} />
                    Descargar Seleccionados ({seleccionados.length})
                  </button>
                  <button
                    onClick={handleEliminarSeleccionados}
                    disabled={seleccionados.length === 0}
                    className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={16} />
                    Eliminar Seleccionados ({seleccionados.length})
                  </button>
                </div>
              </div>

              {/* Tabla */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-5 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={seleccionados.length === documentosPaginados.length && documentosPaginados.length > 0}
                            onChange={handleSeleccionarTodos}
                            className="w-4 h-4 rounded border-slate-300"
                          />
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5"><FileText size={13} /> Nombre del Documento</span>
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5"><Calendar size={13} /> Fecha de Subida</span>
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Asociado A
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5"><HardDrive size={13} /> Tamaño</span>
                        </th>
                        <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {documentosPaginados.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-5 py-16 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <FileText size={36} className="text-slate-300" />
                              <p className="text-slate-700 font-semibold">No hay documentos</p>
                              <p className="text-sm text-slate-400">Los documentos aparecerán aquí</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        documentosPaginados.map(doc => (
                          <tr key={doc.id} className="hover:bg-slate-50">
                            <td className="px-5 py-4">
                              <input
                                type="checkbox"
                                checked={seleccionados.includes(doc.id)}
                                onChange={() => handleSeleccionar(doc.id)}
                                className="w-4 h-4 rounded border-slate-300"
                              />
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-sm font-medium text-slate-800">{doc.nombre}</span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-sm text-slate-600">{doc.tipo}</span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-sm text-slate-600">{formatearFecha(doc.fechaSubida)}</span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-sm text-slate-600">{doc.asociadoA}</span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-sm text-slate-600">{doc.tamano}</span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button onClick={() => handleVerDetalles(doc)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="Ver detalles">
                                  <Eye size={16} />
                                </button>
                                <button onClick={() => handleDescargar(doc)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="Descargar">
                                  <Download size={16} />
                                </button>
                                <button onClick={() => handleAbrirEditar(doc)} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg" title="Editar">
                                  <Edit size={16} />
                                </button>
                                <button onClick={() => handleEliminar(doc.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Eliminar">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Paginación */}
                {documentosFiltrados.length > 0 && (
                  <div className="flex items-center justify-between px-5 py-4 border-t border-slate-200">
                    <div className="text-sm text-slate-600">
                      Mostrando {inicio + 1}-{Math.min(fin, documentosFiltrados.length)} de {documentosFiltrados.length} documentos
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
                        disabled={paginaActual === 1}
                        className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="text-sm font-medium text-slate-700">
                        Página {paginaActual} de {totalPaginas}
                      </span>
                      <button
                        onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
                        disabled={paginaActual === totalPaginas}
                        className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
