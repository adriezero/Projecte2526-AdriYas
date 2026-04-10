import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reportes - TruckWave'
}

export default function ReportesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
