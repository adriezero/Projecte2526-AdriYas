"use client";
import { useRegister } from "@hooks/useRegister";
import PasswordChecklist from "react-password-checklist";
import { useState, useEffect } from "react";

export default function Register() {
    const [passwordValida, setPasswordValida] = useState(false);

    // Esto inserta los roles de la BBDD en el drop-down list de ROL
    const [roles, setRoles] = useState<{ ID: number; Nombre: string }[]>([]);
    useEffect(() => {
        fetch('/api/roles')
            .then(res => res.json())
            .then(data => setRoles(data))
            .catch(err => console.error('Error cargando roles:', err));
    }, []);

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
                <div className="max-w-md w-full space-y-8 gap-24">
                    {/* Título */}
                    <div>
                        <h2 className="text-center text-3xl font-extrabold text-gray-900">
                            Registrarse
                        </h2>
                    </div>

                    {/* Formulario */}
                    <form className="mt-6 space-y-5" onSubmit={manejarEnvio}>
                        {/* Usuario */}
                        <div className="py-2">
                            <label className="text-gray-700">Usuario</label>
                            <input
                                type="text"
                                required
                                className="w-full mt-1 px-3 py-2 border border-gray-300 text-black rounded-md"
                                placeholder="Usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        {/* Email */}
                        <div className="py-2">
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
                        <div className="py-2">
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
                        <div className="py-2">
                            <label className="text-gray-700">Confirmar contraseña</label>
                            <div className="relative">
                                <input
                                    type={mostrarConfirmarClave ? "text" : "password"}
                                    required
                                    className="w-full mt-1 px-3 py-2 pr-10 border border-gray-300 text-black rounded-md"
                                    placeholder="Confirmar contraseña"
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

                        {password.length > 0 && !passwordValida && (
                            <div className="text-black border-red-600 bg-red-100 border border-dashed rounded-md">
                                <PasswordChecklist
                                    rules={["minLength", "specialChar", "number", "capital", "match"]}
                                    minLength={8}
                                    value={password}
                                    valueAgain={confirmarContraseña}
                                    onChange={(isValid) => setPasswordValida(isValid)}
                                    className="text-sm"
                                    iconComponents={{
                                        ValidIcon: <i className="bi bi-check-circle-fill text-green-500 px-1.5"></i>,
                                        InvalidIcon: <i className="bi bi-x-circle-fill text-red-500 px-1.5"></i>
                                    }}
                                    messages={{
                                        minLength: "La contraseña tiene más de 8 caracteres.",
                                        specialChar: "La contraseña tiene caracteres especiales.",
                                        number: "La contraseña tiene un número.",
                                        capital: "La contraseña tiene una letra mayúscula.",
                                        match: "Las contraseñas coinciden.",
                                    }}
                                />
                            </div>
                        )}

                        {/* Rol */}
                        <div className="py-2">
                            <label className="text-gray-700">Rol</label>
                            <select
                                required
                                className="w-full mt-1 px-3 py-2 border border-gray-300 text-black rounded-md"
                                value={rol}
                                onChange={(e) => setRol(e.target.value)}
                            >
                                <option value="">Selecciona un rol</option>
                                {roles.map((r) => (
                                    <option key={r.ID} value={r.Nombre}>
                                        {r.Nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="py-3">
                                <div className="bg-red-100 border border-red-400 px-4 py-3 rounded">
                                    <p className="text-red-700">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Botón iniciar sesión */}
                        <div className="py-2">
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                            >
                                Registrarse
                            </button>
                        </div>

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
                            ¿Tienes cuenta? Inicia sesión.
                        </h2>

                        {/* Botón login */}
                        <a href="/auth/login"
                            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer block text-center">
                            Iniciar sesión
                        </a>
                    </form>
                </div>
            </div>
        </div>
    );
}
