import '@css/globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recordatorios - TruckWave'
}

export default function recordatoriosLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="ml-64">
        {children}
      </div>
    </>
  )
}
