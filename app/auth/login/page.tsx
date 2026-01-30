"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function IniciarSesion() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const resultado = await signIn("credentials", {
      correo,
      clave,
      redirect: false,
    });

    if (resultado?.error) {
      setError("Correo o contraseña incorrectos");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div>
   <div className="w-150 h-180 border-1 flex items-center justify-center bg-gray-50">

  <div className="max-w-md w-full space-y-8">

    {/* Título */}
    <div>
      <h2 className="text-center  text-4xl font-extrabold text-gray-900">
        Iniciar sesión
      </h2>
    </div>

    {/* Formulario */}
    <form className="mt-6 space-y-5" onSubmit={manejarEnvio}>

      {/* Usuario */}
      <div>
        <label className="text-gray-700 text-sm">Usuario</label>
        <input
          type="email"
          required
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
      </div>

      {/* Contraseña */}
      <div>
        <label className="text-gray-700 text-sm">Contraseña</label>
        <input
          type="password"
          required
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Contraseña"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="text-red-500 text-sm text-center">{error}</div>
      )}

      {/* Olvidaste la contraseña */}
      <div>
        <a className="text-blue-600 text-sm hover:underline cursor-pointer">
          ¿Olvidaste la contraseña?
        </a>
      </div>

      {/* Botón iniciar sesión */}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Iniciar sesión
      </button>

      {/* Separador */}
      <div className="flex items-center justify-center">
        <hr className="w-full border-gray-300" />
      </div>

      {/* Texto: No tienes cuenta */}
      <h2 className="text-center text-2xl font-semibold text-gray-800">
        ¿No tienes cuenta? Regístrate.
      </h2>

      {/* Botón registro */}
      <button
        type="button"
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Registrarse
      </button>

    </form>
  </div>
 
 
</div>
{/* FOOTER */}
<footer className=" border w-full h-20 flex justify-center items-center font-bold bg-gray-200 text-center text-gray-700">
  Copyright © 2025 TruckWave
</footer>
  </div>

  );
}
