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
          usuario = await prisma.camionero.findFirst({
            where: { Email: credentials.correo },
          });
          tipo = 'camionero';
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
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.id = token.id;
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