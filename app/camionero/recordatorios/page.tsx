"use client";

import { useState } from "react";

type Filtro = "todos" | "pendientes" | "completadas" | "importantes";
type OrdenTipo = "fecha" | "texto";

interface Nota {
  id: number;
  texto: string;
  completada: boolean;
  importante: boolean;
  fecha: string;
}

export default function Recordatorios() {
  const [notas, setNotas] = useState<Nota[]>(() => {
    if (typeof window === "undefined") return [];
    const guardadas = localStorage.getItem("recordatorios");
    return guardadas ? JSON.parse(guardadas) : [];
  });
  const [texto, setTexto] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [orden, setOrden] = useState<OrdenTipo>("fecha");
  const [mostrarOrden, setMostrarOrden] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [textoEdicion, setTextoEdicion] = useState("");

  const guardarNotas = (nuevasNotas: Nota[]) => {
    setNotas(nuevasNotas);
    localStorage.setItem("recordatorios", JSON.stringify(nuevasNotas));
  };

  const añadir = () => {
    if (!texto.trim()) return;
    const nueva: Nota = {
      id: Date.now(),
      texto: texto.trim(),
      completada: false,
      importante: false,
      fecha: new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    };
    guardarNotas([nueva, ...notas]);
    setTexto("");
  };

  const toggleCompletada = (id: number) =>
    guardarNotas(notas.map(n => n.id === id ? { ...n, completada: !n.completada } : n));

  const toggleImportante = (id: number) =>
    guardarNotas(notas.map(n => n.id === id ? { ...n, importante: !n.importante } : n));

  const eliminar = (id: number) => guardarNotas(notas.filter(n => n.id !== id));

  const iniciarEdicion = (nota: Nota) => {
    setEditandoId(nota.id);
    setTextoEdicion(nota.texto);
  };

  const guardarEdicion = (id: number) => {
    if (!textoEdicion.trim()) return;
    guardarNotas(notas.map(n => n.id === id ? { ...n, texto: textoEdicion.trim() } : n));
    setEditandoId(null);
  };

  const filtradas = notas
    .filter(n => {
      if (filtro === "pendientes") return !n.completada;
      if (filtro === "completadas") return n.completada;
      if (filtro === "importantes") return n.importante;
      return true;
    })
    .sort((a, b) => orden === "texto" ? a.texto.localeCompare(b.texto) : 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2F2F2', marginLeft: '256px' }}>
      <div className="p-6 md:p-8 md:ml-64">
        <div className="max-w-5xl mx-auto">

        {/* Título de la página */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#2C2C2C' }}>Mis Recordatorios y Notas</h1>
          <p className="text-gray-600 mt-1 text-sm">Organiza tus tareas y recordatorios</p>
        </div>
      {/* Área de texto */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 transition-all" style={{ borderWidth: '1px', borderColor: '#A6A6A6' }}>
        <textarea
          className="w-full resize-none outline-none text-sm min-h-20"
          style={{ color: '#2C2C2C' }}
          placeholder="Escribe tu recordatorio o nota aquí..."
          value={texto}
          onChange={e => setTexto(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={() => setTexto("")}
            className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm text-gray-700 transition-all shadow-sm"
            style={{ borderWidth: '1px', borderColor: '#A6A6A6' }}
          >
            🗑 Limpiar
          </button>
          <button
            onClick={añadir}
            className="flex items-center gap-1 px-4 py-2 text-white rounded-xl text-sm font-medium transition-all shadow-sm"
            style={{ backgroundColor: '#F47C20' }}
          >
            + Añadir Nota
          </button>
        </div>
      </div>

      {/* Filtros + Ordenar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
        <div className="flex gap-4 md:gap-6 text-sm font-medium text-gray-700 overflow-x-auto w-full md:w-auto">
          {(["todos", "pendientes", "completadas", "importantes"] as Filtro[]).map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`capitalize pb-1 whitespace-nowrap transition-colors ${filtro === f ? "font-bold" : "hover:text-gray-900"}`}
              style={{
                color: filtro === f ? '#1F4E79' : undefined,
                borderBottom: filtro === f ? '2px solid #1F4E79' : undefined
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative">
          <button
            onClick={() => setMostrarOrden(!mostrarOrden)}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm text-gray-700 transition-all shadow-sm"
            style={{ borderWidth: '1px', borderColor: '#A6A6A6' }}
          >
            ⇅ Ordenar por
          </button>
          {mostrarOrden && (
            <div className="absolute right-0 mt-1 bg-white rounded-xl shadow-lg z-10 text-sm overflow-hidden" style={{ borderWidth: '1px', borderColor: '#A6A6A6' }}>
              <button onClick={() => { setOrden("fecha"); setMostrarOrden(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors">Fecha</button>
              <button onClick={() => { setOrden("texto"); setMostrarOrden(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors">Texto</button>
            </div>
          )}
        </div>
      </div>

      {/* Lista de notas */}
      <div className="flex flex-col gap-3">
        {filtradas.map(nota => (
          <div
            key={nota.id}
            className={`flex flex-col md:flex-row items-start justify-between p-4 rounded-xl shadow-sm transition-all hover:shadow-md`}
            style={{
              backgroundColor: nota.importante ? '#FFFBEB' : 'white',
              borderWidth: '1px',
              borderColor: nota.importante ? '#FFC757' : '#A6A6A6'
            }}
          >
            <div className="flex items-start gap-3 flex-1 w-full">
              <input
                type="checkbox"
                checked={nota.completada}
                onChange={() => toggleCompletada(nota.id)}
                className="mt-1 w-4 h-4 cursor-pointer"
                style={{ accentColor: '#1F4E79' }}
              />
              <div className="flex-1">
                {editandoId === nota.id ? (
                  <div className="flex gap-2 items-center flex-wrap">
                    <input
                      className="text-sm rounded-xl px-3 py-2 outline-none transition-all flex-1 min-w-[200px]"
                      style={{ borderWidth: '1px', borderColor: '#A6A6A6' }}
                      value={textoEdicion}
                      onChange={e => setTextoEdicion(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && guardarEdicion(nota.id)}
                      autoFocus
                    />
                    <button onClick={() => guardarEdicion(nota.id)} className="text-xs font-medium hover:underline" style={{ color: '#1F4E79' }}>Guardar</button>
                    <button onClick={() => setEditandoId(null)} className="text-xs text-gray-500 hover:underline">Cancelar</button>
                  </div>
                ) : (
                  <p className={`text-sm ${nota.completada ? "line-through text-gray-400" : ""}`} style={{ color: nota.completada ? undefined : '#2C2C2C' }}>{nota.texto}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Añadido: {nota.fecha}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-auto md:ml-4 shrink-0 mt-2 md:mt-0">
              <button onClick={() => toggleImportante(nota.id)} className={`text-lg ${nota.importante ? "" : "text-gray-300 hover:text-yellow-400"}`} style={{ color: nota.importante ? '#FFC757' : undefined }}>★</button>
              <button onClick={() => iniciarEdicion(nota)} className="text-gray-500 hover:text-gray-700 text-sm transition-colors">✏</button>
              <button onClick={() => eliminar(nota.id)} className="text-gray-500 hover:text-red-500 text-sm transition-colors">🗑</button>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
    </div>
  );
}
