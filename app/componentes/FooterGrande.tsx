"use client";
import Link from "next/link";

export default function FooterGrande() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
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
          <h3 className="text-white font-bold text-lg mb-4">Enlaces Rápidos</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
            <li><Link href="/servicios" className="hover:text-white transition-colors">Servicios</Link></li>
            <li><Link href="/nosotros" className="hover:text-white transition-colors">Nosotros</Link></li>
            <li><Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link></li>
          </ul>
        </div>

        {/* Servicios */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Servicios</h3>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:text-white transition-colors">Transporte Nacional</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Transporte Internacional</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Logística</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Almacenamiento</Link></li>
          </ul>
        </div>

        {/* Información Legal */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Información Legal</h3>
          <ul className="space-y-2">
            <li><Link href="/privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
            <li><Link href="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</Link></li>
            <li><Link href="/cookies" className="hover:text-white transition-colors">Política de Cookies</Link></li>
            <li><Link href="/aviso-legal" className="hover:text-white transition-colors">Aviso Legal</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}