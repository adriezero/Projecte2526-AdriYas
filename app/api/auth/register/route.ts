import { NextResponse } from "next/server";
import { prisma } from "@lib/prisma";
import { Resend } from "resend";
import bcrypt from "bcrypt";
import { templateBienvenida } from "@lib/email-templates";
import { ROLES_NOMBRES } from "@lib/roles";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { username, email, password, rol } = await req.json();

    // Validar que el rol sea válido
    if (!ROLES_NOMBRES.includes(rol)) {
      return NextResponse.json(
        { error: "Rol no válido" },
        { status: 400 }
      );
    }

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

    // Siempre crear como Cliente
    const nuevoCliente = await prisma.cliente.create({
      data: {
        Nombre: username,
        Email: email,
        Contrase_a: hashedPassword,
        NombreEmpresa: "Sin especificar",
        Telf: "0000000000",
      },
    });

    // Si solicitó un rol distinto a Cliente, crear reporte de solicitud
    if (rol !== "Cliente") {
      await prisma.reportes.create({
        data: {
          Tipo: "Solicitud_Rol",
          Descripcion: `El usuario con email ${email} ha solicitado registrarse con el rol: ${rol}.`,
          idReportante: nuevoCliente.ID,
          rolReportante: "Cliente",
        },
      });
    }

    await resend.emails.send({
      from: "TruckWave <onboarding@resend.dev>",
      to: email,
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
