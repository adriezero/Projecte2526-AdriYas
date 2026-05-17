"use client";
import { useLogin } from "@hooks/useLogin";
import { useTranslations } from "next-intl";
import { Input, PasswordInput, Alert, Button, Separator } from "@componentes/ui";

export default function IniciarSesion() {
  const t = useTranslations('auth.login');
  const {
    correo,
    setCorreo,
    clave,
    setClave,
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
            <Input
              type="email"
              required
              label={t('user')}
              placeholder={t('emailPlaceholder')}
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />

            <PasswordInput
              label={t('password')}
              placeholder={t('passwordPlaceholder')}
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              required
            />

            {error && <Alert variant="error">{error}</Alert>}

            {/* Olvidaste la contraseña */}
            <div className="py-2 text-center">
              <a href="/auth/forgot-password" className="text-primary text-sm hover:text-accent-orange transition-colors cursor-pointer">
                {t('forgotPassword')}
              </a>
            </div>

            <Button type="submit" variant="primary" className="w-full">
              {t('submit')}
            </Button>

            <Separator />

            {/* Texto: No tienes cuenta */}
            <h2 className="text-center text-xl font-medium text-text pb-4">
              {t('noAccount')}
            </h2>

            <a href="/auth/register" className="block">
              <Button variant="secondary" className="w-full">
                {t('registerButton')}
              </Button>
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}
