import { Resend } from "resend";
import { templateBienvenida, templateRecuperacion, templateContacto } from './email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function enviarCorreoBienvenida(email: string, nombre: string, rol: string) {
  return await resend.emails.send({
    from: "TruckWave <onboarding@resend.dev>",
    to: email,
    subject: "¡Bienvenido a TruckWave!",
    html: templateBienvenida(nombre, rol, email),
  });
}

export async function enviarCorreoRecuperacion(email: string, nombre: string, token: string) {
  return await resend.emails.send({
    from: "TruckWave <onboarding@resend.dev>",
    to: email,
    subject: "Recuperar contraseña - TruckWave",
    html: templateRecuperacion(nombre, token),
  });
}

export async function enviarCorreoContacto(
  emailUsuario: string,
  nombre: string,
  mensaje: string
) {
  return await resend.emails.send({
    from: "TruckWave <onboarding@resend.dev>",
    to: "admin@tudominio.com",
    replyTo: emailUsuario,
    subject: `Nuevo mensaje de contacto - ${nombre}`,
    html: templateContacto(nombre, emailUsuario, mensaje),
  });
}
