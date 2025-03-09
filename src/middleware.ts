import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('auth')
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isPublicPage = request.nextUrl.pathname === '/'

  // If the user is not authenticated and trying to access a protected route
  if (!isAuthenticated && !isAuthPage && !isPublicPage) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // If the user is authenticated and trying to access auth pages
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 