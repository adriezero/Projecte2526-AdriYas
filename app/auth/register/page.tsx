"use client";
import { useRegister } from "@hooks/useRegister";
import PasswordChecklist from "react-password-checklist";

export default function Register() {
    const {
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
    } = useRegister();

    return (
        <div className="min-h-screen flex flex-col bg-[url('/img/camionRegistro.jpg')] bg-center bg-cover">
            <div className="w-150 h-180 border grow flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8 gap-24 px-6 py-6">
                    {/* Título */}
                    <div>
                        <h2 className="text-center text-3xl font-extrabold text-gray-900">
                            Registrarse
                        </h2>
                    </div>

                    {/* Formulario */}
                    <form className="mt-5 space-y-4" onSubmit={manejarEnvio}>
                        {/* Usuario */}
                        <div>
                            <label className="text-gray-700">Usuario</label>
                            <input
                                type="text"
                                required
                                className="w-full mt-1 px-3 py-2 border border-gray-300 text-black rounded-md"
                                placeholder="tuUsuario123"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-gray-700">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full mt-1 px-3 py-2 border border-gray-300 text-black rounded-md"
                                placeholder="usuario@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label className="text-gray-700">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={mostrarClave ? "text" : "password"}
                                    required
                                    className="w-full mt-1 px-3 py-2 pr-10 border border-gray-300 text-black rounded-md"
                                    placeholder="Introduce una contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarClave(!mostrarClave)}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 bg-gray-200 px-2 py-1 rounded cursor-pointer"
                                >
                                    {mostrarClave ? (
                                        <i className="bi bi-eye text-xl"></i>
                                    ) : (
                                        <i className="bi bi-eye-slash text-xl"></i>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirmar Contraseña */}
                        <div>
                            <label className="text-gray-700">Confirmar Contraseña</label>
                            <div className="relative">
                                <input
                                    type={mostrarConfirmarClave ? "text" : "password"}
                                    required
                                    className="w-full mt-1 px-3 py-2 pr-10 border border-gray-300 text-black rounded-md"
                                    placeholder="********"
                                    value={confirmarContraseña}
                                    onChange={(e) => setConfirmarContraseña(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarConfirmarClave(!mostrarConfirmarClave)}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 bg-gray-200 px-2 py-1 rounded cursor-pointer"
                                >
                                    {mostrarConfirmarClave ? (
                                        <i className="bi bi-eye text-xl"></i>
                                    ) : (
                                        <i className="bi bi-eye-slash text-xl"></i>
                                    )}
                                </button>
                            </div>
                        </div>

                        <PasswordChecklist
                            rules={["minLength","specialChar","number","capital","match"]}
                            minLength={8}
                            value={password}
                            valueAgain={confirmarContraseña}
                            messages={{
                                minLength: "La contraseña tiene más de 8 caracteres.",
                                specialChar: "La contraseña tiene caracteres especiales.",
                                number: "La contraseña tiene un número.",
                                capital: "La contraseña tiene una letra mayúscula.",
                                match: "Las contraseñas coinciden.",
                            }}
                        />

                        {/* Rol */}
                        <div>
                            <label className="text-gray-700">Rol</label>
                            <select
                                required
                                className="w-full mt-1 px-3 py-2 border border-gray-300 text-black rounded-md"
                                value={rol}
                                onChange={(e) => setRol(e.target.value)}
                            >
                                <option value="">Selecciona un rol</option>
                                <option value="cliente">Cliente</option>
                                <option value="dispatcher">Dispatcher</option>
                                <option value="transportista">Transportista</option>
                            </select>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        {/* Botón iniciar sesión */}
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                        >
                            Registrarse
                        </button>

                        {/* Separador */}
                        <div className="flex items-center justify-center py-3 gap-2">
                            <hr className="flex-1 border-black" />
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                            </div>
                            <hr className="flex-1 border-black" />
                        </div>

                        {/* Texto: No tienes cuenta */}
                        <h2 className="text-center text-xl font-semibold text-gray-800">
                            ¿Tienes cuenta? Inicia Sesion.
                        </h2>

                        {/* Botón login */}
                        <a href="/auth/login"
                            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer block text-center">
                            Iniciar Sesion
                        </a>
                    </form>
                </div>
            </div>
        </div>
    );
}
