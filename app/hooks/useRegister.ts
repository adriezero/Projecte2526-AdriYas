import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export function useRegister() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");
  const [rol, setRol] = useState("");
  const [mostrarClave, setMostrarClave] = useState(false);
  const [mostrarConfirmarClave, setMostrarConfirmarClave] = useState(false);
  const [error, setError] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  const manejarEnvio = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmarContraseña) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password, rol }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setMostrarModal(true);
      } else {
        const data = await res.json();
        setError(data.error || "Error al registrarse. Inténtelo de nuevo.");
      }
    } catch {
      setError("Error de conexión.");
    }
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmarContraseña,
    setConfirmarContraseña,
    rol,
    setRol,
    mostrarClave,
    setMostrarClave,
    mostrarConfirmarClave,
    setMostrarConfirmarClave,
    error,
    manejarEnvio,
    mostrarModal,
    setMostrarModal,
  };
}
