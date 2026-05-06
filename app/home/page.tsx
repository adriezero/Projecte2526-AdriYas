"use client";

import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('home');
  
  return (
    <main className="bg-gray-100 text-gray-900">
    
      {/* HERO */}
      <section className="bg-gray-700 text-white min-h-screen flex items-center justify-center">
        <div className="text-center px-4 py-16">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8">
            {t('hero.title')}
          </h1>
          <p className="text-base sm:text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-8 sm:mb-10">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <a href="#servicios" className="px-8 py-3 sm:px-10 sm:py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition text-base sm:text-lg">
              {t('hero.discoverServices')}
            </a>
            <Link href="/auth/login?callbackUrl=/home/cliente/ruta" className="px-8 py-3 sm:px-10 sm:py-4 border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition text-base sm:text-lg">{t('hero.trackShipment')}</Link>
          </div>
          <a href="#servicios" className="mt-12 sm:mt-16 inline-flex items-center justify-center transition group">
            <span className="text-3xl sm:text-4xl transform transition-transform group-hover:translate-y-1">🡫</span>
          </a>
        </div>
      </section>
      {/* SERVICIOS */}
      <section id="servicios" className="bg-linear-to-b from-white to-gray-50 py-16 sm:py-20 px-4 sm:px-6">
        <h2 className="text-2xl sm:text-4xl font-bold text-center mb-4">{t('services.title')}</h2>
        <p className="text-center text-gray-600 text-base sm:text-lg mb-10 sm:mb-16">
          {t('services.subtitle')}
        </p>
        <div className="flex items-center justify-center">
          <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 sm:mb-6 bg-linear-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <i className="bi bi-truck text-2xl sm:text-3xl text-white"></i>
                </div>
                <h3 className="font-bold text-lg sm:text-xl mb-3 text-gray-800">{t('services.groundTransport')}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">{t('services.description')}</p>
                <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-2 group">
                  {t('services.moreInfo')}
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* WHY US */}
      <section className="py-16 sm:py-20 mb-0 flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-6xl w-full text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t('whyUs.title')}</h2>
          <p className="text-gray-600 mb-10 sm:mb-12 text-sm sm:text-base">{t('whyUs.subtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center text-left">
            <div>
              <ul className="space-y-8 sm:space-y-12">
                {[
                  { key: 'modernFleet', descKey: 'modernFleetDesc' },
                  { key: 'qualifiedStaff', descKey: 'qualifiedStaffDesc' },
                  { key: 'monitoring', descKey: 'monitoringDesc' },
                ].map(({ key, descKey }) => (
                  <li key={key} className="flex gap-4 sm:gap-5 items-start">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 mt-1 bg-linear-to-br from-blue-500 to-blue-700 rounded-xl shrink-0 flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg sm:text-xl font-bold">✓</span>
                    </div>
                    <div>
                      <strong className="text-lg sm:text-2xl font-bold text-gray-800 block mb-1 sm:mb-2">{t(`whyUs.${key}`)}</strong>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{t(`whyUs.${descKey}`)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[url('/img/diferentescamiones.jpg')] bg-cover bg-center rounded-2xl h-64 sm:h-80 md:h-96 w-full shadow-2xl mt-8 md:mt-0" />
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="bg-gray-700 text-white py-16 sm:py-20 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">{t('cta.title')}</h2>
          <p className="text-base sm:text-xl opacity-90 mb-10 sm:mb-12">{t('cta.subtitle')}</p>
          <Link href="/auth/login" className="px-8 py-4 sm:px-12 sm:py-5 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition text-base sm:text-xl">{t('cta.button')}</Link>
        </div>
      </section>

    </main>
  );
}
