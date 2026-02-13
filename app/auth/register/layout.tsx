import NavBar from '@componentes/BarraNavegacion'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Registrarse - TruckWave'
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>
    <NavBar />
    {children}
  </>
}
