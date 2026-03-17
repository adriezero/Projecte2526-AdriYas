import { NextResponse } from "next/server";
import { prisma } from "@lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const { token, clave } = await request.json();
    const where = { resetToken: token, resetTokenExpiry: { gte: new Date() } };
    const hashedPassword = await bcrypt.hash(clave, 10);
    const data = { Contrase_a: hashedPassword, resetToken: null, resetTokenExpiry: null };
    
    const respuestaExito = NextResponse.json({ message: "Contraseña restablecida exitosamente" });
    
    const cliente = await prisma.cliente.findFirst({ where });
    if (cliente) {
      await prisma.cliente.update({ where: { ID: cliente.ID }, data });
      return respuestaExito;
    }

    const dispatcher = await prisma.dispatcher.findFirst({ where });
    if (dispatcher) {
      await prisma.dispatcher.update({ where: { ID: dispatcher.ID }, data });
      return respuestaExito;
    }

    const admin = await prisma.administrador.findFirst({ where });
    if (admin) {
      await prisma.administrador.update({ where: { ID: admin.ID }, data });
      return respuestaExito;
    }

    return NextResponse.json(
      { error: "Token inválido o expirado" },
      { status: 400 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
