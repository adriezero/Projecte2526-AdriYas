import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ROLE_ROUTES } from "@lib/roles";

export function useLoginForm() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [mostrarClave, setMostrarClave] = useState(false);

  return { correo, setCorreo, clave, setClave, mostrarClave, setMostrarClave };
}

export function useAuth() {
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const login = async (correo: string, clave: string) => {
    setError("");
    const resultado = await signIn("credentials", { correo, clave, redirect: false });
    
    if (resultado?.error) {
      setError("Correo o contraseña incorrectos.");
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      const callbackUrl = searchParams.get("callbackUrl");
      const defaultRoute = session.user.role ? ROLE_ROUTES[session.user.role] : undefined;
      router.push(callbackUrl || defaultRoute || "/home");
    }
  }, [status, session, router, searchParams]);

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
