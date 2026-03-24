"use client";

import { useSession } from "next-auth/react";

export default function ClientePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Área de Cliente</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-lg mb-4">
            Bienvenido, <span className="font-semibold">{session?.user?.name}</span>
          </p>
          <p className="text-gray-600">
            Aquí podrás gestionar tus solicitudes de transporte, ver el estado de tus envíos y más.
          </p>
        </div>
      </div>
    </div>
  );
}
