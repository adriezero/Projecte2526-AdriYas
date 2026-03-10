import '@css/globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Horario - TruckWave'
}

export default function horarioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="ml-64">
        {children}
      </div>
    </>
  )
}
