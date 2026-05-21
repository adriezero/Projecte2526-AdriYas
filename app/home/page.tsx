"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { ChevronDown, Truck, Package, MapPin, Check, Star } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const t = useTranslations('home');
  const [stats, setStats] = useState({ shipments: 0, satisfaction: 0, countries: 0 });
  const statsRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateStats();
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateStats = () => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setStats({
        shipments: Math.floor(12000 * progress),
        satisfaction: Math.floor(98 * progress),
        countries: Math.floor(8 * progress)
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
  };
  
  return (
    <main className="bg-gray-100 text-gray-900">
    
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center bg-primary overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-100">
          <source src="/video/truck-road.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-linear-to-br from-primary via-primary to-[#163a5f] opacity-90" />
        <div className="relative z-10 text-center px-6 py-20 max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 max-w-3xl mx-auto">
            {t('hero.title')}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed py-8">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <a href="#servicios" className="px-8 py-4 bg-accent-orange text-white rounded-xl font-semibold hover:bg-[#d66a1a] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-lg">
              {t('hero.discoverServices')}
            </a>
            <Link href="/auth/login?callbackUrl=/home/cliente/ruta" className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-primary transition-all duration-300 text-lg">
              {t('hero.trackShipment')}
            </Link>
          </div>
          <a href="#servicios" className="mt-16 inline-flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 cursor-pointer group">
            <ChevronDown className="w-64 h-32 group-hover:translate-y-1 transition-transform pt-12" />
          </a>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} className="bg-white py-12 sm:py-16 px-4 flex items-center justify-center">
        <div className="max-w-6xl w-full grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="group flex flex-col items-center justify-center">
            <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">
              {stats.shipments.toLocaleString()}+
            </div>
            <div className="text-gray-600 text-lg">Envíos Completados</div>
          </div>
          <div className="group flex flex-col items-center justify-center">
            <div className="text-4xl sm:text-5xl font-bold text-accent-orange mb-2">
              {stats.satisfaction}%
            </div>
            <div className="text-gray-600 text-lg">Satisfacción del Cliente</div>
          </div>
          <div className="group flex flex-col items-center justify-center">
            <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">
              {stats.countries}
            </div>
            <div className="text-gray-600 text-lg">Países de Operación</div>
          </div>
        </div>
      </section>

      {/* LOGOS CLIENTES */}
      <section className="bg-gray-50 py-12 px-4 overflow-hidden flex flex-col items-center justify-center">
        <h3 className="text-center text-gray-500 text-2xl font-bold uppercase tracking-wider pb-8 font-arsenal">Confían en Nosotros</h3>
        <div className="relative w-full">
          <div className="flex gap-12 animate-scroll-infinite">
            {[...Array(3)].map((_, idx) => (
              ['empresa-a.png', 'empresa-b.png', 'empresa-c.png', 'empresa-d.png', 'empresa-e.png', 'empresa-f.png'].map((logo, i) => (
                <div key={`${idx}-${i}`} className="shrink-0 w-64 h-32 bg-white rounded-lg shadow-sm flex items-center justify-center border border-gray-200 hover:shadow-md transition-shadow p-4 relative">
                  <Image src={`/img/clientes/${logo}`} alt={`Cliente ${i + 1}`} fill className="object-contain grayscale hover:grayscale-0 transition-all p-2" />
                </div>
              ))
            )).flat()}
          </div>
        </div>
      </section>

      {/* TESTIMONIO */}
      <section className="bg-white py-16 sm:py-20 px-4 flex items-center justify-center">
        <div className="max-w-4xl w-full text-center flex flex-col items-center justify-center">
          <div className="flex justify-center mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-accent-orange text-accent-orange" />
            ))}
          </div>
          <blockquote className="text-xl sm:text-2xl text-gray-700 italic mb-8 leading-relaxed">
            &quot;TruckWave transformó completamente nuestra logística. La puntualidad y el seguimiento en tiempo real nos dieron la tranquilidad que necesitábamos para crecer.&quot;
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden relative shrink-0">
              <Image src="/img/review-web.png" alt="María Contreras" fill className="object-cover" />
            </div>
            <div className="text-left">
              <div className="font-bold text-gray-900">María Contreras</div>
              <div className="text-gray-500 text-sm">Directora de Operaciones, LogiCorp</div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="bg-linear-to-b from-gray-50 to-bg py-16 sm:py-20 px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text text-center">
          {t('services.title')}
        </h2>
        <p className="text-center text-border text-lg sm:text-xl mb-10 sm:mb-16 mx-auto p-12">
          {t('services.subtitle')}
        </p>
        <div className="flex items-center justify-center">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10">
            {[
              { icon: Truck, key: 'groundTransport', descKey: 'groundTransportDesc' },
              { icon: Package, key: 'cargoHandling', descKey: 'cargoHandlingDesc' },
              { icon: MapPin, key: 'routeTracking', descKey: 'routeTrackingDesc' }
            ].map(({ icon: Icon, key, descKey }, index) => (
              <div key={index} className="group bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 text-center hover:shadow-2xl hover:border-accent-orange/30 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center gap-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mb-5 sm:mb-6 bg-linear-to-br from-primary to-[#163a5f] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
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
      <section className="bg-bg py-16 sm:py-20 mb-0 flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-7xl w-full text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-text pb-4">{t('whyUs.title')}</h2>
          <p className="text-black pb-10 sm:mb-12 text-sm sm:text-base">{t('whyUs.subtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center text-left">
            <div>
              <ul className="space-y-8 sm:space-y-12">
                {[
                  { key: 'modernFleet', descKey: 'modernFleetDesc' },
                  { key: 'qualifiedStaff', descKey: 'qualifiedStaffDesc' },
                  { key: 'monitoring', descKey: 'monitoringDesc' },
                ].map(({ key, descKey }) => (
                  <li key={key} className="flex gap-4 sm:gap-5 items-start group py-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 mt-1 bg-linear-to-br from-accent-orange to-accent-yellow rounded-xl shrink-0 flex items-center justify-center shadow-md">
                      <Check className="w-7 h-7 text-white stroke-3" />
                    </div>
                    <div>
                      <strong className="text-lg sm:text-2xl font-bold text-text block mb-1 sm:mb-2">{t(`whyUs.${key}`)}</strong>
                      <p className="text-black text-sm sm:text-base leading-relaxed">{t(`whyUs.${descKey}`)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-64 sm:h-80 md:h-96 w-full mt-8 md:mt-0 group">
              <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
                <source src="/video/truck-unloading.webm" type="video/webm" />
              </video>
              <div className="absolute inset-0 bg-linear-to-t from-primary/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-linear-to-br from-primary to-[#163a5f] py-16 sm:py-20 flex items-center justify-center px-4 sm:px-6 flex-col gap-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">{t('cta.title')}</h2>
          <p className="text-base sm:text-xl text-white/90 mb-6 sm:mb-8">{t('cta.subtitle')}</p>
        </div>
        <Link href="/auth/login" className="px-8 py-4 sm:px-12 sm:py-5 bg-accent-orange text-white rounded-xl font-semibold hover:bg-[#d66a1a] transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 text-base sm:text-xl">{t('cta.button')}</Link>
      </section>

      {/* IMAGEN FINAL */}
      <section className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/img/diferentescamiones.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
      </section>
    </main>
  );
}
