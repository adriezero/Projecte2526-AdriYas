"use client";
import { useForgotPassword } from "@hooks/useForgotPassword";
import { useTranslations } from "next-intl";

export default function OlvidasteContrasena() {
  const t = useTranslations('auth.forgotPassword');
  const { correo, setCorreo, error, exito, cargando, manejarEnvio } = useForgotPassword();

  return (
    <div className="min-h-screen flex flex-col bg-[url('/img/loginBackground.png')] bg-center bg-cover">
      <div className="grow flex items-center justify-center bg-gray-50 px-4 py-6 md:w-150 md:h-180 md:border md:px-0 md:py-0">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-center text-4xl font-extrabold py-2 text-gray-900 font-arsenal uppercase">
              {t('title')}
            </h2>
            <p className="py-2 mt-2 text-center text-sm text-gray-600">
              {t('description')}
            </p>
          </div>

          {exito ? (
            <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              <p className="font-bold">{t('successTitle')}</p>
              <p className="text-sm">{t('successMessage')}</p>
            </div>
          ) : (
            <form className="mt-6 space-y-5" onSubmit={manejarEnvio}>
              <div className="py-4">
                <label className="text-gray-700">{t('email')}</label>
                <input
                  type="email"
                  required
                  className="w-full mt-1 px-3 py-2 border border-border text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder={t('emailPlaceholder')}
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={cargando}
                className="w-full py-3 px-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg cursor-pointer font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {cargando ? t('sending') : t('submit')}
              </button>

              <div className="text-center py-4">
                <a href="/auth/login" className="text-primary text-sm hover:text-accent-orange transition-colors cursor-pointer">
                  {t('backToLogin')}
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
