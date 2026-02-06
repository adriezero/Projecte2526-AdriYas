"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FooterGrande from "../componentes/FooterGrande";

export default function Contacto() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  };

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-5xl w-full">
          {/* Título */}
          <div className="text-center  mb-8">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Contáctanos
            </h2>
            <p className="mb-30 text-gray-600">¡Nos encantaría escuchar de ti! Envíanos un mensaje y te responderemos a la brevedad.</p>
          </div>

          {/* Formulario */}
          <form className="bg-white p-16 rounded-lg shadow-md space-y-8" onSubmit={manejarEnvio}>
            {/* Usuario */}
            <div>
              <label className="text-gray-700 text-sm">Nombre Completo</label>
              <input
                type="text"
                required
                className="w-full mt-1 px-3 py-3 border border-gray-300 text-black rounded-md"
                placeholder="Ej: Marcos Peña"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

             {/* Email */}
            <div>
              <label className="text-gray-700 text-sm">Correo Electrónico</label>
              <input
                type="email"
                required
                className="w-full mt-1 px-3 py-3 border border-gray-300 text-black rounded-md"
                placeholder="Ej: tu.correo@ejemplo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>

            {/* Asunto */}
            <div>
              <label className="text-gray-700 text-sm">Asunto</label>
              <input
                type="text"
                required
                className="w-full mt-1 px-3 py-3 border border-gray-300 text-black rounded-md"
                placeholder="Ej: Consulta sobre un producto"
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
              />
            </div>


            {/* Mensaje */}
            <div>
              <label className="text-gray-700 text-sm">Tu Mensaje</label>
              <textarea
                required
                rows={5}
                className="w-full mt-1 px-3 py-3 border border-gray-300 text-black rounded-md resize-none"
                placeholder="Escribe tu mensaje aquí..."
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
              />
            </div>

            {/* Privacidad */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                required
                className="mt-1"
                checked={aceptaPrivacidad}
                onChange={(e) => setAceptaPrivacidad(e.target.checked)}
              />
              <label className="text-gray-700 text-sm">
                Acepto la política de privacidad y el tratamiento de mis datos personales
              </label>
            </div>
           

            {/* Error */}
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            {/* Botón Enviar Mensaje*/}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
            >
              Enviar Mensaje
            </button>

          </form>
        </div>
      </div>
      <FooterGrande />
    </>
  );
}
