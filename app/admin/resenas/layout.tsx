import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Moderación de reseñas - TruckWave'
}

export default function ResenasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
