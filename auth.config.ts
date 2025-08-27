import type { NextAuthConfig } from 'next-auth'
import type { Role } from '@prisma/client'

export const authConfig = {
  session: { strategy: 'jwt' },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as { role: Role }).role
      return token
    },
    async session({ session, token }) {
      if (session.user) (session.user as { role?: Role }).role = token.role as Role
      return session
    }
  }
} satisfies NextAuthConfig
