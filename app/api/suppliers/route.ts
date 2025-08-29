import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getToken } from 'next-auth/jwt'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal(''))
})

export async function POST(req: NextRequest) {
  const token = await getToken({ req })
  if (!token || token.role !== 'ADMIN') {
    return new NextResponse('Forbidden', { status: 403 })
  }
  const data = await req.json()
  const parsed = schema.safeParse(data)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  try {
    const supplier = await prisma.supplier.create({ data: { name: parsed.data.name, email: parsed.data.email || null, phone: parsed.data.phone || null } })
    return NextResponse.json(supplier)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const token = await getToken({ req })
  if (!token || token.role !== 'ADMIN') {
    return new NextResponse('Forbidden', { status: 403 })
  }
  const suppliers = await prisma.supplier.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(suppliers)
}
