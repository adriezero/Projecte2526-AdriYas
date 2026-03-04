'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BarraLateral() {
  const pathname = usePathname()
  
  return (
    <aside className="fixed left-0 top-0 h-screen w-80 bg-[#1C2634] text-white flex flex-col justify-between p-6">

      {/* 🔝 LOGO */}
      <div>
        <div className="flex items-center gap-2 mb-10">
          <span className="text-lg font-bold tracking-wide"><i className="bi bi-truck"></i>TRUCKWAVE</span>
        </div>

        <p className="text-sm uppercase text-gray-400">
          Espacio de Administrador
        </p>
        <hr/>
        {/* 📌 MENU */}
        <nav className="flex flex-col gap-3 pt-6">
          <Link
            href="/home"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              pathname === '/home' ? 'bg-[#2E3A4D]' : 'hover:bg-[#2A3444]'
            }`}
          >
          <i className="bi bi-house-heart p-1"></i> Home
          </Link>

          <Link
            href="/admin/gestionUsers"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              pathname === '/admin/gestionUsers' ? 'bg-[#2E3A4D]' : 'hover:bg-[#2A3444]'
            }`}
          >
             <i className="bi bi-people p-1"></i>Usuarios
          </Link>

          <Link
            href="/admin/reportes"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              pathname === '/admin/reportes' ? 'bg-[#2E3A4D]' : 'hover:bg-[#2A3444]'
            }`}
          >
            <i className="bi bi-flag p-1"></i>Reportes
          </Link>
        </nav>
      </div>

      {/* 🔽 PERFIL + BOTÓN CERRAR */}
      <div className="mt-6">
        <div className="flex items-center gap-3 bg-[#2A3444] p-3 rounded-lg mb-3">
          <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center font-bold">
            JD
          </div>
          <div className="text-sm">
            <p className="font-semibold"></p>
            <p className="text-gray-400 text-xs">Administrator</p>
          </div>
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition">
          🔓 Cerrar sesión
        </button>
      </div>

    </aside>
  )
}