"use client";
import { useResetPassword } from "@hooks/useResetPassword";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import PasswordChecklist from "react-password-checklist";
import { useTranslations } from "next-intl";
import { PasswordInput, Input, Alert, Button } from "@componentes/ui";

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
    error,
    exito,
    cargando,
    manejarEnvio,
  } = useResetPassword(token);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Alert variant="error">{t('invalidToken')}</Alert>
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
            <Alert variant="success">
              <p className="font-bold">{t('successTitle')}</p>
              <p className="text-sm">{t('successMessage')}</p>
            </Alert>
          ) : (
            <form className="mt-6 space-y-5" onSubmit={manejarEnvio}>
              <PasswordInput
                label={t('newPassword')}
                placeholder={t('passwordPlaceholder')}
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                required
              />

              <Input
                type="password"
                required
                label={t('confirmPassword')}
                placeholder={t('confirmPasswordPlaceholder')}
                value={confirmarClave}
                onChange={(e) => setConfirmarClave(e.target.value)}
              />

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

              {error && <Alert variant="error">{error}</Alert>}

              <Button
                type="submit"
                disabled={cargando || !passwordValida}
                variant="primary"
                className="w-full"
              >
                {cargando ? t('processing') : t('submit')}
              </Button>

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
