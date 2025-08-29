import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ItemCategory } from '@prisma/client'
import { getToken } from 'next-auth/jwt'

const schema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  category: z.nativeEnum(ItemCategory),
  uom: z.string().min(1)
})

export async function GET(req: NextRequest) {
  const token = await getToken({ req })
  if (!token || token.role !== 'ADMIN') {
    return new NextResponse('Forbidden', { status: 403 })
  }
  const items = await prisma.item.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req })
  if (!token || token.role !== 'ADMIN') {
    return new NextResponse('Forbidden', { status: 403 })
  }
  const data = await req.json()
  const parsed = schema.safeParse(data)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  try {
    const item = await prisma.item.create({ data: parsed.data })
    return NextResponse.json(item)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
