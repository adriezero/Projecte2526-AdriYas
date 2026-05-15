"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function Contacto() {
  const t = useTranslations("contact");
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
    <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#F47C20] mb-3">
            {t("subtitle")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C2C2C] leading-tight">
            {t("title")}
          </h2>
          <div className="mt-4 mx-auto w-10 h-0.5 bg-[#F47C20] rounded-full" />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#A6A6A6]/20 overflow-hidden">

          {/* Franja superior decorativa */}
          <div className="h-1 bg-[#1F4E79]" />

          <form onSubmit={manejarEnvio} className="px-6 py-8 md:px-10 md:py-10 space-y-6">

            {/* Fila: Nombre + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="nombre"
                  className="text-xs font-semibold uppercase tracking-wide text-[#2C2C2C]/60"
                >
                  {t("fullName")}
                </label>
                <input
                  id="nombre"
                  type="text"
                  required
                  placeholder={t("fullNamePlaceholder")}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm text-[#2C2C2C] bg-[#F2F2F2] border border-[#A6A6A6]/40 rounded-xl placeholder:text-[#A6A6A6] focus:outline-none focus:ring-2 focus:ring-[#1F4E79]/30 focus:border-[#1F4E79] transition-all duration-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="correo"
                  className="text-xs font-semibold uppercase tracking-wide text-[#2C2C2C]/60"
                >
                  {t("email")}
                </label>
                <input
                  id="correo"
                  type="email"
                  required
                  placeholder={t("emailPlaceholder")}
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm text-[#2C2C2C] bg-[#F2F2F2] border border-[#A6A6A6]/40 rounded-xl placeholder:text-[#A6A6A6] focus:outline-none focus:ring-2 focus:ring-[#1F4E79]/30 focus:border-[#1F4E79] transition-all duration-200"
                />
              </div>
            </div>

            {/* Asunto */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="asunto"
                className="text-xs font-semibold uppercase tracking-wide text-[#2C2C2C]/60"
              >
                {t("subject")}
              </label>
              <input
                id="asunto"
                type="text"
                required
                placeholder={t("subjectPlaceholder")}
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                className="w-full px-4 py-2.5 text-sm text-[#2C2C2C] bg-[#F2F2F2] border border-[#A6A6A6]/40 rounded-xl placeholder:text-[#A6A6A6] focus:outline-none focus:ring-2 focus:ring-[#1F4E79]/30 focus:border-[#1F4E79] transition-all duration-200"
              />
            </div>

            {/* Mensaje */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="mensaje"
                className="text-xs font-semibold uppercase tracking-wide text-[#2C2C2C]/60"
              >
                {t("message")}
              </label>
              <textarea
                id="mensaje"
                required
                rows={5}
                placeholder={t("messagePlaceholder")}
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                className="w-full px-4 py-2.5 text-sm text-[#2C2C2C] bg-[#F2F2F2] border border-[#A6A6A6]/40 rounded-xl placeholder:text-[#A6A6A6] resize-none focus:outline-none focus:ring-2 focus:ring-[#1F4E79]/30 focus:border-[#1F4E79] transition-all duration-200"
              />
            </div>

            {/* Privacidad */}
            <div className="flex items-start gap-3">
              <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  id="privacidad"
                  required
                  checked={aceptaPrivacidad}
                  onChange={(e) => setAceptaPrivacidad(e.target.checked)}
                  className="peer appearance-none w-4 h-4 border border-[#A6A6A6] rounded bg-[#F2F2F2] checked:bg-[#1F4E79] checked:border-[#1F4E79] focus:outline-none focus:ring-2 focus:ring-[#1F4E79]/30 transition-all duration-150 cursor-pointer"
                />
                <svg
                  className="absolute w-2.5 h-2.5 text-white pointer-events-none hidden peer-checked:block"
                  viewBox="0 0 12 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="1 5 4.5 8.5 11 1" />
                </svg>
              </div>
              <label
                htmlFor="privacidad"
                className="text-sm text-[#2C2C2C]/70 leading-relaxed cursor-pointer select-none"
              >
                {t("privacy")}
              </label>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {/* Botón */}
            <button
              type="submit"
              className="w-full py-3 px-6 bg-[#1F4E79] text-white text-sm font-semibold rounded-xl hover:bg-[#163d60] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#1F4E79]/40 transition-all duration-200 tracking-wide cursor-pointer"
            >
              {t("send")}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
