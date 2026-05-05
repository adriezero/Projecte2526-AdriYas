"use client";
import { useTranslations } from 'next-intl';

export default function InfoSection() {
  const t = useTranslations('about');
  
  return (
    <section className="relative bg-[#2f2f2f] min-h-screen flex flex-col items-center justify-start pt-16 pb-32">
      
      {/* Título principal */}
      <h1 className="text-4xl text-white font-semibold text-center mb-8¡">
        {t('title')}
      </h1>

      {/* Subtítulo */}
      <h2 className="text-sm text-gray-300 text-center max-w-xl leading-relaxed mb-24">
        {t('subtitle')}
      </h2>
      <br />
      <br />

      {/* Contenedor central */}
      <div className="relative w-full max-w-6xl flex justify-start pl-10 mt-32">
        
        {/* Caja blanca */}
        <div className="relative h-120 bg-white p-12 w-[60%] shadow-xl">
          <h3 className="text-center font-extrabold text-2xl mb-6">
            {t('historyTitle')}
          </h3>
          <br />
          <p className="text-base text-gray-700 leading-relaxed mt-4">
            {t('historyText1')}
            <br /><br />
            {t('historyText2')}
            <br /><br />
            {t('historyText3')}
          </p>

          {/* Imagen superpuesta */}
          <div className="absolute top-1/2 -translate-y-1/2 -right-130 w-140 h-95
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
