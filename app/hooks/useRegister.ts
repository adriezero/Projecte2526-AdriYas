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

  const manejarEnvio = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmarContraseña) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        router.push("/auth/login");
      } else {
        setError("Error al registrarse");
      }
    } catch (err) {
      setError("Error de conexión");
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
  };
}
