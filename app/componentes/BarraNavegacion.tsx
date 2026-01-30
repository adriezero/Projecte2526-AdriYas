"use client";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="w-full bg-white shadow-sm">

      {/* BARRA SUPERIOR */}
      <div className="p-3 h-8 bg-[#1F4E79] text-white flex justify-end pr-6">
        ES ▼
      </div>
      <div className="h-20 flex items-center justify-between px-10 py-3 border-b">

        {/* IZQUIERDA */}
        <div className="flex items-center gap-2">
          <span className="text-xl">🚚</span>
          <span className="font-bold text-lg">TRUCKWAVE</span>
        </div>

        {/* CENTRO */}
        <ul className="flex gap-6">
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
        <div className="flex gap-5">
          <button className="bg-gray-200 border px-4 py-2 rounded">
            Solicitar Servicio
          </button>
          <button className="text-black px-4 py-2">
            Área Clientes
          </button>
        </div>

      </div>
    </nav>
  );
}