"use client";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function FooterGrande() {
  const t = useTranslations('footer');
  
  return (
    <footer className="mt-auto bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Información de Contacto */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Truck Wave</h3>
          <div className="space-y-3">
            <p className="flex items-center gap-2">
              <span>📍</span>
              <span>Mercabarna ,Barcelona,España</span>
            </p>
            <p className="flex items-center gap-2">
              <span>📞</span>
              <span>+34 123 456 789</span>
            </p>
            <p className="flex items-center gap-2">
              <span>✉️</span>
              <span>info@truckwave.com</span>
            </p>
          </div>
        </div>

        {/* Enlaces Rápidos */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">{t('quickLinks')}</h3>
          <ul className="space-y-2">
            <li><Link href="/home" className="hover:text-white transition-colors">{t('home')}</Link></li>
            <li><Link href="/servicios" className="hover:text-white transition-colors">{t('services')}</Link></li>
            <li><Link href="/sobre-nosotros" className="hover:text-white transition-colors">{t('about')}</Link></li>
            <li><Link href="/contacto" className="hover:text-white transition-colors">{t('contact')}</Link></li>
          </ul>
        </div>

        {/* Servicios */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">{t('servicesTitle')}</h3>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:text-white transition-colors">{t('nationalTransport')}</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">{t('internationalTransport')}</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">{t('logistics')}</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">{t('storage')}</Link></li>
          </ul>
        </div>

        {/* Información Legal */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">{t('legalInfo')}</h3>
          <ul className="space-y-2">
            <li><Link href="/privacidad" className="hover:text-white transition-colors">{t('privacy')}</Link></li>
            <li><Link href="/terminos" className="hover:text-white transition-colors">{t('terms')}</Link></li>
            <li><Link href="/cookies" className="hover:text-white transition-colors">{t('cookies')}</Link></li>
            <li><Link href="/aviso-legal" className="hover:text-white transition-colors">{t('legal')}</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}