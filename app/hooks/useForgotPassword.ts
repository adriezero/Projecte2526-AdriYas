import { useState } from "react";

export function useForgotPassword() {
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setExito(false);
    setCargando(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al enviar el correo");
      } else {
        setExito(true);
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  };

  return { correo, setCorreo, error, exito, cargando, manejarEnvio };
}
