import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function useLoginForm() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [mostrarClave, setMostrarClave] = useState(false);

  return { correo, setCorreo, clave, setClave, mostrarClave, setMostrarClave };
}

export function useAuth() {
  const [error, setError] = useState("");
  const router = useRouter();

  const login = async (correo: string, clave: string) => {
    setError("");
    const resultado = await signIn("credentials", { correo, clave, redirect: false });
    
    if (resultado?.error) {
      setError("Correo o contraseña incorrectos.");
    } else if (resultado?.ok) {
      const res = await fetch('/api/auth/session');
      const session = await res.json();
      const rutas: Record<string, string> = {
        administrador: "/admin/gestionUsers",
        dispatcher: "/dispatcher",
        cliente: "/home"
      };
      router.push(rutas[session?.user?.role] || "/home");
    }
  };

  return { error, login };
}

export function useLogin() {
  const formState = useLoginForm();
  const { error, login } = useAuth();

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(formState.correo, formState.clave);
  };

  return { ...formState, error, manejarEnvio };
}
