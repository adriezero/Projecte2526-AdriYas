import '@css/globals.css'
import { Metadata } from 'next'
import BarraLateral from '@componentes/dispatcher/BarraLateral';

export const metadata: Metadata = {
  title: 'Tareas - TruckWave'
}

export default function TareasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <BarraLateral />
      <div className="bg-gray-50 p-8">
        <div className="max-w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
