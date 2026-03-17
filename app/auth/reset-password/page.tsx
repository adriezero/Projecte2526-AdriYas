"use client";
import { useResetPassword } from "@hooks/useResetPassword";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import PasswordChecklist from "react-password-checklist";

function ResetPasswordForm() {
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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Token inválido o faltante
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[url('/img/camion.png')] bg-center bg-cover">
      <div className="w-150 h-180 border grow flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-center text-4xl font-extrabold text-gray-900">
              Restablecer contraseña
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Ingresa tu nueva contraseña
            </p>
          </div>

          {exito ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              <p className="font-bold">¡Contraseña restablecida!</p>
              <p className="text-sm">Redirigiendo al inicio de sesión...</p>
            </div>
          ) : (
            <form className="mt-6 space-y-5" onSubmit={manejarEnvio}>
              <div className="py-2">
                <label className="text-gray-700">Nueva contraseña</label>
                <div className="relative">
                  <input
                    type={mostrarClave ? "text" : "password"}
                    required
                    className="w-full mt-1 px-3 py-2 pr-10 border border-gray-300 text-black rounded-md"
                    placeholder="Contraseña"
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarClave(!mostrarClave)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 bg-gray-200 px-2 py-1 rounded cursor-pointer"
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
                <label className="text-gray-700">Confirmar contraseña</label>
                <input
                  type={mostrarClave ? "text" : "password"}
                  required
                  className="w-full mt-1 px-3 py-2 border border-gray-300 text-black rounded-md"
                  placeholder="Confirmar contraseña"
                  value={confirmarClave}
                  onChange={(e) => setConfirmarClave(e.target.value)}
                />
              </div>

              {clave.length > 0 && !passwordValida && (
                <div className="text-black border-red-600 bg-red-100 border border-dashed rounded-md">
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
                      minLength: "La contraseña tiene más de 8 caracteres.",
                      specialChar: "La contraseña tiene caracteres especiales.",
                      number: "La contraseña tiene un número.",
                      capital: "La contraseña tiene una letra mayúscula.",
                      match: "Las contraseñas coinciden.",
                    }}
                  />
                </div>
              )}

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={cargando || !passwordValida}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer disabled:bg-gray-400"
              >
                {cargando ? "Procesando..." : "Restablecer contraseña"}
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

export default function RestablecerContrasena() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
