"use client";
import Image from "next/image";
import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import NavLink from './NavLink'
import { useSession, signOut } from 'next-auth/react'

export default function NavBar() {
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'

  const roleRoutes: Record<string, string> = {
    administrador: '/admin/gestionUsers',
    dispatcher: '/dispatcher/tareas',
    camionero: '/camionero/rutas',
    cliente: '/cliente'
  }

  const userRoute = session?.user?.role ? roleRoutes[session.user.role as string] : '/auth/login'

  return (
    <nav className="w-full bg-white shadow-sm fixed z-50">
      <div className="h-20 flex items-center justify-between px-10 py-3 border-b">
        {/* IZQUIERDA */}
        <div className="flex items-center">
          <Image
            src={"/img/camionlogo.png"}
            width={118}
            height={0}
            alt={"camionlogo"}
          />
          <span className="font-bold text-lg text-black">TRUCKWAVE</span>
        </div>

        {/* CENTRO */}
        <ul className="flex gap-6 text-black">
          <li>
            <NavLink href="/home" className="hover:text-blue-600">Home</NavLink>
          </li>
          <li>
            <NavLink href="/contacto" className="hover:text-blue-600">Contacto</NavLink>
          </li>
          <li>
            <NavLink href="/sobre-nosotros" className="hover:text-blue-600">Sobre nosotros</NavLink>
          </li>
          {!isLoading && !session && (
            <li>
              <NavLink href="/auth/login" className="hover:text-blue-600">Iniciar sesión</NavLink>
            </li>
          )}
        </ul>

        {/* DERECHA */}
        <div className="flex gap-5 text-black items-center">
          <Link href="/contacto" className="bg-gray-200 border px-4 py-2 rounded">Solicitar Servicio</Link>
          
          {isLoading ? (
            <div className="px-4 py-2 text-gray-400">Cargando...</div>
          ) : session ? (
            <>
              <Link href={userRoute} className="px-4 py-2 hover:text-blue-600">Mi Área</Link>
              <button onClick={() => signOut({ callbackUrl: '/home' })} className="px-4 py-2 hover:text-red-600">Cerrar sesión</button>
            </>
          ) : (
            <Link href="/auth/login" className="px-4 py-2">Área Clientes</Link>
          )}
          
          {/* IDIOMA */}
          <Menu as="div" className="relative inline-block">
            <MenuButton suppressHydrationWarning className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring-1 inset-ring-gray-300 hover:bg-gray-50">
              Idioma
              <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
            </MenuButton>
            <MenuItems transition
              className="absolute right-0.5 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg outline-1 outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
              <div className="py-1">
                <MenuItem>
                  <a href="#" id="es_ES"
                    className="block px-2 py-2 text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">
                    <span className="flex items-center gap-2">
                      <span className="fi fi-es" />
                      Español
                    </span>
                  </a>
                </MenuItem>
                <MenuItem>
                  <a href="#" id="ca_ES"
                    className="block px-2 py-2 text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">
                    <span className="flex items-center gap-2">
                      <span className="fi fi-es-ct" />
                      Català
                    </span>
                  </a>
                </MenuItem>
                <MenuItem>
                  <a href="#" id="en_US"
                    className="block px-2 py-2 text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">
                    <span className="flex items-center gap-2">
                      <span className="fi fi-gb" />
                      English
                    </span>
                  </a>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
      </div>
    </nav>
  );
}