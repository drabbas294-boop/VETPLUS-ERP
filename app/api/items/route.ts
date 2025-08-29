import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ItemCategory, Prisma } from '@prisma/client'

const schema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  category: z.nativeEnum(ItemCategory),
  uom: z.string().min(1)
})

export async function GET() {
  const items = await prisma.item.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const data = await req.json()
  const parsed = schema.safeParse(data)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  try {
    const item = await prisma.item.create({ data: parsed.data })
    return NextResponse.json(item)
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return NextResponse.json({ error: 'SKU must be unique' }, { status: 409 })
    }
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

const updateSchema = schema.extend({ id: z.string().min(1), isActive: z.boolean().optional() })

export async function PUT(req: Request) {
  const data = await req.json()
  const parsed = updateSchema.safeParse(data)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  try {
    const { id, ...rest } = parsed.data
    const item = await prisma.item.update({ where: { id }, data: rest })
    return NextResponse.json(item)
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') return NextResponse.json({ error: 'SKU must be unique' }, { status: 409 })
      if (e.code === 'P2025') return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const data = await req.json()
  const parsed = z.object({ id: z.string().min(1) }).safeParse(data)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  try {
    await prisma.item.delete({ where: { id: parsed.data.id } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
