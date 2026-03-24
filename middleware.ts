import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const role = token?.role as string | undefined

  // Rutas protegidas por rol
  const roleRoutes: Record<string, string> = {
    administrador: '/admin',
    dispatcher: '/dispatcher',
    camionero: '/camionero',
    cliente: '/cliente'
  }

  // Verificar si está accediendo a una ruta protegida
  for (const [userRole, routePrefix] of Object.entries(roleRoutes)) {
    if (pathname.startsWith(routePrefix)) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
      if (role !== userRole) {
        return NextResponse.redirect(new URL(roleRoutes[role] || '/home', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|home|contacto|sobre-nosotros|auth).*)'],
}
