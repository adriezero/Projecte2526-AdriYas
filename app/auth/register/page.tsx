"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PasswordChecklist from "react-password-checklist";


/* https://github.com/fazt/nextauth-prisma-credentials/blob/master/src/app/auth/register/page.jsx */

export default function Register() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmarContraseña, setconfirmarContraseña] = useState("");

    const onSubmit = handleSubmit(async (data) => {
        if (data.password !== data.confirmarContraseña) {
            return alert("Las contraseñas no coinciden!!");
        }

        const res = await fetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({
                username: data.username,
                email: data.email,
                password: data.password,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (res.ok) {
            router.push("/auth/login");
        }
    });

    console.log(errors);

    return (
        <div className="min-h-screen flex bg-[url('/img/camionRegister.png')] bg-right bg-cover">
            <div className="w-180 flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8 gap-24">
                    {/* Título */}
                    <div>
                        <h2 className="text-center text-4xl font-extrabold text-gray-900">
                            Registrarse
                        </h2>
                    </div>

                    {/* Formulario */}
                    <form className="mt-6 space-y-8" onSubmit={onSubmit}>
                        {/* Usuario */}
                        <div>
                            <label className="text-gray-700 text-sm">Usuario</label>
                            <input
                                type="text"
                                {...register("username", {
                                    required: {
                                        value: true,
                                        message: "Username is required",
                                    },
                                })}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 text-black rounded-md"
                                placeholder="tuUsuario123"
                            />
                            {errors.username && (
                                <span className="text-red-500 text-xs">
                                    {errors.username.message as string}
                                </span>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="text-gray-700 text-sm">Email</label>
                            <input
                                type="email"
                                {...register("email", {
                                    required: {
                                        value: true,
                                        message: "Email is required",
                                    },
                                })}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 text-black rounded-md"
                                placeholder="usuario@gmail.com"
                            />
                        </div>

                        {errors.email && (
                            <span className="text-red-500 text-xs">{errors.email.message as string}</span>
                        )}
                        {/* Contraseña */}
                        <div>
                            <label htmlFor="password" className="text-gray-700 text-sm">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                {...register("password", {
                                    required: {
                                        value: true,
                                        message: "Se requiere contraseña",
                                    },
                                })}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 text-black rounded-md"
                                placeholder="********"
                            />
                            {errors.password && (
                                <span className="text-red-500 text-xs">
                                    {errors.password.message as string}
                                </span>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmarContraseña" className="text-gray-700 text-sm">
                                Confirmar Contraseña
                            </label>
                            <input
                                type="password"
                                {...register("confirmarContraseña", {
                                    required: {
                                        value: true,
                                        message: "Se requiere confirmacion de contraseña",
                                    },
                                })}
                                onChange={(e) => setconfirmarContraseña(e.target.value)}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 text-black rounded-md"
                                placeholder="Confirma contraseña"
                            />
                            {errors.confirmarContraseña && (
                                <span className="text-red-500 text-xs">
                                    {errors.confirmarContraseña.message as string}
                                </span>
                            )}
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

                        <div>
                            <label htmlFor="rol" className="text-gray-700 text-sm">Rol</label>
                            <select
                                {...register("rol", {
                                    required: {
                                        value: true,
                                        message: "Selecciona un rol",
                                    },
                                })}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 text-black rounded-md"
                            >
                                <option value="">Selecciona un rol</option>
                                <option value="cliente">Cliente</option>
                                <option value="dispatcher">Dispatcher</option>
                                <option value="transportista">Transportista</option>
                            </select>
                            {errors.rol && (
                                <span className="text-red-500 text-xs">
                                    {errors.rol.message as string}
                                </span>
                            )}
                        </div>

                        {/* Botón iniciar sesión */}
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                        >
                            Registrarse
                        </button>

                        {/* Separador */}
                        <div className="flex items-center justify-center">
                            <hr className="w-full border-black-300 h-10" />
                        </div>

                        {/* Texto: No tienes cuenta */}
                        <h2 className="text-center text-2xl font-semibold text-gray-800">
                            ¿Tienes cuenta? Inicia Sesion.
                        </h2>

                        {/* Botón login */}
                        <a
                            href="/auth/login"
                            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer block text-center"
                        >
                            Iniciar Sesion
                        </a>
                    </form>
                </div>
            </div>
        </div>
    );
}
