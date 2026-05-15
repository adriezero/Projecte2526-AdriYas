"use client";
import "@css/globals.css";
import { useEffect, useState } from "react";
import { ROLES_FILTRO } from "@lib/roles";
import {
  type Usuario,
  type ColOrdenable,
  getEstado,
  ordenarUsuarios,
  fetchUsuarios,
  fetchUsuarioDetalle,
  actualizarUsuario,
  eliminarUsuario,
  bloquearUsuario,
  desbloquearUsuario,
} from "./logic";

const ROLES = ROLES_FILTRO;
const ESTADOS = ["Todos", "Activo", "Inactivo", "suspendido", "Pendiente"];

export default function GestionUsersPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalUsuarios, setTotalUsuarios] = useState(0);

  const [pagina, setPagina] = useState(1);

  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("Todos");
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  const [busquedaAplicada, setBusquedaAplicada] = useState("");
  const [rolAplicado, setRolAplicado] = useState("Todos");
  const [estadoAplicado, setEstadoAplicado] = useState("Todos");

  const [dropRol, setDropRol] = useState(false);
  const [dropEstado, setDropEstado] = useState(false);

  const [modalBorrar, setModalBorrar] = useState<{
    id: number;
    tipo: string;
    nombre: string;
  } | null>(null);

  const [menuAbierto, setMenuAbierto] = useState<string | null>(null);

  const [modalBloquear, setModalBloquear] = useState<{
    id: number;
    tipo: string;
    nombre: string;
  } | null>(null);

  const [modalEditar, setModalEditar] = useState<
    (Usuario & Record<string, unknown>) | null
  >(null);
  const [guardando, setGuardando] = useState(false);

  async function abrirEditar(usuario: Usuario) {
    const data = await fetchUsuarioDetalle(usuario.tipo, usuario.ID);
    setModalEditar(data);
  }

  async function guardarEdicion() {
    if (!modalEditar) return;
    setGuardando(true);
    const { ID, tipo, resetToken, resetTokenExpiry, Contrase_a, ...campos } =
      modalEditar as Record<string, unknown>;
    void ID;
    void tipo;
    void resetToken;
    void resetTokenExpiry;
    void Contrase_a;
    await actualizarUsuario(modalEditar.tipo, modalEditar.ID, campos);
    setUsuarios((prev) =>
      prev.map((u) =>
        u.ID === modalEditar.ID && u.tipo === modalEditar.tipo
          ? { ...u, Nombre: modalEditar.Nombre, Email: modalEditar.Email }
          : u,
      ),
    );
    setGuardando(false);
    setModalEditar(null);
  }

  async function confirmarBorrado() {
    if (!modalBorrar) return;
    await eliminarUsuario(modalBorrar.tipo, modalBorrar.id);
    setModalBorrar(null);
    setUsuarios((prev) =>
      prev.filter(
        (u) => !(u.ID === modalBorrar.id && u.tipo === modalBorrar.tipo),
      ),
    );
    setTotalUsuarios((prev) => prev - 1);
  }

  async function confirmarBloqueo() {
    if (!modalBloquear) return;
    await bloquearUsuario(modalBloquear.tipo, modalBloquear.id);
    setUsuarios((prev) =>
      prev.map((u) =>
        u.ID === modalBloquear.id && u.tipo === modalBloquear.tipo
          ? {
              ...u,
              Estado: "Bloqueado",
              EstadoCuenta: "Bloqueado",
              Disponible: false,
            }
          : u,
      ),
    );
    setModalBloquear(null);
  }

  async function handleDesbloquear(usuario: Usuario) {
    await desbloquearUsuario(usuario.tipo, usuario.ID);
    setUsuarios((prev) =>
      prev.map((u) =>
        u.ID === usuario.ID && u.tipo === usuario.tipo
          ? {
              ...u,
              Estado: "Disponible",
              EstadoCuenta: "Disponible",
              Disponible: true,
            }
          : u,
      ),
    );
    setMenuAbierto(null);
  }

  const [orden, setOrden] = useState<{
    col: ColOrdenable | null;
    dir: "asc" | "desc";
  }>({
    col: null,
    dir: "asc",
  });

  useEffect(() => {
    setLoading(true);
    fetchUsuarios(pagina, busquedaAplicada, rolAplicado, estadoAplicado)
      .then((data) => {
        setUsuarios(data.usuarios ?? []);
        setTotalPaginas(data.totalPaginas ?? 1);
        setTotalUsuarios(data.total ?? 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando usuarios:", err);
        setLoading(false);
      });
  }, [pagina, busquedaAplicada, rolAplicado, estadoAplicado]);

  function toggleOrden(col: ColOrdenable) {
    setOrden((prev) =>
      prev.col === col
        ? { col, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { col, dir: "asc" },
    );
  }

  function aplicarFiltros() {
    setRolAplicado(filtroRol);
    setEstadoAplicado(filtroEstado);
    setBusquedaAplicada(busqueda);
    setPagina(1);
  }

  function limpiarFiltros() {
    setBusqueda("");
    setFiltroRol("Todos");
    setFiltroEstado("Todos");
    setRolAplicado("Todos");
    setEstadoAplicado("Todos");
    setBusquedaAplicada("");
    setPagina(1);
  }

  const usuariosPagina = ordenarUsuarios(usuarios, orden.col, orden.dir);

  if (loading)
    return (
      <div
        className="bg-bg min-h-screen flex items-center justify-center"
        style={{ marginLeft: "320px" }}
      >
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-primary border-t-transparent" />
          <p className="mt-5 text-text font-medium text-lg">
            Cargando sistema de usuarios...
          </p>
        </div>
      </div>
    );

  return (
    <div className="bg-bg min-h-screen p-10" style={{ marginLeft: "320px" }}>
      <div className="max-w-full">
        <div className="mb-10 border-l-4 border-primary pl-6">
          <h1 className="text-4xl font-bold text-primary tracking-tight">
            Control de Usuarios
          </h1>
          <p className="text-text/70 mt-2 text-base font-medium">
            Administración total del sistema
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-border/20 p-6 mb-8">
          <div className="flex gap-4 items-end flex-wrap">
            <div className="flex-1 min-w-70">
              <label className="block text-xs font-bold text-text/60 uppercase tracking-wider mb-2">
                Búsqueda
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-border">
                  <i className="bi bi-search text-lg" />
                </span>
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Nombre, email o rol..."
                  className="pl-12 pr-4 py-3 border-2 border-border/30 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-full text-sm font-medium transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text/60 uppercase tracking-wider mb-2">
                Rol
              </label>
              <Dropdown
                valor={filtroRol}
                opciones={ROLES}
                abierto={dropRol}
                onToggle={() => {
                  setDropRol(!dropRol);
                  setDropEstado(false);
                }}
                onSelect={(r) => {
                  setFiltroRol(r);
                  setDropRol(false);
                }}
                minWidth="140px"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text/60 uppercase tracking-wider mb-2">
                Estado
              </label>
              <Dropdown
                valor={filtroEstado}
                opciones={ESTADOS}
                abierto={dropEstado}
                onToggle={() => {
                  setDropEstado(!dropEstado);
                  setDropRol(false);
                }}
                onSelect={(e) => {
                  setFiltroEstado(e);
                  setDropEstado(false);
                }}
                minWidth="150px"
              />
            </div>

            <div className="flex gap-3 ml-auto">
              <button
                onClick={aplicarFiltros}
                className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 shadow-md hover:shadow-lg transition-all uppercase tracking-wide"
              >
                <i className="bi bi-funnel-fill mr-2" />
                Aplicar
              </button>
              <button
                onClick={limpiarFiltros}
                className="px-6 py-3 bg-border/20 text-text rounded-xl text-sm font-bold hover:bg-border/30 transition-all uppercase tracking-wide"
              >
                <i className="bi bi-x-circle mr-2" />
                Limpiar
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-border/20 overflow-hidden">
          <div className="bg-primary px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="bi bi-people-fill text-white text-2xl" />
              <h2 className="text-white font-bold text-lg tracking-wide">
                Registro de Usuarios
              </h2>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <span className="text-white font-bold text-sm">
                {totalUsuarios} usuarios
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary/5 border-b-2 border-primary/20">
                  {(["Nombre", "Email", "tipo"] as ColOrdenable[]).map(
                    (col) => (
                      <th
                        key={col}
                        onClick={() => toggleOrden(col)}
                        className="px-6 py-4 text-left text-xs font-black text-primary uppercase tracking-widest cursor-pointer select-none hover:bg-primary/10 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          {col === "tipo" ? "Rol" : col}
                          <span className="text-primary/50 text-base">
                            {orden.col === col
                              ? orden.dir === "asc"
                                ? "↑"
                                : "↓"
                              : "↕"}
                          </span>
                        </span>
                      </th>
                    ),
                  )}
                  <th className="px-6 py-4 text-left text-xs font-black text-primary uppercase tracking-widest">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-black text-primary uppercase tracking-widest">
                    Control
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {usuariosPagina.map((usuario) => {
                  const estado = getEstado(usuario);
                  const esActivo =
                    (usuario.Estado === "Disponible" ||
                      usuario.EstadoCuenta === "Disponible" ||
                      usuario.Disponible) &&
                    usuario.Estado !== "Bloqueado" &&
                    usuario.EstadoCuenta !== "Bloqueado";

                  return (
                    <tr
                      key={`${usuario.tipo}-${usuario.ID}`}
                      className="hover:bg-accent-yellow/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-bold text-text">
                        {usuario.Nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-text/70 font-medium">
                        {usuario.Email || "N/A"}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold uppercase tracking-wide border border-primary/20">
                          {usuario.tipo}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border ${
                            esActivo
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {estado || "Inactivo"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2 items-center justify-center">
                          <button
                            className="p-2.5 text-primary hover:bg-primary hover:text-white rounded-lg transition-all border border-primary/20 hover:border-primary"
                            title="Editar"
                            onClick={() => abrirEditar(usuario)}
                          >
                            <i className="bi bi-pencil-fill text-base" />
                          </button>
                          <button
                            className="p-2.5 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all border border-red-200 hover:border-red-600"
                            title="Eliminar"
                            onClick={() =>
                              setModalBorrar({
                                id: usuario.ID,
                                tipo: usuario.tipo,
                                nombre: usuario.Nombre,
                              })
                            }
                          >
                            <i className="bi bi-trash3-fill text-base" />
                          </button>
                          <div className="relative">
                            <button
                              className="p-2.5 text-text hover:bg-text hover:text-white rounded-lg transition-all border border-border/30 hover:border-text"
                              title="Más opciones"
                              onClick={() => {
                                const key = `${usuario.tipo}-${usuario.ID}`;
                                setMenuAbierto(
                                  menuAbierto === key ? null : key,
                                );
                              }}
                            >
                              <i className="bi bi-three-dots-vertical text-base" />
                            </button>
                            {menuAbierto ===
                              `${usuario.tipo}-${usuario.ID}` && (
                              <div className="absolute right-0 z-20 mt-2 bg-white border-2 border-border/30 rounded-xl shadow-2xl w-52 overflow-hidden">
                                {usuario.Estado === "Bloqueado" ||
                                usuario.EstadoCuenta === "Bloqueado" ? (
                                  <button
                                    className="w-full text-left px-5 py-3 text-sm font-bold text-green-700 hover:bg-green-50 flex items-center gap-3 transition-colors"
                                    onClick={() => handleDesbloquear(usuario)}
                                  >
                                    <i className="bi bi-unlock-fill text-lg" />{" "}
                                    Desbloquear usuario
                                  </button>
                                ) : (
                                  <button
                                    className="w-full text-left px-5 py-3 text-sm font-bold text-accent-orange hover:bg-accent-orange/10 flex items-center gap-3 transition-colors"
                                    onClick={() => {
                                      setMenuAbierto(null);
                                      setModalBloquear({
                                        id: usuario.ID,
                                        tipo: usuario.tipo,
                                        nombre: usuario.Nombre,
                                      });
                                    }}
                                  >
                                    <i className="bi bi-lock-fill text-lg" />{" "}
                                    Bloquear usuario
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <p className="text-sm font-bold text-text/60 uppercase tracking-wide">
            <i className="bi bi-database mr-2" />
            Total: {totalUsuarios} registros
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setPagina(pagina - 1)}
              disabled={pagina === 1}
              className="px-4 py-2.5 border-2 border-border/30 rounded-xl text-sm font-bold hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text transition-all"
            >
              <i className="bi bi-chevron-left" />
            </button>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPagina(p)}
                className={`px-4 py-2.5 border-2 rounded-xl text-sm font-bold transition-all ${
                  pagina === p
                    ? "bg-primary text-white border-primary shadow-md"
                    : "border-border/30 hover:bg-primary/10 hover:border-primary/50"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPagina(pagina + 1)}
              disabled={pagina === totalPaginas}
              className="px-4 py-2.5 border-2 border-border/30 rounded-xl text-sm font-bold hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text transition-all"
            >
              <i className="bi bi-chevron-right" />
            </button>
          </div>
        </div>
      </div>

      {modalEditar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border-2 border-primary/20">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-primary/20">
              <i className="bi bi-pencil-square text-primary text-2xl" />
              <h2 className="text-2xl font-bold text-primary">
                Editar Usuario
              </h2>
            </div>

            <div className="space-y-4">
              <Campo
                label="Nombre"
                value={modalEditar.Nombre}
                onChange={(v) => setModalEditar({ ...modalEditar, Nombre: v })}
              />
              <Campo
                label="Email"
                value={modalEditar.Email ?? ""}
                onChange={(v) => setModalEditar({ ...modalEditar, Email: v })}
              />

              {(modalEditar.tipo === "cliente" ||
                modalEditar.tipo === "camionero") && (
                <Campo
                  label="Teléfono"
                  value={
                    ((modalEditar as Record<string, unknown>).Telf as string) ??
                    ""
                  }
                  onChange={(v) =>
                    setModalEditar({
                      ...modalEditar,
                      Telf: v,
                    } as typeof modalEditar)
                  }
                />
              )}
              {modalEditar.tipo === "cliente" && (
                <>
                  <Campo
                    label="Empresa"
                    value={
                      ((modalEditar as Record<string, unknown>)
                        .NombreEmpresa as string) ?? ""
                    }
                    onChange={(v) =>
                      setModalEditar({
                        ...modalEditar,
                        NombreEmpresa: v,
                      } as typeof modalEditar)
                    }
                  />
                  <div>
                    <label className="block text-xs font-bold text-text/60 uppercase tracking-wider mb-2">
                      Estado Cuenta
                    </label>
                    <select
                      value={
                        ((modalEditar as Record<string, unknown>)
                          .EstadoCuenta as string) ?? ""
                      }
                      onChange={(e) =>
                        setModalEditar({
                          ...modalEditar,
                          EstadoCuenta: e.target.value,
                        } as typeof modalEditar)
                      }
                      className="w-full border-2 border-border/30 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      {[
                        "Disponible",
                        "Ocupado",
                        "No molestar",
                        "Ausente",
                        "Día libre",
                      ].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              {modalEditar.tipo === "dispatcher" && (
                <Campo
                  label="Centro de Operación"
                  value={
                    ((modalEditar as Record<string, unknown>)
                      .CentroOperacion as string) ?? ""
                  }
                  onChange={(v) =>
                    setModalEditar({
                      ...modalEditar,
                      CentroOperacion: v,
                    } as typeof modalEditar)
                  }
                />
              )}
              {modalEditar.tipo === "administrador" && (
                <div>
                  <label className="block text-xs font-bold text-text/60 uppercase tracking-wider mb-2">
                    Estado
                  </label>
                  <select
                    value={
                      ((modalEditar as Record<string, unknown>)
                        .Estado as string) ?? ""
                    }
                    onChange={(e) =>
                      setModalEditar({
                        ...modalEditar,
                        Estado: e.target.value,
                      } as typeof modalEditar)
                    }
                    className="w-full border-2 border-border/30 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {[
                      "Disponible",
                      "Ocupado",
                      "No molestar",
                      "Ausente",
                      "Día libre",
                    ].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}
              {modalEditar.tipo === "camionero" && (
                <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <input
                    type="checkbox"
                    id="disponible"
                    checked={
                      ((modalEditar as Record<string, unknown>)
                        .Disponible as boolean) ?? false
                    }
                    onChange={(e) =>
                      setModalEditar({
                        ...modalEditar,
                        Disponible: e.target.checked,
                      } as typeof modalEditar)
                    }
                    className="w-5 h-5 accent-primary"
                  />
                  <label
                    htmlFor="disponible"
                    className="text-sm font-bold text-text uppercase tracking-wide"
                  >
                    Disponible
                  </label>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end mt-8 pt-6 border-t-2 border-border/20">
              <button
                onClick={() => setModalEditar(null)}
                className="px-6 py-3 bg-border/20 text-text rounded-xl hover:bg-border/30 font-bold uppercase tracking-wide transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={guardarEdicion}
                disabled={guardando}
                className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 font-bold uppercase tracking-wide disabled:opacity-50 shadow-md hover:shadow-lg transition-all"
              >
                {guardando ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalBloquear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center border-2 border-accent-orange/30">
            <div className="w-20 h-20 bg-accent-orange/10 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-accent-orange/30">
              <i className="bi bi-lock-fill text-accent-orange text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-text mb-3">
              Bloquear Usuario
            </h2>
            <p className="text-text/70 mb-6 font-medium">
              ¿Confirmas el bloqueo de{" "}
              <strong className="text-accent-orange">
                {modalBloquear.nombre}
              </strong>
              ?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setModalBloquear(null)}
                className="px-6 py-3 bg-border/20 text-text rounded-xl hover:bg-border/30 font-bold uppercase tracking-wide transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarBloqueo}
                className="px-6 py-3 bg-accent-orange text-white rounded-xl hover:bg-accent-orange/90 font-bold uppercase tracking-wide shadow-md hover:shadow-lg transition-all"
              >
                Bloquear
              </button>
            </div>
          </div>
        </div>
      )}

      {modalBorrar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center border-2 border-red-200">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-red-200">
              <i className="bi bi-exclamation-triangle-fill text-red-600 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-text mb-3">
              Eliminar Usuario
            </h2>
            <p className="text-text/70 mb-2 font-medium">
              ¿Confirmas la eliminación de{" "}
              <strong className="text-red-600">{modalBorrar.nombre}</strong>?
            </p>
            <p className="text-red-600 text-sm font-bold mb-6 uppercase tracking-wide">
              Acción irreversible
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setModalBorrar(null)}
                className="px-6 py-3 bg-border/20 text-text rounded-xl hover:bg-border/30 font-bold uppercase tracking-wide transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarBorrado}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold uppercase tracking-wide shadow-md hover:shadow-lg transition-all"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Campo({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-text/60 uppercase tracking-wider mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-2 border-border/30 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
      />
    </div>
  );
}

function Dropdown({
  valor,
  opciones,
  abierto,
  onToggle,
  onSelect,
  minWidth,
}: {
  valor: string;
  opciones: readonly string[];
  abierto: boolean;
  onToggle: () => void;
  onSelect: (opcion: string) => void;
  minWidth: string;
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-3 px-4 py-3 border-2 border-border/30 rounded-xl bg-white text-sm font-bold justify-between hover:border-primary/50 transition-all"
        style={{ minWidth }}
      >
        {valor} <i className="bi bi-chevron-down text-xs" />
      </button>
      {abierto && (
        <div className="absolute z-10 mt-2 bg-white border-2 border-border/30 rounded-xl shadow-2xl w-full overflow-hidden">
          {opciones.map((op) => (
            <div
              key={op}
              onClick={() => onSelect(op)}
              className="px-4 py-3 text-sm font-bold hover:bg-primary/10 hover:text-primary cursor-pointer text-center transition-colors border-b border-border/10 last:border-b-0"
            >
              {op}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
