import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@lib/prisma";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        correo: { label: "Correo", type: "email" },
        clave: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.correo || !credentials?.clave) return null;

        // Buscar en cliente
        let usuario: any = await prisma.cliente.findFirst({
          where: { Email: credentials.correo },
        });
        let tipo = 'cliente';

        // Si no es cliente, buscar en dispatcher
        if (!usuario) {
          usuario = await prisma.dispatcher.findFirst({
            where: { Email: credentials.correo },
          });
          tipo = 'dispatcher';
        }

        // Si no es dispatcher, buscar en administrador
        if (!usuario) {
          usuario = await prisma.administrador.findFirst({
            where: { Email: credentials.correo },
          });
          tipo = 'administrador';
        }

        if (!usuario) return null;

        // Comparación directa (temporal - contraseñas en texto plano)
        if (credentials.clave === usuario.Contrase_a) {
          return {
            id: usuario.ID.toString(),
            email: usuario.Email,
            name: usuario.Nombre,
            role: tipo,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
