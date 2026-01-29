"use client";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="w-full bg-white shadow-sm px-6 py-3">
        
     {/* BARRA SUPERIOR */}
      <div className="p-3 h-8 w-ful bg-[#1F4E79] text-white  flex justify-end">
        ES ▼
      </div>


      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* IZQUIERDA */}
        <div className="flex items-center gap-2">
          <span className="text-xl">🚚</span>
          <span className="font-bold text-lg tracking-wide">TRUCKWAVE</span>
        </div>

        {/* CENTRO */}
        <ul className="flex gap-6 text-sm">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/contacto">Contacto</Link></li>
          <li><Link href="/sobre-nosotros">Sobre nosotros</Link></li>
          <li>
            <Link href="/auth/login">
              <span className="font-semibold">Iniciar Sesión</span>
            </Link>
          </li>
        </ul>

        {/* DERECHA */}
        <button className="btn btn-sm bg-gray-200 border">
          Solicitar Servicio
        </button>

      </div>
    </nav>
  );
}