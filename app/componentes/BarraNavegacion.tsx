"use client";
import Link from "next/link";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

export default function NavBar() {
  return (
    <nav className="w-full bg-white shadow-sm fixed">
      {/* BARRA SUPERIOR / IDIOMA */}
      <div className="p-3 h-8 bg-[#1F4E79] flex justify-end pr-6">
        <Menu as="div" className="relative inline-block">
          <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring-1 inset-ring-gray-300 hover:bg-gray-50">
            Idioma
            <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400"/>
          </MenuButton>
          <MenuItems transition
            className="absolute right-0.5 z-10 mt-2 w-24 origin-top-right rounded-md bg-white shadow-lg outline-1 outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
          >
            <div className="py-1 text-right">
              <MenuItem>
                <a href="#" id="es_ES"
                  className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">
                  <span className="fi fi-es"/>Español
                </a>
              </MenuItem>
              <MenuItem>
                <a href="#" id="ca_ES"
                  className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">
                  <span className="fi fi-es-ct"/>Català
                </a>
              </MenuItem>
              <MenuItem>
                <a href="#" id="en_US"
                  className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">
                  <span className="fi fi-gb"/>English
                </a>
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      </div>
      
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
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/contacto">Contacto</Link>
          </li>
          <li>
            <Link href="/sobre-nosotros">Sobre nosotros</Link>
          </li>
          <li>
            <Link href="/auth/login">
              <span className="font-semibold">Iniciar Sesión</span>
            </Link>
          </li>
        </ul>

        {/* DERECHA */}
        <div className="flex gap-5 text-black">
          <button className="bg-gray-200 border px-4 py-2 rounded">
            Solicitar Servicio
          </button>
          <button className="px-4 py-2">Área Clientes</button>
        </div>
      </div>
    </nav>
  );
}