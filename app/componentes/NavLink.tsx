'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function NavLink({
  href,
  children,
  className,
  ...propiedades
}: {
  href: string
  exact?: boolean
  className?: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isActive = pathname.startsWith(href)
  const newClassName = isActive ? `${className} active` : className

  return (
    <Link href={href} className={newClassName} {...propiedades}>
      {children}
    </Link>
  )
}
