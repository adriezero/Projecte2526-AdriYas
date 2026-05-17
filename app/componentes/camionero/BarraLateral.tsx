'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { UserAvatar } from '@componentes/ui'

export default function BarraLateral() {
  const pathname = usePathname()
  const { data: session } = useSession()
  
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1C2634] text-white flex flex-col justify-between p-6">

      {/* 🔝 LOGO */}
      <div>
        <div className="flex items-center gap-2 mb-10">
          <span className="text-lg font-bold tracking-wide">🚚 TRUCKWAVE</span>
        </div>

        <p className="text-sm uppercase text-gray-400 mb-6">
          Espacio personal
        </p>

        {/* 📌 MENU */}
        <nav className="flex flex-col gap-3">
          <Link
            href="/home"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              pathname === '/home' ? 'bg-[#2E3A4D]' : 'hover:bg-[#2A3444]'
            }`}
          >
            <i className="bi bi-house-fill"></i>Home
          </Link>

          <Link
            href="/camionero/horario"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              pathname === '/camionero/horario' ? 'bg-[#2E3A4D]' : 'hover:bg-[#2A3444]'
            }`}
          >
            <i className="bi bi-calendar-week"></i>Horario
          </Link>

          <Link
            href="/camionero/rutas"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              pathname === '/camionero/rutas' ? 'bg-[#2E3A4D]' : 'hover:bg-[#2A3444]'
            }`}
          >
            <i className="bi bi-truck"></i>Rutas
          </Link>

          <Link
            href="/camionero/recordatorios"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              pathname === '/camionero/recordatorios' ? 'bg-[#2E3A4D]' : 'hover:bg-[#2A3444]'
            }`}
          >
            <i className="bi bi-card-list"></i>Recordatorios
          </Link>

          <Link
            href="/camionero/documentos"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              pathname === '/camionero/documentos' ? 'bg-[#2E3A4D]' : 'hover:bg-[#2A3444]'
            }`}
          >
            <i className="bi bi-file-earmark-fill"></i>Documentos
          </Link>
        </nav>
      </div>

      {/* 🔽 PERFIL + BOTÓN CERRAR */}
      <div className="mt-6">
        <div className="flex items-center gap-3 bg-[#2A3444] p-3 rounded-lg mb-3">
          <UserAvatar name={session?.user?.name} size="md" />
          <div className="text-sm">
            <p className="font-semibold">{session?.user?.name ?? 'Usuario'}</p>
            <p className="text-gray-400 text-xs">Camionero</p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition"
        >
          🔓 Cerrar sesión
        </button>
      </div>

    </aside>
  )
}