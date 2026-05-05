"use client";

import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('home');
  
  return (
    <main className="bg-gray-100 text-gray-900">
    
      {/* HERO */}
     <section className="bg-gray-700 text-white h-screen flex items-center justify-center">
  <div className="text-center px-4">
    <h1 className="text-6xl font-bold mb-8 whitespace-nowrap">
      {t('hero.title')}
    </h1>

    <p className="text-2xl opacity-90 max-w-3xl mx-auto mb-10 whitespace-nowrap">
      {t('hero.subtitle')}
    </p>

    <div className="flex justify-center gap-4 flex-wrap">
      <a href="#servicios" className="px-10 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition text-lg">
        {t('hero.discoverServices')}
      </a>
      <Link href="/auth/login?callbackUrl=/home/cliente/ruta" className="px-10 py-4 border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition text-lg">{t('hero.trackShipment')}</Link>
    </div>

    <a href="#servicios" className="mt-16 inline-flex items-center justify-center transition group">
      <span className="text-4xl transform transition-transform group-hover:translate-y-1">
        🡫
      </span>
    </a>
  </div>
</section>
      {/* SERVICIOS */}
      <section id="servicios" className="bg-linear-to-b from-white to-gray-50 py-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-4">{t('services.title')}</h2>
        <p className="text-center text-gray-600 text-lg mb-16">
          {t('services.subtitle')}
        </p>
        <br />
     <div className="flex items-center justify-center">
  <div className="max-w-6xl grid md:grid-cols-3 gap-10">
    {[1, 2, 3].map((item) => (
      <div
        key={item}
        className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
      >
        <div className="w-20 h-20 mx-auto mb-6 bg-linear-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
          <i className="bi bi-truck text-3xl text-white"></i>
        </div>
        <h3 className="font-bold text-xl mb-3 text-gray-800">{t('services.groundTransport')}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {t('services.description')}
        </p>
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
     <section className="bg-gray-450 h-140 mb-40 flex items-center justify-center px-6">
  <div className="max-w-6xl w-full text-center">
    <h2 className="text-3xl font-bold mb-4">
      {t('whyUs.title')}
    </h2>

    <p className="text-gray-600 mb-12">
      {t('whyUs.subtitle')}
    </p>

    <div className="grid md:grid-cols-2 gap-16 items-center text-left">
      <div>
        <ul>
          <li className="flex gap-5 items-start">
            <div className="w-12 h-12 mt-1 bg-linear-to-br from-blue-500 to-blue-700 rounded-xl shrink-0 flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">✓</span>
            </div>
            <div>
              <strong className="text-2xl font-bold text-gray-800 block mb-2">{t('whyUs.modernFleet')}</strong>
              <p className="text-gray-600 text-base leading-relaxed">
                {t('whyUs.modernFleetDesc')}
              </p>
            </div>
          </li>

          <li className="flex gap-5 items-start mt-32">
            <div className="w-12 h-12 mt-1 bg-linear-to-br from-blue-500 to-blue-700 rounded-xl shrink-0 flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">✓</span>
            </div>
            <div>
              <strong className="text-2xl font-bold text-gray-800 block mb-2">{t('whyUs.qualifiedStaff')}</strong>
              <p className="text-gray-600 text-base leading-relaxed">
                {t('whyUs.qualifiedStaffDesc')}
              </p>
            </div>
          </li>

          <li className="flex gap-5 items-start mt-32">
            <div className="w-12 h-12 mt-1 bg-linear-to-br from-blue-500 to-blue-700 rounded-xl shrink-0 flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">✓</span>
            </div>
            <div>
              <strong className="text-2xl font-bold text-gray-800 block mb-2">{t('whyUs.monitoring')}</strong>
              <p className="text-gray-600 text-base leading-relaxed">
                {t('whyUs.monitoringDesc')}
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div className="bg-[url('/img/diferentescamiones.jpg')] bg-cover bg-center rounded-2xl h-96 w-full shadow-2xl" />
    </div>
  </div>
</section>


      {/* CTA */}
     <section className="bg-gray-700 text-white h-80 flex items-center justify-center ">
  <div className="text-center">
    <h2 className="text-4xl font-bold whitespace-nowrap mb-6">
      {t('cta.title')}
    </h2>

    <p className="text-xl opacity-90 mb-16 whitespace-nowrap">
      {t('cta.subtitle')}
    </p>
    <br />
 <Link href="/auth/login" className="px-12 py-5 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition text-xl">{t('cta.button')}</Link>
  </div>
</section>

    </main>
  );
}
