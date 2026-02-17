export default function InfoSection() {
  return (
    <section className="relative bg-[#2f2f2f] min-h-screen flex flex-col items-center justify-start pt-16 pb-32">
      
      {/* Título principal */}
      <h1 className="text-4xl text-white font-semibold text-center mb-8¡">
        Transporte de confianza desde Mercabarna
      </h1>

      {/* Subtítulo */}
      <h2 className="text-sm text-gray-300 text-center max-w-xl leading-relaxed mb-24">
        Empresa familiar de transporte con más de 15 años moviendo el producto fresco 
        con compromiso, puntualidad y trato cercano.
      </h2>
      <br />
      <br />

      {/* Contenedor central */}
      <div className="relative w-full max-w-6xl flex justify-start pl-10 mt-32">
        
        {/* Caja blanca */}
        <div className="relative h-120 bg-white p-12 w-[60%] shadow-xl">
          <h3 className="text-center font-extrabold text-2xl mb-6">
            Una historia de esfuerzo y compromiso
          </h3>
<br />
          <p className="text-base text-gray-700 leading-relaxed mt-4">
            Esta empresa nació del esfuerzo de una sola persona que decidió emprender 
            en el sector del transporte en Mercabarna. Con dedicación, responsabilidad 
            y muchas horas de carretera, fue creciendo paso a paso.
            <br /><br />
            Hoy, la empresa cuenta con tres camiones y la segunda generación al frente, 
            manteniendo los mismos valores del primer día: puntualidad, trato cercano 
            y compromiso con cada cliente.
            <br /><br />
            Trabajamos cada día para que tu mercancía llegue a tiempo y en perfectas condiciones.
          </p>

          {/* Imagen superpuesta */}
          <div className="absolute top-1/2 -translate-y-1/2 -right-130 w-[560px] h-[380px]
                          bg-[url('/img/camionFamilia.jpg')] 
                          bg-cover bg-center 
                          border border-gray-400 
                          shadow-lg z-20">
          </div>

        </div>

      </div>
    </section>
  );
}
