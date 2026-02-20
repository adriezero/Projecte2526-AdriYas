// app/componentes/seccionComentarios.tsx
"use client";

import { useEffect, useState } from "react";
import { Reseña } from "@interfaces/interfaces";
import Reseñas from "./Reseñas";

export default function ReviewsSection() {
  const [reseñas, setReseñas] = useState<Reseña[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [filtro, setFiltro] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const reseñasPorPagina = 4;

  useEffect(() => {
    fetch("/api/reviews")
      .then(res => res.json())
      .then(data => setReseñas(data));
  }, []);

  const positivas = reseñas.filter(r => r.isPositive).length;
  const totales = reseñas.length;
  
  let reseñasFiltradas = reseñas;
  
  if (filtro === 'positivas') {
    reseñasFiltradas = reseñas.filter(r => r.isPositive);
  } else if (filtro === 'comentarios') {
    reseñasFiltradas = reseñas.filter(r => r.comment.trim().length > 0);
  } else if (filtro === 'recientes') {
    reseñasFiltradas = [...reseñas].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } else if (filtro === 'negativas') {
    reseñasFiltradas = reseñas.filter(r => !r.isPositive);
  }
  
  if (busqueda) {
    reseñasFiltradas = reseñasFiltradas.filter(r => 
      r.comment.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.name.toLowerCase().includes(busqueda.toLowerCase())
    );
  }
  
  const totalPaginas = Math.ceil(reseñasFiltradas.length / reseñasPorPagina);
  const indiceInicio = (paginaActual - 1) * reseñasPorPagina;
  const reseñasPaginadas = reseñasFiltradas.slice(indiceInicio, indiceInicio + reseñasPorPagina);

  return (
    <section className="bg-gray-100 py-16 px-6 flex justify-center">
      <div className="max-w-6xl w-full space-y-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Valoraciones y Comentarios de Usuarios</h2>
          <p>Descubre lo que otros usuarios piensan sobre el servicio recibido.</p>
          <p className="text-lg">
            <span className="text-green-500 font-bold">{positivas} 👍</span>
            {' / '}
            <span className="text-red-500 font-bold">{totales - positivas} 👎</span>
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          <select 
            value={filtro} 
            onChange={(e) => { setFiltro(e.target.value); setPaginaActual(1); }}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="todas">Todas las valoraciones</option>
            <option value="recientes">Más recientes</option>
            <option value="comentarios">Con comentarios</option>
            <option value="positivas">Positivas</option>
            <option value="negativas">Negativas</option>
          </select>
          
          <input
            type="text"
            placeholder="Buscar en valoraciones..."
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
            className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-64"
          />
        </div>

        <div className="flex justify-center">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
          {reseñasPaginadas.map(r => (
            <Reseñas
              key={r.id}
              name={r.name}
              comment={r.comment}
              isPositive={r.isPositive}
              date={r.date}
              route={r.route}
            />
          ))}
          </div>
        </div>

        {totalPaginas > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                onClick={() => setPaginaActual(num)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  paginaActual === num
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
