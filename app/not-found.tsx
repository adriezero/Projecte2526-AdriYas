'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary from-bg via-bg to-accent-orange/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-bg to-accent-orange/5"></div>

      <div className={`relative z-10 text-center px-4 sm:px-6 max-w-2xl mx-auto transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 bg-primary rounded-2xl shadow-lg p-4">
              <Image src="/favicon.ico" alt="TruckWave Logo" width={32} height={32} className="w-full h-full object-contain" />
            </div>
          </div>

        <h1 className="py-12 text-7xl sm:text-8xl md:text-9xl font-black text-text mb-6 tracking-tight">
            4<span className="text-accent-orange">0</span>4
          </h1>
          
        <h2 className="py-4 text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
            Ruta Perdida
          </h2>
          
        <p className="py-2 text-base sm:text-lg text-text/70 mb-3 leading-relaxed">
            El camión se ha desviado del camino.
          </p>
          <p className="py-4 text-sm sm:text-base text-text/60 mb-10 leading-relaxed">
            La página que buscas no existe en nuestro sistema de gestión logística TruckWave.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link 
              href="/"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 hover:shadow-lg transition-all duration-200"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Volver al Inicio
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-white text-primary font-semibold rounded-xl border-2 border-border/30 hover:border-primary hover:shadow-md transition-all duration-200"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Regresar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
