import { Metadata } from 'next'
import BarraLateral from '@componentes/shared/BarraLateral'

export const metadata: Metadata = {
  title: 'Admin - TruckWave'
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BarraLateral role="admin" />
      {children}
    </>
  )
}
