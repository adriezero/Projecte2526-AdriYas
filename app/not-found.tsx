'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className={`relative z-10 text-center px-6 max-w-3xl transition-all duration-1000 flex flex-col gap-6 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
          <div className="relative inline-flex items-center justify-center w-40 h-40 bg-linear-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-full shadow-2xl">
            <svg className="w-20 h-20 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
            </svg>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-black text-white mb-2 tracking-tighter leading-none">
            4<span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-cyan-400 to-blue-500 animate-pulse">0</span>4
          </h1>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Ruta Perdida
        </h2>
        
        <p className="text-xl text-gray-300 mb-4 leading-relaxed max-w-xl mx-auto">
          El camión se ha desviado del camino.
        </p>
        <p className="text-lg text-gray-400 mb-12 leading-relaxed max-w-xl mx-auto">
          La página que buscas no existe en nuestro sistema de gestión logística TruckWave.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/"
            className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-linear-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-300 text-lg"
          >
            <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Volver al Inicio
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-md text-white font-bold rounded-2xl hover:bg-white/20 border-2 border-white/20 hover:border-white/40 transition-all duration-300 text-lg"
          >
            <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Regresar
          </button>
        </div>
      </div>
    </div>
  );
}
