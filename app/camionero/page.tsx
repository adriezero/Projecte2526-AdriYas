import '@css/globals.css'
import { Metadata } from 'next'
import BarraLateral from '@componentes/camionero/BarraLateral'

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