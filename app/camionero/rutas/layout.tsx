import '@css/globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rutas - TruckWave'
}

export default function rutasLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="ml-64">
        {children}
      </div>
    </>
  )
}
