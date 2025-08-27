import { prisma } from '@/lib/prisma'
import Credentials from 'next-auth/providers/credentials'
import type { NextAuthConfig } from 'next-auth'
import { compare } from 'bcryptjs'
import { z } from 'zod'

export const authConfig: NextAuthConfig = {
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(creds) {
        const schema = z.object({ email: z.string().email(), password: z.string().min(6) })
        const parsed = schema.safeParse(creds)
        if (!parsed.success) return null
        const user = await prisma.user.findUnique({ where: { email: parsed.data.email } })
        if (!user) return null
        const ok = await compare(parsed.data.password, user.passwordHash)
        if (!ok) return null
        return { id: user.id, email: user.email, name: user.name, role: user.role }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        (session as any).user.role = token.role
      }
      return session
    }
  }
}
