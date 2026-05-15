export type Usuario = {
  ID: number;
  Nombre: string;
  Email: string | null;
  tipo: string;
  Estado?: string;
  EstadoCuenta?: string;
  Disponible?: boolean;
};

export type ColOrdenable = "Nombre" | "Email" | "tipo";

export function getEstado(u: Usuario): string | null {
  if (u.Estado) return u.Estado;
  if (u.EstadoCuenta) return u.EstadoCuenta;
  if (u.Disponible !== undefined) return u.Disponible ? "Activo" : "Inactivo";
  return null;
}

export function ordenarUsuarios(
  usuarios: Usuario[],
  col: ColOrdenable | null,
  dir: "asc" | "desc"
): Usuario[] {
  if (!col) return usuarios;
  return [...usuarios].sort((a, b) => {
    const va = (a[col] || "").toString().toLowerCase();
    const vb = (b[col] || "").toString().toLowerCase();
    return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
  });
}

export async function fetchUsuarios(
  pagina: number,
  busqueda: string,
  rol: string,
  estado: string
) {
  const params = new URLSearchParams({
    pagina: String(pagina),
    busqueda,
    rol,
    estado,
  });
  const res = await fetch(`/api/auth/usuarios?${params}`);
  return res.json();
}

export async function fetchUsuarioDetalle(tipo: string, id: number) {
  const res = await fetch(`/api/auth/usuarios/${tipo}/${id}`);
  return res.json();
}

export async function actualizarUsuario(
  tipo: string,
  id: number,
  campos: Record<string, unknown>
) {
  await fetch(`/api/auth/usuarios/${tipo}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(campos),
  });
}

export async function eliminarUsuario(tipo: string, id: number) {
  await fetch(`/api/auth/usuarios/${tipo}/${id}`, {
    method: "DELETE",
  });
}

export async function bloquearUsuario(tipo: string, id: number) {
  await actualizarUsuario(tipo, id, {
    EstadoCuenta: "Bloqueado",
    Estado: "Bloqueado",
    Disponible: false,
  });
}

export async function desbloquearUsuario(tipo: string, id: number) {
  await actualizarUsuario(tipo, id, {
    EstadoCuenta: "Disponible",
    Estado: "Disponible",
    Disponible: true,
  });
}
