"use client";

import BarraLateral from "@componentes/camionero/BarraLateral";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FileText, Upload, Eye, CheckCircle2, Clock, AlertCircle, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { EstadoDoc, DocumentoCamionero, Documento } from '@interfaces/interfaces';

export default function Documentos() {
  const { data: session } = useSession();
  const [documentos, setDocumentos] = useState<DocumentoCamionero[]>([
    { tipo: 'Licencia', estado: 'falta' },
    { tipo: 'DNI', estado: 'falta' },
    { tipo: 'Permiso', estado: 'falta' },
    { tipo: 'Antecedentes', estado: 'falta' },
  ]);
  const [detallesAbiertos, setDetallesAbiertos] = useState(false);
  const [subiendo, setSubiendo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  useEffect(() => {
    cargarDocumentos();
  }, []);

  async function cargarDocumentos() {
    try {
      const res = await fetch('/api/documentos');
      const docs = await res.json();
      
      const docsMap: Record<string, DocumentoCamionero> = {
        'Licencia': { tipo: 'Licencia', estado: 'falta' },
        'DNI': { tipo: 'DNI', estado: 'falta' },
        'Permiso': { tipo: 'Permiso', estado: 'falta' },
        'Antecedentes': { tipo: 'Antecedentes', estado: 'falta' },
      };

      if (Array.isArray(docs)) {
        docs.forEach((doc: Documento) => {
          // Mapear tipos del enum a nuestros tipos internos
          if (doc.tipo === 'Licencia' && docsMap['Licencia']) {
            docsMap['Licencia'] = {
              tipo: 'Licencia',
              estado: doc.estado === 'Aceptado' ? 'verificado' : doc.estado === 'Rechazado' ? 'rechazado' : 'pendiente',
              archivo: doc.rutaArchivo,
              fechaSubida: new Date(doc.fechaSubida),
              id: doc.id
            };
          } else if (doc.tipo === 'Certificado') {
            // Certificado puede ser DNI o Antecedentes, verificamos por descripción
            if (doc.descripcion?.includes('DNI') || doc.descripcion?.includes('Identificador') || doc.descripcion?.includes('identificación')) {
              docsMap['DNI'] = {
                tipo: 'DNI',
                estado: doc.estado === 'Aceptado' ? 'verificado' : doc.estado === 'Rechazado' ? 'rechazado' : 'pendiente',
                archivo: doc.rutaArchivo,
                fechaSubida: new Date(doc.fechaSubida),
                id: doc.id
              };
            } else if (doc.descripcion?.includes('Antecedentes')) {
              docsMap['Antecedentes'] = {
                tipo: 'Antecedentes',
                estado: doc.estado === 'Aceptado' ? 'verificado' : doc.estado === 'Rechazado' ? 'rechazado' : 'pendiente',
                archivo: doc.rutaArchivo,
                fechaSubida: new Date(doc.fechaSubida),
                id: doc.id
              };
            }
          } else if (doc.tipo === 'Permiso' && docsMap['Permiso']) {
            docsMap['Permiso'] = {
              tipo: 'Permiso',
              estado: doc.estado === 'Aceptado' ? 'verificado' : doc.estado === 'Rechazado' ? 'rechazado' : 'pendiente',
              archivo: doc.rutaArchivo,
              fechaSubida: new Date(doc.fechaSubida),
              id: doc.id
            };
          }
        });
      }

      setDocumentos(Object.values(docsMap));
    } catch (error) {
      console.error('Error al cargar documentos:', error);
    }
  }

  async function subirDocumento(tipo: string, file: File) {
    setSubiendo(tipo);
    setError(null);
    setExito(null);
    
    const tipoEnum: Record<string, string> = {
      'Licencia': 'Licencia',
      'DNI': 'Certificado',
      'Permiso': 'Permiso',
      'Antecedentes': 'Certificado'
    };
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tipo', tipoEnum[tipo] || 'Otro');
      formData.append('asociadoA', `Conductor: ${session?.user?.name || 'Usuario'}`);
      formData.append('descripcion', `${obtenerNombreCompleto(tipo)}`);
      formData.append('subidoPor', session?.user?.id || '0');
      formData.append('rolSubidor', 'Camionero');

      const res = await fetch('/api/documentos/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        setExito(`Documento "${obtenerNombreCompleto(tipo)}" subido correctamente`);
        await cargarDocumentos();
        setTimeout(() => setExito(null), 5000);
      } else {
        const errorMsg = data.error || data.details?.message || 'Error al subir el documento';
        setError(errorMsg);
      }
    } catch (error) {
      setError(`Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setSubiendo(null);
    }
  }

  async function eliminarDocumento(tipo: string, docId?: number) {
    if (!docId) return;
    
    if (!confirm(`¿Estás seguro de eliminar el documento "${obtenerNombreCompleto(tipo)}"? Podrás subir uno nuevo después.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/documentos/${docId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setExito(`Documento "${obtenerNombreCompleto(tipo)}" eliminado correctamente`);
        await cargarDocumentos();
        setTimeout(() => setExito(null), 5000);
      } else {
        setError('Error al eliminar el documento');
      }
    } catch (error) {
      setError(`Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  function obtenerEstadoTexto(estado: EstadoDoc) {
    switch (estado) {
      case 'verificado': return 'Subido y verificado';
      case 'pendiente': return 'Pendiente de revisión';
      case 'rechazado': return 'Rechazado';
      case 'falta': return 'Falta subir';
    }
  }

  function obtenerEstadoColor(estado: EstadoDoc) {
    switch (estado) {
      case 'verificado': return 'bg-green-100 text-green-700 border-green-200';
      case 'pendiente': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'rechazado': return 'bg-red-100 text-red-700 border-red-200';
      case 'falta': return 'bg-red-100 text-red-700 border-red-200';
    }
  }

  function obtenerIconoEstado(estado: EstadoDoc) {
    switch (estado) {
      case 'verificado': return <CheckCircle2 size={16} />;
      case 'pendiente': return <Clock size={16} />;
      case 'rechazado': return <AlertCircle size={16} />;
      case 'falta': return <AlertCircle size={16} />;
    }
  }

  function obtenerNombreCompleto(tipo: string) {
    const nombres: Record<string, string> = {
      'Licencia': 'Licencia de Conducir',
      'DNI': 'Documento de identificación',
      'Permiso': 'Permiso de Circulación',
      'Antecedentes': 'Certificado de Antecedentes'
    };
    return nombres[tipo] || tipo;
  }

  const faltantes = documentos.filter(d => d.estado === 'falta');
  const pendientes = documentos.filter(d => d.estado === 'pendiente');
  const rechazados = documentos.filter(d => d.estado === 'rechazado');

  return (
    <div className="min-h-screen bg-slate-50">
      <BarraLateral />

      <div className="p-8 lg:p-10" style={{ marginLeft: '256px' }}>
        <div className="mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Mi Documentación</h1>
            <p className="text-slate-500 mt-1 text-sm">Gestiona y sube tus documentos requeridos</p>
          </div>

          {/* Mensajes de feedback */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-5 flex items-center gap-3">
              <AlertCircle size={20} className="text-red-600 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
              <button onClick={() => setError(null)} className="ml-auto text-red-600 hover:text-red-800">
                ✕
              </button>
            </div>
          )}

          {exito && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-5 flex items-center gap-3">
              <CheckCircle2 size={20} className="text-green-600 shrink-0" />
              <p className="text-sm text-green-700">{exito}</p>
              <button onClick={() => setExito(null)} className="ml-auto text-green-600 hover:text-green-800">
                ✕
              </button>
            </div>
          )}

          <div className="flex flex-col gap-15">
            {/* Grid de documentos - 2x2 */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-8">
              {documentos.map(doc => (
                <div key={doc.tipo} className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">{obtenerNombreCompleto(doc.tipo)}</h3>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border mt-1 ${obtenerEstadoColor(doc.estado)}`}>
                          {obtenerIconoEstado(doc.estado)}
                          {obtenerEstadoTexto(doc.estado)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {doc.estado === 'falta' ? (
                    <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 cursor-pointer">
                      <Upload size={16} />
                      {subiendo === doc.tipo ? 'Subiendo...' : 'Subir Documento'}
                      <input
                        type="file"
                        className="hidden"
                        disabled={subiendo === doc.tipo}
                        onChange={(e) => e.target.files?.[0] && subirDocumento(doc.tipo, e.target.files[0])}
                      />
                    </label>
                  ) : doc.estado === 'rechazado' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => eliminarDocumento(doc.tipo, doc.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700"
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </button>
                      <a
                        href={doc.archivo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700"
                      >
                        <Eye size={16} />
                        Ver
                      </a>
                    </div>
                  ) : (
                    <a
                      href={doc.archivo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700"
                    >
                      <Eye size={16} />
                      Ver Documento
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Estado General */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                    faltantes.length === 0 && pendientes.length === 0 ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    <AlertCircle size={24} className={faltantes.length === 0 && pendientes.length === 0 ? 'text-green-600' : 'text-yellow-600'} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Estado General de la Documentación</h3>
                    {faltantes.length === 0 && pendientes.length === 0 ? (
                      <p className="text-sm text-slate-600">
                        ✓ Toda tu documentación está completa y verificada. ¡Estás listo para trabajar!
                      </p>
                    ) : (
                      <p className="text-sm text-slate-600">
                        ¡Atención! {faltantes.length > 0 && `Falta documentación importante.`} Para poder trabajar, es necesario {faltantes.length > 0 && `subir ${faltantes.map(d => `"${obtenerNombreCompleto(d.tipo)}"`).join(' y ')}`}{faltantes.length > 0 && (pendientes.length > 0 || rechazados.length > 0) && ' y '}{pendientes.length > 0 && `esperar la revisión de ${pendientes.map(d => `"${obtenerNombreCompleto(d.tipo)}"`).join(' y ')}`}{rechazados.length > 0 && `. Los documentos ${rechazados.map(d => `"${obtenerNombreCompleto(d.tipo)}"`).join(' y ')} fueron rechazados, debes subirlos nuevamente`}.
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setDetallesAbiertos(!detallesAbiertos)}
                    className="px-4 py-2.5 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 flex items-center gap-2"
                  >
                    Ver Detalles
                    {detallesAbiertos ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {detallesAbiertos && (
                <div className="border-t border-slate-200 p-6 bg-slate-50">
                  <div className="space-y-3">
                    {documentos.map(doc => (
                      <div key={doc.tipo} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center gap-3">
                          <FileText size={18} className="text-slate-400" />
                          <span className="text-sm font-medium text-slate-800">{obtenerNombreCompleto(doc.tipo)}</span>
                        </div>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${obtenerEstadoColor(doc.estado)}`}>
                          {obtenerIconoEstado(doc.estado)}
                          {obtenerEstadoTexto(doc.estado)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
