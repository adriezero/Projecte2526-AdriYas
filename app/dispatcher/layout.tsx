import { Metadata } from 'next'
import BarraLateral from '@componentes/shared/BarraLateral'

export const metadata: Metadata = {
  title: 'Dispatcher - TruckWave'
}

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return (
    <>
      <BarraLateral role="dispatcher" />
      {children}
    </>
  )
}