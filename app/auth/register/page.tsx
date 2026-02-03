"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";


/* https://github.com/fazt/nextauth-prisma-credentials/blob/master/src/app/auth/register/page.jsx */

export default function Register() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const router = useRouter();

    const onSubmit = handleSubmit(async (data) => {
        if (data.password !== data.confirmPassword) {
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
        <div className="min-h-screen max-w-max flex flex-col bg-[url('/img/camionRegister.png')] bg-center bg-contain bg-no-repeat">
            <div className="w-150 h-180 border grow flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8 gap-24">
                    {/* Título */}
                    <div>
                        <h2 className="text-center text-4xl font-extrabold text-gray-900">
                            Registrarse
                        </h2>
                    </div>

                    {/* Formulario */}
                    <form className="mt-6 space-y-5" onSubmit={onSubmit}>
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
                                    {errors.username.message as String}
                                </span>
                            )}
                        </div>

                        {/* Contraseña */}
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
                            <span className="text-red-500 text-xs">{errors.email.message as String}</span>
                        )}

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
                                className="w-full mt-1 px-3 py-2 border border-gray-300 text-black rounded-md"
                                placeholder="********"
                            />
                            {errors.password && (
                                <span className="text-red-500 text-xs">
                                    {errors.password.message as String}
                                </span>
                            )}
                        </div>

                        <h1>TENGO QUE PONER EL RECUADRO DE LOS REQUISITIOS DE CONTRASEÑA</h1>
                        {/* https://www.npmjs.com/package/react-password-checklist */}

                        <div>
                            <input
                                type="password"
                                {...register("confirmPassword", {
                                    required: {
                                        value: true,
                                        message: "Se requiere confirmacion de contraseña",
                                    },
                                })}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 text-black rounded-md"
                                placeholder="Confirma contraseña"
                            />
                            {errors.confirmPassword && (
                                <span className="text-red-500 text-xs">
                                    {errors.confirmPassword.message as String}
                                </span>
                            )}
                        </div>

                        <div className="mt-40"  >
                           <select required className=" border-1 rounded-2xl" name="rol" id="rol">
                                <option value="" disabled selected>Selecciona un rol</option>
                                <option value="cliente">Cliente</option>
                                <option value="dispatcher">Dispatcher</option>
                                <option value="transportista">Transportista</option>
                            </select>
                            
                        </div>
                           {/*   {errors && (
                                <span className="text-red-500 text-xs">
                                    {errors.confirmPassword.message as String}
                                </span>
                            )}
 */}

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
