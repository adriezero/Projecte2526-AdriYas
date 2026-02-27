import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function Proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url))
  }
  
  return NextResponse.next()
}