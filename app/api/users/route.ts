import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { hash } from 'bcryptjs'

const schema = z.object({ email: z.string().email(), name: z.string().optional(), password: z.string().min(4), role: z.string().optional() })

export async function GET() {
  try {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(users)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: Request) {
  const data = await req.json()
  const parsed = schema.safeParse(data)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  try {
    const passwordHash = await hash(parsed.data.password, 10)
    const user = await prisma.user.create({ data: { email: parsed.data.email, name: parsed.data.name, passwordHash, role: (parsed.data.role as any) || 'USER' } })
    return NextResponse.json(user)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
