import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@lib/prisma";
import bcrypt from "bcrypt";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        correo: { label: "Correo", type: "email" },
        clave: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.correo || !credentials?.clave) return null;

        const correoLowerCase = credentials.correo.toLowerCase();

        let usuario: { ID: number; Email: string | null; Nombre: string; Contrase_a: string } | null = await prisma.cliente.findFirst({
          where: { Email: { equals: correoLowerCase, mode: 'insensitive' } },
        });
        let tipo = 'cliente';

        if (!usuario) {
          usuario = await prisma.dispatcher.findFirst({
            where: { Email: { equals: correoLowerCase, mode: 'insensitive' } },
          });
          tipo = 'dispatcher';
        }

        if (!usuario) {
          usuario = await prisma.camionero.findFirst({
            where: { Email: { equals: correoLowerCase, mode: 'insensitive' } },
          });
          tipo = 'camionero';
        }

        if (!usuario) {
          usuario = await prisma.administrador.findFirst({
            where: { Email: { equals: correoLowerCase, mode: 'insensitive' } },
          });
          tipo = 'administrador';
        }

        if (!usuario || !usuario.Email) return null;

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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = (user as { id?: string }).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string | undefined;
        session.user.id = token.id as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt" as const,
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token' 
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const ROLE_ROUTES: Record<string, string> = {
  administrador: '/admin/gestionUsers',
  dispatcher: '/dispatcher/tareas',
  camionero: '/camionero/horario',
  cliente: '/home'
};