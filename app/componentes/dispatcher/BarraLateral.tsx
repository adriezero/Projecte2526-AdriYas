'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

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
          Espacio de Dispatcher
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
            href="/dispatcher/tareas"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              pathname === '/dispatcher/tareas' ? 'bg-[#2E3A4D]' : 'hover:bg-[#2A3444]'
            }`}
          >
            <i className="bi bi-card-list"></i>Tareas
          </Link>

          <Link
            href="/dispatcher/solicitud"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              pathname === '/dispatcher/solicitud' ? 'bg-[#2E3A4D]' : 'hover:bg-[#2A3444]'
            }`}
          >
            <i className="bi bi-patch-question-fill"></i>Solicitud
          </Link>

          <Link
            href="/dispatcher/reservas"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              pathname === '/dispatcher/reservas' ? 'bg-[#2E3A4D]' : 'hover:bg-[#2A3444]'
            }`}
          >
            <i className="bi bi-calendar-week"></i>Reservas
          </Link>

          <Link
            href="/dispatcher/documentacion"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              pathname === '/dispatcher/documentacion' ? 'bg-[#2E3A4D]' : 'hover:bg-[#2A3444]'
            }`}
          >
            <i className="bi bi-file-earmark-fill"></i>Documentación
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
            <p className="font-semibold">{session?.user?.name ?? 'Usuario'}</p>
            <p className="text-gray-400 text-xs">Dispatcher</p>
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