import BarraNavegacion from '@componentes/BarraNavegacion';
import FooterGrande from '@componentes/FooterGrande'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto - TruckWave'
}

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BarraNavegacion />
      {children}
      <FooterGrande />
    </>
  );
}