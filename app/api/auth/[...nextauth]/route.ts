import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import fs from 'fs'
import path from 'path'
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Usuario } from '@interfaces/interfaces';

/**
 * Método para tener todos los usuarios que están registrados.
 * 
 * @returns Todos los usarios
 */
function obtenerUsuarios() {
  const filePath = path.join(process.cwd(), 'pruebasUsers.json') // Pruebas temporales con un JSON, luego se pasa a BBDD
  const fileContent = fs.readFileSync(filePath, 'utf8')
  const datos = JSON.parse(fileContent)
  
  return Object.entries(datos.usuarios).map(([id, usuario]) => {
    const u = usuario as Usuario;
    return {
      id: id,
      correo: u.email,
      nombre: u.name,
      clave: u.password
    }
  });
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        correo: { label: "Correo", type: "email" },
        clave: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        const usuariosValidos = obtenerUsuarios()
        
        const usuario = usuariosValidos.find(u => 
          u.correo === credentials?.correo && u.clave === credentials?.clave
        )
        
        if (usuario) {
          return {
            id: usuario.id,
            email: usuario.correo,
            name: usuario.nombre
          }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/auth/signin'
  },
  secret: process.env.NEXTAUTH_SECRET,
}
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }