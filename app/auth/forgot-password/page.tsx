"use client";
import { useForgotPassword } from "@hooks/useForgotPassword";

export default function OlvidasteContrasena() {
  const { correo, setCorreo, error, exito, cargando, manejarEnvio } = useForgotPassword();

  return (
    <div className="min-h-screen flex flex-col bg-[url('/img/camion.png')] bg-center bg-cover">
      <div className="w-150 h-180 border grow flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-center text-4xl font-extrabold text-gray-900">
              Recuperar contraseña
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </p>
          </div>

          {exito ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              <p className="font-bold">¡Correo enviado!</p>
              <p className="text-sm">Revisa tu bandeja de entrada para restablecer tu contraseña.</p>
            </div>
          ) : (
            <form className="mt-6 space-y-5" onSubmit={manejarEnvio}>
              <div className="py-2">
                <label className="text-gray-700">Correo electrónico</label>
                <input
                  type="email"
                  required
                  className="w-full mt-1 px-3 py-2 border border-gray-300 text-black rounded-md"
                  placeholder="tu@correo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={cargando}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer disabled:bg-gray-400"
              >
                {cargando ? "Enviando..." : "Enviar enlace de recuperación"}
              </button>

              <div className="text-center">
                <a href="/auth/login" className="text-blue-600 text-sm hover:underline cursor-pointer">
                  Volver al inicio de sesión
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
