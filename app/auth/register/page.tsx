"use client";
import { useRegister } from "@hooks/useRegister";
import PasswordChecklist from "react-password-checklist";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export default function Register() {
    const t = useTranslations('auth.register');
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
        <div className="min-h-screen flex flex-col bg-[url('/img/camionRegistro.png')] bg-center bg-cover">
            <div className="grow flex items-center justify-center bg-gray-50 px-4 py-6 md:w-150 md:h-180 md:border md:px-0 md:py-0">
                <div className="max-w-md w-full space-y-8 gap-24">
                    {/* Título */}
                    <div>
                        <h2 className="text-center text-3xl font-extrabold text-gray-900 font-arsenal uppercase">
                            {t('title')}
                        </h2>
                    </div>

                    {/* Formulario */}
                    <form className="mt-6 space-y-5" onSubmit={manejarEnvio}>
                        {/* Usuario */}
                        <div className="py-2">
                            <label className="text-gray-700">{t('username')}</label>
                            <input
                                type="text"
                                required
                                className="w-full mt-1 px-3 py-2 border border-border text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder={t('usernamePlaceholder')}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        {/* Email */}
                        <div className="py-2">
                            <label className="text-gray-700">{t('email')}</label>
                            <input
                                type="email"
                                required
                                className="w-full mt-1 px-3 py-2 border border-border text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder={t('emailPlaceholder')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Contraseña */}
                        <div className="py-2">
                            <label className="text-gray-700">{t('password')}</label>
                            <div className="relative">
                                <input
                                    type={mostrarClave ? "text" : "password"}
                                    required
                                    className="w-full mt-1 px-3 py-2 pr-10 border border-border text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder={t('passwordPlaceholder')}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarClave(!mostrarClave)}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 text-text/60 hover:text-primary bg-gray-200 px-2 py-1 rounded-lg transition-colors cursor-pointer"
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
                            <label className="text-gray-700">{t('confirmPassword')}</label>
                            <div className="relative">
                                <input
                                    type={mostrarConfirmarClave ? "text" : "password"}
                                    required
                                    className="w-full mt-1 px-3 py-2 pr-10 border border-border text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder={t('confirmPasswordPlaceholder')}
                                    value={confirmarContraseña}
                                    onChange={(e) => setConfirmarContraseña(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarConfirmarClave(!mostrarConfirmarClave)}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 text-text/60 hover:text-primary bg-gray-200 px-2 py-1 rounded-lg transition-colors cursor-pointer"
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
                            <div className="text-text border-red-400 bg-red-50 border rounded-lg">
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
                                        minLength: t('passwordMinLength'),
                                        specialChar: t('passwordSpecialChar'),
                                        number: t('passwordNumber'),
                                        capital: t('passwordCapital'),
                                        match: t('passwordMatch'),
                                    }}
                                />
                            </div>
                        )}

                        {/* Rol */}
                        <div className="py-2">
                            <label className="text-gray-700">{t('role')}</label>
                            <select
                                required
                                className="w-full mt-1 px-3 py-2 border border-border text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                value={rol}
                                onChange={(e) => setRol(e.target.value)}
                            >
                                <option value="">{t('selectRole')}</option>
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
                                <div className="bg-red-50 border border-red-300 px-4 py-3 rounded-lg">
                                    <p className="text-red-700">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Botón iniciar sesión */}
                        <div className="py-2">
                            <button
                                type="submit"
                                className="w-full py-3 px-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg cursor-pointer font-medium"
                            >
                                {t('submit')}
                            </button>
                        </div>

                        {/* Separador */}
                        <div className="flex items-center justify-center py-3 gap-2">
                            <hr className="flex-1 border-border" />
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-accent-orange rounded-full"></span>
                                <span className="w-1.5 h-1.5 bg-accent-yellow rounded-full"></span>
                                <span className="w-1.5 h-1.5 bg-accent-orange rounded-full"></span>
                            </div>
                            <hr className="flex-1 border-border" />
                        </div>

                        {/* Texto: No tienes cuenta */}
                        <h2 className="text-center text-xl font-medium text-text pb-4">
                            {t('hasAccount')}
                        </h2>

                        {/* Botón login */}
                        <a href="/auth/login"
                            className="w-full py-3 px-4 bg-accent-orange text-white rounded-xl hover:bg-accent-orange/90 transition-all shadow-md hover:shadow-lg cursor-pointer block text-center font-medium">
                            {t('loginButton')}
                        </a>
                    </form>
                </div>
            </div>
        </div>
    );
}
