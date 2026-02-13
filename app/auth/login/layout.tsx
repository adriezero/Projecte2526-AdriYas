import NavBar from '@componentes/BarraNavegacion'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Iniciar sesión - TruckWave'
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>
    <NavBar />
    {children}
  </>
}
