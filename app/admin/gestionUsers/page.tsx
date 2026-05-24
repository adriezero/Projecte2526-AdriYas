"use client";
import { useEffect, useState } from "react";
import { ROLES_FILTRO } from "@lib/roles";
import { 
  Spinner, PageHeader, SearchInput, Dropdown, Button, 
  FormField, IconButton, Pagination 
} from "@componentes/ui";
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
const ESTADOS = ["Todos", "Activo", "Inactivo", "Suspendido", "Pendiente"];

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
        style={{ marginLeft: "256px" }}
      >
        <Spinner size="lg" text="Cargando sistema de usuarios..." />
      </div>
    );

  return (
    <div className="bg-bg min-h-screen p-10" style={{ marginLeft: '256px' }}>
      <div className="max-w-full">
        <PageHeader title="Control de usuarios" subtitle="Administración total del sistema"/>

        <div className="bg-white rounded-2xl shadow-lg border border-border/20 p-6 mb-8">
          <div className="flex gap-4 items-end flex-wrap">
            <SearchInput
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Nombre, email o rol..."
              label="Búsqueda"
            />

            <div>
              <Dropdown
                value={filtroRol}
                options={ROLES}
                isOpen={dropRol}
                onToggle={() => {
                  setDropRol(!dropRol);
                  setDropEstado(false);
                }}
                onSelect={(r) => {
                  setFiltroRol(r);
                  setDropRol(false);
                }}
                minWidth="140px"
                label="Rol"
              />
            </div>

            <div>
              <Dropdown
                value={filtroEstado}
                options={ESTADOS}
                isOpen={dropEstado}
                onToggle={() => {
                  setDropEstado(!dropEstado);
                  setDropRol(false);
                }}
                onSelect={(e) => {
                  setFiltroEstado(e);
                  setDropEstado(false);
                }}
                minWidth="150px"
                label="Estado"
              />
            </div>

            <div className="flex gap-3 ml-auto">
              <Button onClick={aplicarFiltros} variant="primary" className="px-6 py-3 text-sm">
                <i className="bi bi-funnel-fill pr-2" />
                Aplicar
              </Button>
              <Button onClick={limpiarFiltros} variant="outline" className="px-6 py-3 text-sm">
                <i className="bi bi-x-circle pr-2" />
                Limpiar
              </Button>
            </div>
          </div>
        </div>

        <br/>
              
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
                Total: {totalUsuarios} usuarios
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
                          <span className="text-primary text-base">
                            {orden.col === col
                              ? orden.dir === "asc"
                                ? <i className="bi bi-sort-up" />
                                : <i className="bi bi-sort-down" />
                              : <i className="bi bi-arrow-down-up" />}
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
                          <IconButton
                            icon="bi-pencil-fill"
                            variant="primary"
                            title="Editar"
                            onClick={() => abrirEditar(usuario)}
                          />
                          <IconButton
                            icon="bi-trash3-fill"
                            variant="danger"
                            title="Eliminar"
                            onClick={() =>
                              setModalBorrar({
                                id: usuario.ID,
                                tipo: usuario.tipo,
                                nombre: usuario.Nombre,
                              })
                            }
                          />
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

        <div className="pt-8 flex justify-end items-end">
          {totalPaginas > 1 && (
            <Pagination
              currentPage={pagina}
              totalPages={totalPaginas}
              onPageChange={setPagina}
            />
          )}
        </div>
      </div>

      {modalEditar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border-2 border-primary/20">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-primary/20">
              <i className="bi bi-pencil-square text-primary text-2xl" />
              <h2 className="text-2xl font-bold text-primary">
                Editar usuario
              </h2>
            </div>

            <div className="space-y-4">
              <FormField
                label="Nombre"
                value={modalEditar.Nombre}
                onChange={(v) => setModalEditar({ ...modalEditar, Nombre: v })}
              />
              <FormField
                label="Email"
                value={modalEditar.Email ?? ""}
                onChange={(v) => setModalEditar({ ...modalEditar, Email: v })}
              />

              {(modalEditar.tipo === "cliente" ||
                modalEditar.tipo === "camionero") && (
                <FormField
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
                  <FormField
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
                    <label className="block text-xs font-bold text-text/60 uppercase tracking-wider py-2">
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
                <FormField
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
                  <label className="block text-xs font-bold text-text/60 uppercase tracking-wider py-2">
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
              <Button
                onClick={() => setModalEditar(null)}
                variant="outline"
              >
                Cancelar
              </Button>
              <Button
                onClick={guardarEdicion}
                disabled={guardando}
                variant="primary"
              >
                {guardando ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {modalBloquear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center border-2 border-accent-orange/30">
            <div className="w-20 h-20 bg-accent-orange/10 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-accent-orange/30">
              <i className="bi bi-lock-fill text-accent-orange text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-text pb-3">
              Bloquear usuario
            </h2>
            <p className="text-text/70 pb-6 font-medium">
              ¿Confirmas el bloqueo de{" "}
              <strong className="text-accent-orange">
                {modalBloquear.nombre}
              </strong>
              ?
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => setModalBloquear(null)}
                variant="outline"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmarBloqueo}
                variant="secondary"
              >
                Bloquear
              </Button>
            </div>
          </div>
        </div>
      )}

      {modalBorrar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center border-2 border-red-200">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-red-200">
              <i className="bi bi-exclamation-triangle-fill text-red-600 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-text pb-3">
              Eliminar usuario
            </h2>
            <p className="text-text/70 pb-2 font-medium">
              ¿Confirmas la eliminación de{" "}
              <strong className="text-red-600">{modalBorrar.nombre}</strong>?
            </p>
            <p className="text-red-600 text-sm font-bold pb-6 uppercase tracking-wide">
              Acción irreversible
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => setModalBorrar(null)}
                variant="outline"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmarBorrado}
                variant="danger"
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
