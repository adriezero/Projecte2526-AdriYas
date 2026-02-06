"use client";
import { useLogin } from "@hooks/useLogin";

export default function IniciarSesion() {
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
    <div className="min-h-screen flex flex-col bg-[url('/img/camion.png')] bg-center bg-cover">
      <div className="w-150 h-180 border grow flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 gap-24">
          {/* Título */}
          <div>
            <h2 className="text-center text-4xl font-extrabold text-gray-900">
              Iniciar sesión
            </h2>
          </div>

          {/* Formulario */}
          <form className="mt-6 space-y-5" onSubmit={manejarEnvio}>
            {/* Usuario */}
            <div className="py-2">
              <label className="text-gray-700">Usuario</label>
              <input
                type="email"
                required
                className="w-full mt-1 px-3 py-2 border border-gray-300 text-black rounded-md"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>

            {/* Contraseña */}
            <div className="py-2">
              <label className="text-gray-700">Contraseña</label>
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

            {/* Error */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Olvidaste la contraseña */}
            <div className="py-2 text-center">
              <a className="text-blue-600 text-sm hover:underline cursor-pointer">
                ¿Olvidaste la contraseña?
              </a>
            </div>

            {/* Botón iniciar sesión */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
            >
              Iniciar sesión
            </button>

            {/* Separador */}
            <div className="flex items-center justify-center py-4 gap-2">
              <hr className="flex-1 border-black" />
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
              </div>
              <hr className="flex-1 border-black" />
            </div>

            {/* Texto: No tienes cuenta */}
            <h2 className="text-center text-2xl font-semibold text-gray-800">
              ¿No tienes cuenta? Regístrate.
            </h2>

            {/* Botón registro */}
            <a href="/auth/register"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer block text-center">
              Registrarse
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}
