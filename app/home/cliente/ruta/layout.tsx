import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ruta - TruckWave'
}
export default function RutaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
