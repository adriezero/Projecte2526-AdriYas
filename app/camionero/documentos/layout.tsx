import '@css/globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Documentos - TruckWave'
}

export default function documentosLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="ml-64">
        {children}
      </div>
    </>
  )
}
