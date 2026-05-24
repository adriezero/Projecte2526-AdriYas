"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function Contacto() {
  const t = useTranslations("contact");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [fechaServicio, setFechaServicio] = useState("");
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false);
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/solicitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente: nombre,
          tipo: "Contacto",
          asunto,
          descripcion: `Email: ${correo}\n\n${mensaje}`,
          estado: "Pendiente",
          fechaServicio: fechaServicio || null,
        }),
      });
      if (!res.ok) throw new Error();
      setEnviado(true);
      setNombre(""); setCorreo(""); setAsunto(""); setMensaje(""); setFechaServicio(""); setAceptaPrivacidad(false);
    } catch {
      setError("Error al enviar el mensaje. Inténtalo de nuevo.");
    }
  };

  const inputClass =
    "w-full px-5 py-4 text-lg text-[#2C2C2C] bg-white border-2 border-[#E8E8E8] rounded-2xl placeholder:text-[#C0C0C0] focus:outline-none focus:border-[#F47C20] focus:bg-[#FFFAF6] transition-all duration-200";

  return (
    <>
    <div className="min-h-screen bg-linear-to-br from-[#EEF2F7] via-bg to-[#E8EDF5] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center pb-10">
          <h2 className="text-4xl pt-10 md:text-5xl font-extrabold text-[#1a1a2e] leading-tight mt-3 mb-2 font-arsenal">
            {t("title")}
          </h2>
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-accent-orange mb-4 bg-accent-orange/10 px-4 py-1.5 rounded-full">
            {t("subtitle")}
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-primary/10 border border-white overflow-hidden">

          {/* Franja superior */}
          <div className="h-1.5 bg-linear-to-r from-accent-orange via-primary to-accent-orange" />

          <div className="grid md:grid-cols-5 min-h-150">
            {/* Panel lateral izquierdo */}
            <div className="md:col-span-2 bg-linear-to-b from-primary to-[#163d60] p-12 flex flex-col justify-between text-white">
              <div>
                <h3 className="text-2xl font-bold mb-2">Información de contacto</h3>
                <p className="text-white/60 text-sm pb-8">Estamos aquí para ayudarte</p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm text-white/80">info@truckwave.com</span>
                  </div>

                  <div className="flex items-center gap-4 py-8">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <span className="text-sm text-white/80">+34 900 123 456</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="text-sm text-white/80">BARCELONA, España</span>
                  </div>
                </div>
              </div>

              {/* Círculos decorativos */}
              <div className="relative mt-10 h-24">
                <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-white/5 -mb-10 -mr-10" />
                <div className="absolute bottom-0 right-0 w-20 h-20 rounded-full bg-accent-orange/20 -mb-4 mr-4" />
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={manejarEnvio} className="md:col-span-3 px-12 py-14 md:px-16 md:py-16 space-y-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2 pb-4">
                  <label htmlFor="nombre" className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">
                    {t("fullName")}
                  </label>
                  <input
                    id="nombre" type="text" required
                    placeholder={t("fullNamePlaceholder")}
                    value={nombre} onChange={(e) => setNombre(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-2 pb-4">
                  <label htmlFor="correo" className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">
                    {t("email")}
                  </label>
                  <input
                    id="correo" type="email" required
                    placeholder={t("emailPlaceholder")}
                    value={correo} onChange={(e) => setCorreo(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 pb-4">
                <label htmlFor="asunto" className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">
                  {t("subject")}
                </label>
                <input
                  id="asunto" type="text" required
                  placeholder={t("subjectPlaceholder")}
                  value={asunto} onChange={(e) => setAsunto(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-2 pb-4">
                <label htmlFor="mensaje" className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">
                  {t("message")}
                </label>
                <textarea
                  id="mensaje" required rows={6}
                  placeholder={t("messagePlaceholder")}
                  value={mensaje} onChange={(e) => setMensaje(e.target.value)}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex flex-col gap-2 pb-4">
                <label htmlFor="fechaServicio" className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">
                  Fecha de servicio (opcional)
                </label>
                <input
                  id="fechaServicio" type="date"
                  value={fechaServicio} onChange={(e) => setFechaServicio(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="flex items-start gap-2 py-4">
                <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                  <input
                    type="checkbox" id="privacidad" required
                    checked={aceptaPrivacidad}
                    onChange={(e) => setAceptaPrivacidad(e.target.checked)}
                    className="peer appearance-none w-5 h-5 border-2 border-[#E8E8E8] rounded-md bg-white checked:bg-accent-orange checked:border-accent-orange focus:outline-none transition-all duration-150 cursor-pointer"
                  />
                  <svg
                    className="absolute w-3 h-3 text-white pointer-events-none hidden peer-checked:block"
                    viewBox="0 0 12 10" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <polyline points="1 5 4.5 8.5 11 1" />
                  </svg>
                </div>
                <label htmlFor="privacidad" className="text-sm text-[#6B7280] leading-relaxed cursor-pointer select-none">
                  {t("privacy")}
                </label>
                <br />
              </div>

              {error && <p className="text-sm text-red-500 text-center">{error}</p>}

              <button
                type="submit"
                className="w-full py-4 px-6 bg-linear-to-r from-accent-orange to-[#e06a10] text-white text-base font-bold rounded-2xl hover:shadow-lg hover:shadow-accent-orange/30 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none transition-all duration-200 tracking-wide cursor-pointer"
              >
                {t("send")} <span className="text-xl"><i className="bi bi-arrow-right"></i></span>
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>

      {/* Modal éxito */}
      {enviado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-sm w-full mx-4 flex flex-col items-center gap-5 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#1a1a2e]">¡Mensaje enviado!</h3>
            <p className="text-sm text-[#6B7280]">Hemos recibido tu mensaje correctamente. Nos pondremos en contacto contigo pronto.</p>
            <button
              onClick={() => setEnviado(false)}
              className="mt-2 px-8 py-3 bg-linear-to-r from-accent-orange to-[#e06a10] text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-accent-orange/30 transition-all duration-200 cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
