import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solicitar - TruckWave'
}
export default function SolicitarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
