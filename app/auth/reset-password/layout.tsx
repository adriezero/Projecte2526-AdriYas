import NavBar from '@componentes/BarraNavegacion'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Restablecer contraseña - TruckWave'
}

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      {children}
    </>
  )
}
