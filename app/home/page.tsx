"use client";

import Link from "next/link";
import { useTranslations } from 'next-intl';
import { ChevronDown, Truck, Package, MapPin, Check } from 'lucide-react';

export default function Home() {
  const t = useTranslations('home');
  
  return (
    <main className="bg-gray-100 text-gray-900">
    
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center bg-[#1F4E79] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[#163a5f] opacity-90" />
        <div className="relative z-10 text-center px-6 py-20 max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <a href="#servicios" className="px-8 py-4 bg-[#F47C20] text-white rounded-xl font-semibold hover:bg-[#d66a1a] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-lg">
              {t('hero.discoverServices')}
            </a>
            <Link href="/auth/login?callbackUrl=/home/cliente/ruta" className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-[#1F4E79] transition-all duration-300 text-lg">
              {t('hero.trackShipment')}
            </Link>
          </div>
          <a href="#servicios" className="mt-16 inline-flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 cursor-pointer group">
            <ChevronDown className="w-8 h-8 group-hover:translate-y-1 transition-transform" />
          </a>
        </div>
      </section>
      {/* SERVICIOS */}
      <section id="servicios" className="bg-linear-to-b from-white to-bg py-16 sm:py-20 px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text text-center mb-4">
          {t('services.title')}
        </h2>
        <p className="text-center text-border text-lg sm:text-xl mb-10 sm:mb-16 max-w-2xl mx-auto">
          {t('services.subtitle')}
        </p>
        <div className="flex items-center justify-center">
          <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10">
            {[
              { icon: Truck, key: 'groundTransport', descKey: 'groundTransportDesc' },
              { icon: Package, key: 'cargoHandling', descKey: 'cargoHandlingDesc' },
              { icon: MapPin, key: 'routeTracking', descKey: 'routeTrackingDesc' }
            ].map(({ icon: Icon, key, descKey }, index) => (
              <div key={index} className="group bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 text-center hover:shadow-2xl hover:border-[#F47C20]/30 transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 sm:mb-6 bg-linear-to-br from-primary to-[#163a5f] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-bold text-lg sm:text-xl text-text mb-3">
                  {t(`services.${key}`)}
                </h3>
                <p className="text-border leading-relaxed text-sm sm:text-base">
                  {t(`services.${descKey}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* WHY US */}
      <section className="bg-[#F2F2F2] py-16 sm:py-20 mb-0 flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-6xl w-full text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2C2C2C] mb-4">{t('whyUs.title')}</h2>
          <p className="text-[#A6A6A6] mb-10 sm:mb-12 text-sm sm:text-base">{t('whyUs.subtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center text-left">
            <div>
              <ul className="space-y-8 sm:space-y-12">
                {[
                  { key: 'modernFleet', descKey: 'modernFleetDesc' },
                  { key: 'qualifiedStaff', descKey: 'qualifiedStaffDesc' },
                  { key: 'monitoring', descKey: 'monitoringDesc' },
                ].map(({ key, descKey }) => (
                  <li key={key} className="flex gap-4 sm:gap-5 items-start group">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 mt-1 bg-gradient-to-br from-[#F47C20] to-[#FFC757] rounded-xl shrink-0 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Check className="w-7 h-7 text-white stroke-[3]" />
                    </div>
                    <div>
                      <strong className="text-lg sm:text-2xl font-bold text-[#2C2C2C] block mb-1 sm:mb-2">{t(`whyUs.${key}`)}</strong>
                      <p className="text-[#A6A6A6] text-sm sm:text-base leading-relaxed">{t(`whyUs.${descKey}`)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-64 sm:h-80 md:h-96 w-full mt-8 md:mt-0 group">
              <div className="absolute inset-0 bg-[url('/img/diferentescamiones.jpg')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F4E79]/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="bg-gradient-to-br from-[#1F4E79] to-[#163a5f] py-16 sm:py-20 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">{t('cta.title')}</h2>
          <p className="text-base sm:text-xl text-white/90 mb-10 sm:mb-12">{t('cta.subtitle')}</p>
          <Link href="/auth/login" className="px-8 py-4 sm:px-12 sm:py-5 bg-[#F47C20] text-white rounded-xl font-semibold hover:bg-[#d66a1a] transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 text-base sm:text-xl">{t('cta.button')}</Link>
        </div>
      </section>

    </main>
  );
}
