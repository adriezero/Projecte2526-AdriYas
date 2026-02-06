import './globals.css'
import BarraNavegacion from "@componentes/BarraNavegacion";
import LittleFooter from '@componentes/FooterPequeño';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"/>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.3.2/css/flag-icons.min.css" />
      </head>
      <body>
        <BarraNavegacion/>
        {children}
        <LittleFooter/>
      </body>
    </html>
  )
}