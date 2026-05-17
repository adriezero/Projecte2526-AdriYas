"use client";
import { useLogin } from "@hooks/useLogin";
import { useTranslations } from "next-intl";

export default function IniciarSesion() {
  const t = useTranslations('auth.login');
  const {
    // Campos del form
    correo,
    setCorreo,
    clave,
    setClave,
    // Para poder cambiar el estado de ver o no la contraseña
    mostrarClave,
    setMostrarClave,
    // Error & handlers
    error,
    manejarEnvio,
  } = useLogin();

  return (
    <div className="min-h-screen flex flex-col bg-[url('/img/loginBackground.png')] bg-center bg-cover">
      <div className="grow flex items-center justify-center bg-gray-50 px-4 py-6 md:w-150 md:h-180 md:border md:px-0 md:py-0">
        <div className="max-w-md w-full space-y-8 gap-24">
          {/* Título */}
          <div>
            <h2 className="text-center text-4xl font-extrabold text-gray-900 font-arsenal uppercase">
              {t('title')}
            </h2>
          </div>

          {/* Formulario */}
          <form className="mt-6 space-y-5" onSubmit={manejarEnvio}>
            {/* Usuario */}
            <div className="py-2">
              <label className="text-gray-700">{t('user')}</label>
              <input
                type="email"
                required
                className="w-full mt-1 px-3 py-2 border border-border text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder={t('emailPlaceholder')}
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>

            {/* Contraseña */}
            <div className="py-2">
              <label className="text-gray-700">{t('password')}</label>
              <div className="relative">
                <input
                  type={mostrarClave ? "text" : "password"}
                  required
                  className="w-full mt-1 px-3 py-2 pr-10 border border-border text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder={t('passwordPlaceholder')}
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setMostrarClave(!mostrarClave)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-text/60 hover:text-primary bg-gray-200 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  {mostrarClave ? (
                    <i className="bi bi-eye text-xl"></i>
                  ) : (
                    <i className="bi bi-eye-slash text-xl"></i>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Olvidaste la contraseña */}
            <div className="py-2 text-center">
              <a href="/auth/forgot-password" className="text-primary text-sm hover:text-accent-orange transition-colors cursor-pointer">
                {t('forgotPassword')}
              </a>
            </div>

            {/* Botón iniciar sesión */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg cursor-pointer font-medium"
            >
              {t('submit')}
            </button>

            {/* Separador */}
            <div className="flex items-center justify-center py-4 gap-2">
              <hr className="flex-1 border-border" />
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-accent-orange rounded-full"></span>
                <span className="w-1.5 h-1.5 bg-accent-yellow rounded-full"></span>
                <span className="w-1.5 h-1.5 bg-accent-orange rounded-full"></span>
              </div>
              <hr className="flex-1 border-border" />
            </div>

            {/* Texto: No tienes cuenta */}
            <h2 className="text-center text-xl font-medium text-text pb-4">
              {t('noAccount')}
            </h2>

            {/* Botón registro */}
            <a href="/auth/register"
              className="w-full py-3 px-4 bg-accent-orange text-white rounded-xl hover:bg-accent-orange/90 transition-all shadow-md hover:shadow-lg cursor-pointer block text-center font-medium">
              {t('registerButton')}
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}
