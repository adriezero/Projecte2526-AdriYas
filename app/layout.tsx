import './globals.css'
import BarraNavegacion from "./componentes/BarraNavegacion";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <BarraNavegacion/>
        {children}
      </body>
    </html>
  )
}