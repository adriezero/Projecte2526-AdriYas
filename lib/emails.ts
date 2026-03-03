import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function enviarCorreoBienvenida(email: string, nombre: string) {
  return await resend.emails.send({
    from: "TruckWave <onboarding@resend.dev>",
    to: email,
    subject: "¡Bienvenido a TruckWave!",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 30px; background: #f9fafb; border-radius: 0 0 8px 8px; }
          .button { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Bienvenido a TruckWave!</h1>
          </div>
          <div class="content">
            <h2>Hola ${nombre},</h2>
            <p>Gracias por unirte a TruckWave, tu plataforma de confianza para gestión de transporte.</p>
            <p>Tu cuenta ha sido creada exitosamente y ya puedes comenzar a usar nuestros servicios.</p>
            <a href="${process.env.NEXTAUTH_URL}auth/login" class="button">Iniciar Sesión</a>
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

export async function enviarCorreoRecuperacion(email: string, token: string) {
  return await resend.emails.send({
    from: "TruckWave <onboarding@resend.dev>",
    to: email,
    subject: "Recuperar contraseña - TruckWave",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 30px; background: #f9fafb; border-radius: 0 0 8px 8px; }
          .button { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Recuperar Contraseña</h1>
          </div>
          <div class="content">
            <p>Has solicitado recuperar tu contraseña.</p>
            <p>Haz clic en el siguiente botón para restablecer tu contraseña:</p>
            <a href="${process.env.NEXTAUTH_URL}reset-password?token=${token}" class="button">Restablecer Contraseña</a>
            <p>Si no solicitaste este cambio, ignora este correo.</p>
            <p>Este enlace expirará en 1 hora.</p>
          </div>
        </div>
      </body>
      </html>
    `,
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
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 30px; background: #f9fafb; border-radius: 0 0 8px 8px; }
          .info { background: white; padding: 15px; border-left: 4px solid #2563eb; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nuevo Mensaje de Contacto</h1>
          </div>
          <div class="content">
            <div class="info">
              <p><strong>De:</strong> ${nombre}</p>
              <p><strong>Email:</strong> ${emailUsuario}</p>
            </div>
            <div class="info">
              <p><strong>Mensaje:</strong></p>
              <p>${mensaje}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}
