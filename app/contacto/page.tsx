"use client";
import { useState } from "react";

export default function Contacto() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false);
  const [error, setError] = useState("");

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-5xl w-full">
        {/* Título */}
        <div className="text-center pb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Contáctanos
          </h2>
          <p className="text-gray-600">¡Nos encantaría escuchar de ti! Envíanos un mensaje y te responderemos a la brevedad.</p>
        </div>

        {/* Formulario */}
        <form className="bg-white p-8 rounded-lg shadow-md space-y-5" onSubmit={manejarEnvio}>
          {/* Usuario */}
          <div className="py-2">
            <label className="text-gray-700 text-sm">Nombre completo:</label>
            <input
              type="text"
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 text-black rounded-md"
              placeholder="Ej: Marcos Peña"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="py-2">
            <label className="text-gray-700 text-sm">Correo electrónico:</label>
            <input
              type="email"
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 text-black rounded-md"
              placeholder="Ej: tu.correo@ejemplo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          {/* Asunto */}
          <div className="py-2">
            <label className="text-gray-700 text-sm">Asunto:</label>
            <input
              type="text"
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 text-black rounded-md"
              placeholder="Ej: Consulta sobre un producto"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
            />
          </div>

          {/* Mensaje */}
          <div className="py-2">
            <label className="text-gray-700 text-sm">Tu mensaje:</label>
            <textarea
              required
              rows={5}
              className="w-full mt-1 px-3 py-2 border border-gray-300 text-black rounded-md resize-none"
              placeholder="Escribe tu mensaje aquí..."
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
            />
          </div>

          {/* Privacidad */}
          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              required
              checked={aceptaPrivacidad}
              onChange={(e) => setAceptaPrivacidad(e.target.checked)}
              id="privacidad"
            />
            <label className="text-gray-700 text-sm" htmlFor="privacidad">
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
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
          >
            Enviar mensaje
          </button>
        </form>
      </div>
    </div>
  );
}
