"use client";

export default function Home() {
  return (
    <main className="bg-gray-100 text-gray-900">
    
      {/* HERO */}
     <section className="bg-gray-700 text-white h-screen flex items-center justify-center">
  <div className="text-center px-4">
    <h1 className="text-5xl font-bold mb-6">
      Tu Mercancía, Nuestro Compromiso
    </h1>

    <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
      Soluciones logísticas integrales para tus necesidades de transporte terrestre.
    </p>

    <div className="flex justify-center gap-4 flex-wrap">
      <button className="px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition">
        Descubre Nuestros Servicios
      </button>

      <button className="px-8 py-3 border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
        Rastrea Tu Envío
      </button>

    <button className="px-10 py-4rounded-lg font-semibold text-lg flex items-center gap-3 transition group">
  <span className="text-2xl transform transition-transform group-hover:translate-y-1">
    🡫
  </span>
</button>

    </div>
  </div>
</section>


      {/* SERVICIOS */}
      <section className="bg-white py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-3">Nuestros Servicios</h2>
        <p className="text-center text-gray-600 mb-12">
          Ofrecemos una amplia gama de soluciones de transporte
        </p>
     <div className="flex items-center justify-center">
  <div className="max-w-6xl grid md:grid-cols-3 gap-8">
    {[1, 2, 3].map((item) => (
      <div
        key={item}
        className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition"
      >
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
          <i className="bi bi-truck text-2xl text-blue-600"></i>
        </div>
        <h3 className="font-semibold text-lg mb-2">Transporte Terrestre</h3>
        <p className="text-gray-600 mb-4">
          Servicio de transporte confiable y eficiente para tu mercancía.
        </p>
        <a href="#" className="text-blue-600 hover:underline font-medium">
          Más información →
        </a>
      </div>
    ))}
  </div>
</div>


      </section>

      {/* WHY US */}
     <section className="bg-gray-50 min-h mb-40 flex items-center justify-center px-6">
  <div className="max-w-6xl w-full text-center">
    <h2 className="text-3xl font-bold mb-4">
      ¿Por qué elegir TruckWave?
    </h2>

    <p className="text-gray-600 mb-12">
      Experiencia, Eficiencia y Confianza en Cada Envío.
    </p>

    <div className="grid md:grid-cols-2 gap-12 items-center text-left">
      <div>
        <ul className="space-y-6">
          <li className="flex gap-4">
            <span className="w-6 h-6 mt-1 bg-blue-600 rounded-full flex-shrink-0"></span>
            <div>
              <strong className="text-lg">Flota Moderna</strong>
              <p className="text-gray-600">
                Vehículos de última generación equipados con tecnología avanzada.
              </p>
            </div>
          </li>

          <li className="flex gap-4">
            <span className="w-6 h-6 mt-1 bg-blue-600 rounded-full flex-shrink-0"></span>
            <div>
              <strong className="text-lg">Personal Calificado</strong>
              <p className="text-gray-600">
                Equipo altamente capacitado y con años de experiencia.
              </p>
            </div>
          </li>

          <li className="flex gap-4">
            <span className="w-6 h-6 mt-1 bg-blue-600 rounded-full flex-shrink-0"></span>
            <div>
              <strong className="text-lg">Monitoreo 24/7</strong>
              <p className="text-gray-600">
                Seguimiento en tiempo real de tu mercancía.
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div className="bg-[url('/img/diferentescamiones.jpg')] bg-cover bg-center rounded-lg h-96 w-full" />
    </div>
  </div>
</section>


      {/* CTA */}
     <section className="bg-gray-700 text-white h-80 flex items-center justify-center ">
  <div className="text-center max-w-2xl">
    <h2 className="text-3xl font-bold mb-4">
      ¿Necesitas un Transporte? Solicita tu Presupuesto Ahora
    </h2>

    <p className="text-lg opacity-90 mb-8">
      Contáctanos y obtén una cotización personalizada para tus necesidades de transporte.
    </p>

    <button className="px-10 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition text-lg">
      Solicitar Servicio
    </button>
  </div>
</section>

    </main>
  );
}
