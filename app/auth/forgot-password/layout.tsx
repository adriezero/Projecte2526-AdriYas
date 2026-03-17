import NavBar from '@componentes/BarraNavegacion'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recuperar contraseña - TruckWave'
}

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      {children}
    </>
  )
}
