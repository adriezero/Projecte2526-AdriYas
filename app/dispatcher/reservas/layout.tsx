import '@css/globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reservas - TruckWave'
}

export default function tareasLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="ml-64">
        {children}
      </div>
    </>
  )
}
