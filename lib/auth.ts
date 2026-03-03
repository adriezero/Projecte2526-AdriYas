import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@lib/prisma";

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
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};