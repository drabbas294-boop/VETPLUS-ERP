import NextAuth from 'next-auth'
import { authConfig } from './auth.config'

// Export a separate instance so edge runtime doesn't bundle server-only modules
export const { auth: middleware } = NextAuth(authConfig)

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)'],
}
