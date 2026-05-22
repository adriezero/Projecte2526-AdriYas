"use client";
import { useRegister } from "@hooks/useRegister";
import PasswordChecklist from "react-password-checklist";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Input, PasswordInput, Alert, Button, Separator } from "@componentes/ui";

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
                        <Input
                            type="text"
                            required
                            label={t('username')}
                            placeholder={t('usernamePlaceholder')}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <Input
                            type="email"
                            required
                            label={t('email')}
                            placeholder={t('emailPlaceholder')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <PasswordInput
                            label={t('password')}
                            placeholder={t('passwordPlaceholder')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <PasswordInput
                            label={t('confirmPassword')}
                            placeholder={t('confirmPasswordPlaceholder')}
                            value={confirmarContraseña}
                            onChange={(e) => setConfirmarContraseña(e.target.value)}
                            required
                        />

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

                        {error && <Alert variant="error">{error}</Alert>}

                        <div className="py-2">
                            <Button type="submit" variant="primary" className="w-full">
                                {t('submit')}
                            </Button>
                        </div>

                    </form>
                    <Separator />

                    {/* Texto: No tienes cuenta */}
                    <h2 className="text-center text-xl font-medium text-text pb-4">
                        {t('hasAccount')}
                    </h2>

                    <a href="/auth/login" className="block">
                        <Button variant="secondary" className="w-full">
                            {t('loginButton')}
                        </Button>
                    </a>
                </div>
            </div>
        </div>
    );
}
