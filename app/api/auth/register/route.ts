import { NextResponse } from "next/server";
import { prisma } from "@lib/prisma";
import { Resend } from "resend";
import bcrypt from "bcrypt";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    const existeCliente = await prisma.cliente.findFirst({
      where: { Email: email },
    });

    if (existeCliente) {
      return NextResponse.json(
        { error: "El correo ya está registrado" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoCliente = await prisma.cliente.create({
      data: {
        Nombre: username,
        Email: email,
        Contrase_a: hashedPassword,
        NombreEmpresa: "Sin especificar",
        Telf: "0000000000",
      },
    });

    await resend.emails.send({
      from: "TruckWave <onboarding@resend.dev>",
      to: "adrimoodle33@gmail.com",
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
              <h2>Hola ${username},</h2>
              <p>Gracias por unirte a TruckWave, tu plataforma de confianza para gestión de transporte.</p>
              <p>Tu cuenta ha sido creada exitosamente y ya puedes comenzar a usar nuestros servicios.</p>
              <p><strong>Email registrado:</strong> ${email}</p>
              <a href="${process.env.NEXTAUTH_URL}auth/login" class="button">Iniciar Sesión</a>
              <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json(
      { message: "Usuario registrado exitosamente" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { error: "Error al registrar usuario" },
      { status: 500 }
    );
  }
}
