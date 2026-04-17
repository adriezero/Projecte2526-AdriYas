"use client";

import { useState } from "react";
import BarraLateral from "@componentes/camionero/BarraLateral";

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
    if (typeof window === "undefined") return notasIniciales;
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
    <div className="bg-gray-50 p-8" style={{ marginLeft: '300px' }}>
      <div className="max-w-full">

        {/* Título de la página */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Recordatorios y Notas</h1>
        </div>
      {/* Área de texto */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm focus-within:border-black focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-1 transition-all">
        <textarea
          className="w-full resize-none outline-none text-gray-600 text-sm min-h-[80px]"
          placeholder="Escribe tu recordatorio o nota aquí..."
          value={texto}
          onChange={e => setTexto(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={() => setTexto("")}
            className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            🗑 Limpiar
          </button>
          <button
            onClick={añadir}
            className="flex items-center gap-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium"
          >
            + Añadir Nota
          </button>
        </div>
      </div>

      {/* Filtros + Ordenar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-6 text-sm font-medium text-gray-600">
          {(["todos", "pendientes", "completadas", "importantes"] as Filtro[]).map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`capitalize pb-1 ${filtro === f ? "text-gray-900 border-b-2 border-gray-800" : "hover:text-gray-800"}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative">
          <button
            onClick={() => setMostrarOrden(!mostrarOrden)}
            className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            ⇅ Ordenar por
          </button>
          {mostrarOrden && (
            <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-md z-10 text-sm">
              <button onClick={() => { setOrden("fecha"); setMostrarOrden(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-50">Fecha</button>
              <button onClick={() => { setOrden("texto"); setMostrarOrden(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-50">Texto</button>
            </div>
          )}
        </div>
      </div>

      {/* Lista de notas */}
      <div className="flex flex-col gap-3">
        {filtradas.map(nota => (
          <div
            key={nota.id}
            className={`flex items-start justify-between p-4 rounded-xl border ${nota.importante ? "bg-yellow-50 border-yellow-100" : "bg-white border-gray-200"} shadow-sm`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={nota.completada}
                onChange={() => toggleCompletada(nota.id)}
                className="mt-1 accent-green-500"
              />
              <div>
                {editandoId === nota.id ? (
                  <div className="flex gap-2 items-center">
                    <input
                      className="text-sm border border-gray-300 rounded px-2 py-1 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:ring-offset-1"
                      value={textoEdicion}
                      onChange={e => setTextoEdicion(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && guardarEdicion(nota.id)}
                      autoFocus
                    />
                    <button onClick={() => guardarEdicion(nota.id)} className="text-xs text-green-600 font-medium hover:underline">Guardar</button>
                    <button onClick={() => setEditandoId(null)} className="text-xs text-gray-400 hover:underline">Cancelar</button>
                  </div>
                ) : (
                  <p className={`text-sm text-gray-800 ${nota.completada ? "line-through text-gray-400" : ""}`}>{nota.texto}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">Añadido: {nota.fecha}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4 shrink-0">
              <button onClick={() => toggleImportante(nota.id)} className={`text-lg ${nota.importante ? "text-yellow-400" : "text-gray-300 hover:text-yellow-300"}`}>★</button>
              <button onClick={() => iniciarEdicion(nota)} className="text-gray-400 hover:text-gray-600 text-sm">✏</button>
              <button onClick={() => eliminar(nota.id)} className="text-gray-400 hover:text-red-500 text-sm">🗑</button>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
