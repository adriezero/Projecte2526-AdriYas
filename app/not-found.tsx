import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
      {/* Efectos de fondo sutiles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-2xl">
        {/* Icono de camión minimalista */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-linear-to-br from-blue-500 to-cyan-500 rounded-3xl shadow-2xl mb-6">
            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
            </svg>
          </div>
        </div>

        {/* Número 404 elegante */}
        <h1 className="text-8xl md:text-9xl font-black text-white mb-6 tracking-tight">
          4<span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-400">0</span>4
        </h1>
        
        {/* Título limpio */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Página no encontrada
        </h2>
        
        {/* Descripción simple */}
        <p className="text-lg text-gray-400 mb-12 leading-relaxed">
          La ruta que buscas no existe en nuestro sistema de gestión logística.
        </p>

        {/* Botones modernos y limpios */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
