import BarraNavegacion from '@componentes/BarraNavegacion'
import BigFooter from '@componentes/FooterGrande'

export default function SobreNosotrosLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BarraNavegacion />
      <main className="pt-20">
        {children}
      </main>
      <BigFooter />
    </>
  )
}
