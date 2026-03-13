import '@css/globals.css'
import FooterGrande from '@componentes/FooterGrande'
import BarraLateral from '@componentes/admin/BarraLateral'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin - TruckWave'
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BarraLateral />
      {children}
    </>
  )
}
