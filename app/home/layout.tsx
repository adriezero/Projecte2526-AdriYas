import '@css/globals.css'
import BarraNavegacion from '@componentes/BarraNavegacion'
import FooterGrande from '@componentes/FooterGrande'
import { Metadata } from 'next'

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
      <BarraNavegacion />
      {children}
      <FooterGrande />
    </>
  )
}