import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authConfig } from './auth.config'

export const runtime = 'nodejs'

export const { auth, handlers: { GET, POST }, signIn, signOut } = NextAuth({
  ...authConfig,
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
        const { compare } = await import('bcryptjs')
        const ok = await compare(parsed.data.password, user.passwordHash)
        if (!ok) return null
        return { id: user.id, email: user.email, name: user.name, role: user.role }
      }
    })
  ]
})
