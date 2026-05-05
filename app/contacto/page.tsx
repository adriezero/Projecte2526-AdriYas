"use client";
import { useState } from "react";
import { useTranslations } from 'next-intl';

export default function Contacto() {
  const t = useTranslations('contact');
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
            {t('title')}
          </h2>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Formulario */}
        <form className="bg-white p-8 rounded-lg shadow-md space-y-5" onSubmit={manejarEnvio}>
          {/* Usuario */}
          <div className="py-2">
            <label className="text-gray-700 text-sm">{t('fullName')}</label>
            <input
              type="text"
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 text-black rounded-md"
              placeholder={t('fullNamePlaceholder')}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="py-2">
            <label className="text-gray-700 text-sm">{t('email')}</label>
            <input
              type="email"
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 text-black rounded-md"
              placeholder={t('emailPlaceholder')}
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          {/* Asunto */}
          <div className="py-2">
            <label className="text-gray-700 text-sm">{t('subject')}</label>
            <input
              type="text"
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 text-black rounded-md"
              placeholder={t('subjectPlaceholder')}
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
            />
          </div>

          {/* Mensaje */}
          <div className="py-2">
            <label className="text-gray-700 text-sm">{t('message')}</label>
            <textarea
              required
              rows={5}
              className="w-full mt-1 px-3 py-2 border border-gray-300 text-black rounded-md resize-none"
              placeholder={t('messagePlaceholder')}
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
              {t('privacy')}
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
            {t('send')}
          </button>
        </form>
      </div>
    </div>
  );
}
