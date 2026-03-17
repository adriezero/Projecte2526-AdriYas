import { NextResponse } from "next/server";
import { prisma } from "@lib/prisma";
import { enviarCorreoRecuperacion } from "@lib/emails";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { correo } = await request.json();
    const token = crypto.randomBytes(32).toString("hex");
    const expiracion = new Date(Date.now() + 3600000);
    const data = { resetToken: token, resetTokenExpiry: expiracion };

    const respuestaExito = NextResponse.json({ message: "Correo enviado exitosamente" });

    const cliente = await prisma.cliente.findFirst({ where: { Email: correo } });
    if (cliente) {
      await prisma.cliente.update({ where: { ID: cliente.ID }, data });
      await enviarCorreoRecuperacion(correo, cliente.Nombre, token);
      return respuestaExito;
    }

    const dispatcher = await prisma.dispatcher.findFirst({ where: { Email: correo } });
    if (dispatcher) {
      await prisma.dispatcher.update({ where: { ID: dispatcher.ID }, data });
      await enviarCorreoRecuperacion(correo, dispatcher.Nombre, token);
      return respuestaExito;
    }

    const admin = await prisma.administrador.findFirst({ where: { Email: correo } });
    if (admin) {
      await prisma.administrador.update({ where: { ID: admin.ID }, data });
      await enviarCorreoRecuperacion(correo, admin.Nombre, token);
      return respuestaExito;
    }

    return NextResponse.json(
      { error: "No existe una cuenta con ese correo" },
      { status: 404 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
