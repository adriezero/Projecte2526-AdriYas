import { useState } from "react";
import { useRouter } from "next/navigation";

export function useResetPassword(token: string) {
  const [clave, setClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");
  const [mostrarClave, setMostrarClave] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setExito(false);

    if (clave !== confirmarClave) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (clave.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setCargando(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, clave }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al restablecer la contraseña");
      } else {
        setExito(true);
        setTimeout(() => router.push("/auth/login"), 3000);
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  };

  return {
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
  };
}
