"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/20/solid'
import NavLink from './NavLink'
import { useSession, signOut } from 'next-auth/react'
import { ROLE_ROUTES } from '@lib/roles'
import { useTranslations } from 'next-intl'

export default function NavBar() {
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'
  const isCliente = session?.user?.role === 'cliente'
  const translations = useTranslations('nav')
  const [menuOpen, setMenuOpen] = useState(false)

  const userRoute = session?.user?.role ? ROLE_ROUTES[session.user.role as string] : '/auth/login'

  const changeLocale = (newLocale: string) => {
    const date = new Date()
    date.setFullYear(date.getFullYear() + 1)
    document.cookie = `NEXT_LOCALE=${newLocale}; expires=${date.toUTCString()}; path=/; SameSite=Lax`
    window.location.reload()
  }

  return (
    <nav className="w-full bg-white shadow-sm fixed z-50">
      <div className="h-16 sm:h-20 flex items-center justify-between px-4 sm:px-10 py-3 border-b">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/img/camionlogo.png" width={90} height={0} alt="camionlogo" className="sm:w-[118px]" />
          <span className="font-bold text-base sm:text-lg text-black">TRUCKWAVE</span>
        </Link>

        {/* LINKS CENTRO — solo desktop */}
        <ul className="hidden lg:flex gap-6 text-black items-center">
          {isCliente ? (
            <>
              <li><NavLink href="/home" className="hover:text-blue-600">{translations('home')}</NavLink></li>
              <li><NavLink href="/contacto" className="hover:text-blue-600">{translations('contact')}</NavLink></li>
              <li><NavLink href="/sobre-nosotros" className="hover:text-blue-600">{translations('about')}</NavLink></li>
              <li className="text-gray-300">|</li>
              <li><NavLink href="/home/cliente/ruta" className="hover:text-blue-600">Reservas</NavLink></li>
              <li><NavLink href="/home/cliente/solicitar" className="hover:text-blue-600">Solicitar</NavLink></li>
            </>
          ) : (
            <>
              <li><NavLink href="/home" className="hover:text-blue-600">{translations('home')}</NavLink></li>
              <li><NavLink href="/contacto" className="hover:text-blue-600">{translations('contact')}</NavLink></li>
              <li><NavLink href="/sobre-nosotros" className="hover:text-blue-600">{translations('about')}</NavLink></li>
              {!isLoading && !session && (
                <>
                  <li className="text-gray-300">|</li>
                  <li><NavLink href="/auth/login" className="hover:text-blue-600">{translations('login')}</NavLink></li>
                </>
              )}
            </>
          )}
        </ul>

        {/* DERECHA — solo desktop */}
        <div className="hidden lg:flex gap-5 text-black items-center">
          {!isCliente && (
            <Link href="/contacto" className="bg-gray-200 border px-4 py-2 rounded">{translations('requestService')}</Link>
          )}
          {isLoading ? (
            <div className="px-4 py-2 text-gray-400">Cargando...</div>
          ) : session ? (
            <>
              {isCliente ? (
                <>
                  <span className="text-sm">{translations('hello')}, {session?.user?.name}</span>
                  <Link href="/home/cliente/perfil" className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition" title="Mi Perfil">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </Link>
                </>
              ) : (
                <Link href={userRoute} className="px-4 py-2 hover:text-blue-600">{translations('myArea')}</Link>
              )}
              <button onClick={() => signOut({ callbackUrl: '/home' })} className="px-4 py-2 hover:text-red-600">{translations('logout')}</button>
            </>
          ) : (
            <Link href="/auth/login" className="px-4 py-2">{translations('clientArea')}</Link>
          )}

          {/* IDIOMA */}
          <Menu as="div" className="relative inline-block">
            <MenuButton suppressHydrationWarning className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring-1 inset-ring-gray-300 hover:bg-gray-50">
              {translations('language')}
              <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
            </MenuButton>
            <MenuItems transition className="absolute right-0.5 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg outline-1 outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
              <div className="py-1">
                <MenuItem>
                  <button onClick={() => changeLocale('es')} className="block w-full text-left px-2 py-2 text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">
                    <span className="flex items-center gap-2"><span className="fi fi-es" />Español</span>
                  </button>
                </MenuItem>
                <MenuItem>
                  <button onClick={() => changeLocale('ca')} className="block w-full text-left px-2 py-2 text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">
                    <span className="flex items-center gap-2"><span className="fi fi-es-ct" />Català</span>
                  </button>
                </MenuItem>
                <MenuItem>
                  <button onClick={() => changeLocale('en')} className="block w-full text-left px-2 py-2 text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">
                    <span className="flex items-center gap-2"><span className="fi fi-gb" />English</span>
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>

        {/* HAMBURGUESA — móvil/tablet */}
        <button
          className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      {/* MENÚ MÓVIL */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t px-4 py-4 flex flex-col gap-3 text-sm text-gray-800 shadow-md">
          <Link href="/home" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>{translations('home')}</Link>
          <Link href="/contacto" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>{translations('contact')}</Link>
          <Link href="/sobre-nosotros" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>{translations('about')}</Link>

          {isCliente && (
            <>
              <hr className="border-gray-200" />
              <Link href="/home/cliente/ruta" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>Ruta</Link>
              <Link href="/home/cliente/solicitar" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>Solicitar</Link>
            </>
          )}

          <hr className="border-gray-200" />

          {isLoading ? (
            <span className="text-gray-400">Cargando...</span>
          ) : session ? (
            <>
              {isCliente ? (
                <Link href="/home/cliente/perfil" className="flex items-center gap-2 hover:text-blue-600" onClick={() => setMenuOpen(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  {translations('hello')}, {session?.user?.name}
                </Link>
              ) : (
                <Link href={userRoute} className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>{translations('myArea')}</Link>
              )}
              {!isCliente && (
                <Link href="/contacto" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>{translations('requestService')}</Link>
              )}
              <button onClick={() => { signOut({ callbackUrl: '/home' }); setMenuOpen(false) }} className="text-left text-red-500 hover:text-red-600">{translations('logout')}</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>{translations('login')}</Link>
              <Link href="/contacto" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>{translations('requestService')}</Link>
            </>
          )}

          <hr className="border-gray-200" />

          {/* IDIOMA MÓVIL */}
          <div className="flex gap-3">
            {['es', 'ca', 'en'].map((locale) => (
              <button key={locale} onClick={() => changeLocale(locale)} className="text-xs px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 capitalize">
                {locale === 'es' ? 'ES' : locale === 'ca' ? 'CA' : 'EN'}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
