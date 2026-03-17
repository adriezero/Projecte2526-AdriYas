import { NextResponse } from "next/server";
import { prisma } from "@lib/prisma";
import { Resend } from "resend";
import bcrypt from "bcrypt";
import { templateBienvenida } from "@lib/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { username, email, password, rol } = await req.json();

    // Verificar si el email ya existe en cualquier tabla
    const [existeCliente, existeCamionero, existeDispatcher, existeAdmin] = await Promise.all([
      prisma.cliente.findFirst({ where: { Email: email } }),
      prisma.camionero.findFirst({ where: { Email: email } }),
      prisma.dispatcher.findFirst({ where: { Email: email } }),
      prisma.administrador.findFirst({ where: { Email: email } }),
    ]);

    if (existeCliente || existeCamionero || existeDispatcher || existeAdmin) {
      return NextResponse.json(
        { error: "El correo ya está registrado" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario según el rol
    switch (rol) {
      case "Cliente":
        await prisma.cliente.create({
          data: {
            Nombre: username,
            Email: email,
            Contrase_a: hashedPassword,
            NombreEmpresa: "Sin especificar",
            Telf: "0000000000",
          },
        });
        break;

      case "Camionero":
        const turnoDefault = await prisma.turnos.findFirst();
        if (!turnoDefault) {
          return NextResponse.json(
            { error: "No hay turnos disponibles" },
            { status: 400 }
          );
        }
        await prisma.camionero.create({
          data: {
            Nombre: username,
            Email: email,
            Contrase_a: hashedPassword,
            Licencia: "B",
            Telf: "0000000000",
            idTurno: turnoDefault.ID,
            FechaInicio: new Date(),
            FechaFinal: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
        });
        break;

      case "Dispatcher":
        await prisma.dispatcher.create({
          data: {
            Nombre: username,
            Email: email,
            Contrase_a: hashedPassword,
            CentroOperacion: "Sin especificar",
          },
        });
        break;

      case "Administrador":
        await prisma.administrador.create({
          data: {
            Nombre: username,
            Email: email,
            Contrase_a: hashedPassword,
            Permisos: "Básicos",
          },
        });
        break;

      default:
        return NextResponse.json(
          { error: "Rol no válido" },
          { status: 400 }
        );
    }

    await resend.emails.send({
      from: "TruckWave <onboarding@resend.dev>",
      to: "adrimoodle33@gmail.com",
      subject: "¡Bienvenido a TruckWave!",
      html: templateBienvenida(username, rol, email),
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
