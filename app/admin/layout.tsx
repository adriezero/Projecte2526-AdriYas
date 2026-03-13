import '@css/globals.css'
import BarraLateral from '@componentes/admin/BarraLateral'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin - TruckWave'
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      
      <div className="ml-64">
        <BarraLateral />
        {children}
      </div>
    </>
  )
}
