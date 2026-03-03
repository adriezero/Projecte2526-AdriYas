import '@css/globals.css'
import FooterGrande from '@componentes/FooterGrande'
import { Metadata } from 'next'
import BarraLateral from '@componentes/admin/BarraLateral'

export const metadata: Metadata = {
  title: 'TruckWave'
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <BarraLateral />
      {children}
    </>
  )
}