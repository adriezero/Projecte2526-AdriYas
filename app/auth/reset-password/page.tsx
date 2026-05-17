"use client";
import { useResetPassword } from "@hooks/useResetPassword";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import PasswordChecklist from "react-password-checklist";
import { useTranslations } from "next-intl";

function ResetPasswordForm() {
  const t = useTranslations('auth.resetPassword');
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [passwordValida, setPasswordValida] = useState(false);

  const {
    clave,
    setClave,
    confirmarClave,
    setConfirmarClave,
    mostrarClave,
    setMostrarClave,
    error,
    exito,
    cargando,
    manejarEnvio,
  } = useResetPassword(token);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
          {t('invalidToken')}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[url('/img/loginBackground.png')] bg-center bg-cover">
      <div className="grow flex items-center justify-center bg-gray-50 px-4 py-6 md:w-150 md:h-180 md:border md:px-0 md:py-0">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-center text-4xl font-extrabold text-gray-900 font-arsenal uppercase">
              {t('title')}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
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
              <div className="py-2">
                <label className="text-gray-700">{t('newPassword')}</label>
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

              <div className="py-2">
                <label className="text-gray-700">{t('confirmPassword')}</label>
                <input
                  type={mostrarClave ? "text" : "password"}
                  required
                  className="w-full mt-1 px-3 py-2 border border-border text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder={t('confirmPasswordPlaceholder')}
                  value={confirmarClave}
                  onChange={(e) => setConfirmarClave(e.target.value)}
                />
              </div>

              {clave.length > 0 && !passwordValida && (
                <div className="text-text border-red-400 bg-red-50 border rounded-lg">
                  <PasswordChecklist
                    rules={["minLength", "specialChar", "number", "capital", "match"]}
                    minLength={8}
                    value={clave}
                    valueAgain={confirmarClave}
                    onChange={(isValid) => setPasswordValida(isValid)}
                    className="text-sm"
                    iconComponents={{
                      ValidIcon: <i className="bi bi-check-circle-fill text-green-500 px-1.5"></i>,
                      InvalidIcon: <i className="bi bi-x-circle-fill text-red-500 px-1.5"></i>
                    }}
                    messages={{
                      minLength: t('passwordMinLength'),
                      specialChar: t('passwordSpecialChar'),
                      number: t('passwordNumber'),
                      capital: t('passwordCapital'),
                      match: t('passwordMatch'),
                    }}
                  />
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={cargando || !passwordValida}
                className="w-full py-3 px-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg cursor-pointer font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {cargando ? t('processing') : t('submit')}
              </button>

              <div className="text-center">
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

export default function RestablecerContrasena() {
  const t = useTranslations('auth.resetPassword');
  return (
    <Suspense fallback={<div>{t('loading')}</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
