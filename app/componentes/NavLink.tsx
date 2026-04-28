'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function NavLink({
  href,
  children,
  className,
  exact = false,
  ...propiedades
}: {
  href: string
  exact?: boolean
  className?: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : pathname === href || (pathname.startsWith(href + '/') && href !== '/home')
  const newClassName = isActive ? `${className} active` : className

  return (
    <Link href={href} className={newClassName} {...propiedades}>
      {children}
    </Link>
  )
}
