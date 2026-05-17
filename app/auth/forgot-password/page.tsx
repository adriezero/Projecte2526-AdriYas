"use client";
import { useForgotPassword } from "@hooks/useForgotPassword";
import { useTranslations } from "next-intl";
import { Input, Alert, Button } from "@componentes/ui";

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
            <Alert variant="success">
              <p className="font-bold">{t('successTitle')}</p>
              <p className="text-sm">{t('successMessage')}</p>
            </Alert>
          ) : (
            <form className="mt-6 space-y-5" onSubmit={manejarEnvio}>
              <Input
                type="email"
                required
                label={t('email')}
                placeholder={t('emailPlaceholder')}
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />

              {error && <Alert variant="error">{error}</Alert>}

              <Button
                type="submit"
                disabled={cargando}
                variant="primary"
                className="w-full"
              >
                {cargando ? t('sending') : t('submit')}
              </Button>

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
