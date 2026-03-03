import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@lib/prisma";
import bcrypt from "bcrypt";

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

        let usuario: any = await prisma.cliente.findFirst({
          where: { Email: credentials.correo },
        });
        let tipo = 'cliente';

        if (!usuario) {
          usuario = await prisma.dispatcher.findFirst({
            where: { Email: credentials.correo },
          });
          tipo = 'dispatcher';
        }

        if (!usuario) {
          usuario = await prisma.administrador.findFirst({
            where: { Email: credentials.correo },
          });
          tipo = 'administrador';
        }

        if (!usuario) return null;

        const passwordMatch = await bcrypt.compare(credentials.clave, usuario.Contrase_a);

        if (passwordMatch) {
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