'use client'

import Image from "next/image"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { UserAvatar } from '@componentes/ui'

type Role = 'admin' | 'camionero' | 'dispatcher'

interface NavLink {
  href: string
  label: string
  icon: string
}

interface RoleConfig {
  espacioLabel: string
  rolLabel: string
  links: NavLink[]
}

const ROLE_CONFIG: Record<Role, RoleConfig> = {
  admin: {
    espacioLabel: 'Espacio de Administrador',
    rolLabel: 'Administrator',
    links: [
      { href: '/home',                icon: 'bi-house-fill',        label: 'Home'     },
      { href: '/admin/gestionUsers',  icon: 'bi-people-fill',       label: 'Usuarios' },
      { href: '/admin/reportes',      icon: 'bi-flag-fill',         label: 'Reportes' },
    ],
  },
  camionero: {
    espacioLabel: 'Espacio personal',
    rolLabel: 'Camionero',
    links: [
      { href: '/home',                    icon: 'bi-house-fill',          label: 'Home'          },
      { href: '/camionero/horario',       icon: 'bi-calendar-week-fill',  label: 'Horario'       },
      { href: '/camionero/rutas',         icon: 'bi-truck',               label: 'Rutas'         },
      { href: '/camionero/recordatorios', icon: 'bi-card-list',           label: 'Recordatorios' },
      { href: '/camionero/documentos',    icon: 'bi-file-earmark-fill',   label: 'Documentos'    },
    ],
  },
  dispatcher: {
    espacioLabel: 'Espacio de Dispatcher',
    rolLabel: 'Dispatcher',
    links: [
      { href: '/home',                    icon: 'bi-house-fill',          label: 'Home'          },
      { href: '/dispatcher/tareas',       icon: 'bi-card-list',           label: 'Tareas'        },
      { href: '/dispatcher/solicitud',    icon: 'bi-patch-question-fill', label: 'Solicitud'     },
      { href: '/dispatcher/reservas',     icon: 'bi-calendar-week-fill',  label: 'Reservas'      },
      { href: '/dispatcher/documentacion',icon: 'bi-file-earmark-fill',   label: 'Documentación' },
    ],
  },
}

interface BarraLateralProps {
  role: Role
}

export default function BarraLateral({ role }: BarraLateralProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { espacioLabel, rolLabel, links } = ROLE_CONFIG[role]

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1C2634] text-white flex flex-col justify-between p-6">

      {/* LOGO */}
      <div>
        <div className="flex items-center gap-2 mb-10">
          <Image src="/img/logo-32x32.png" width={32} height={32} alt="truckwave-logo" className="sm:w-29.5" />
          <span className="font-arsenal font-bold text-2xl sm:text-3xl text-black tracking-wide">
            <span className="text-bg">TRUCK</span><span className="text-accent-orange">WAVE</span>
          </span>
        </div>

        <p className="text-sm uppercase text-gray-400 mb-6">
          {espacioLabel}
        </p>

        {/* MENU */}
        <nav className="flex flex-col gap-3 pt-6">
          {links.map(({ href, icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                pathname === href ? 'bg-[#2E3A4D]' : 'hover:bg-[#2A3444]'
              }`}
            >
              <i className={`bi ${icon} p-1`}></i>
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* PERFIL + BOTÓN CERRAR */}
      <div className="mt-6">
        <div className="flex items-center gap-3 bg-[#2A3444] p-3 rounded-lg mb-3">
          <UserAvatar name={session?.user?.name} size="md" />
          <div className="text-sm">
            <p className="font-semibold">{session?.user?.name ?? 'Usuario'}</p>
            <p className="text-gray-400 text-xs">{rolLabel}</p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition flex items-center justify-center gap-2"
        >
          <i className="bi bi-box-arrow-right"></i>
          Cerrar sesión
        </button>
      </div>

    </aside>
  )
}