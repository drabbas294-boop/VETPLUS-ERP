import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal(''))
})

export async function POST(req: Request) {
  const data = await req.json()
  const parsed = schema.safeParse(data)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  try {
    const supplier = await prisma.supplier.create({ data: { name: parsed.data.name, email: parsed.data.email || null, phone: parsed.data.phone || null } })
    return NextResponse.json(supplier)
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return NextResponse.json({ error: 'Duplicate supplier' }, { status: 409 })
    }
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

const updateSchema = schema.extend({ id: z.string().min(1) })

export async function PUT(req: Request) {
  const data = await req.json()
  const parsed = updateSchema.safeParse(data)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  try {
    const { id, ...rest } = parsed.data
    const supplier = await prisma.supplier.update({ where: { id }, data: { ...rest, email: rest.email || null, phone: rest.phone || null } })
    return NextResponse.json(supplier)
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') return NextResponse.json({ error: 'Duplicate supplier' }, { status: 409 })
      if (e.code === 'P2025') return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
    }
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const data = await req.json()
  const parsed = z.object({ id: z.string().min(1) }).safeParse(data)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  try {
    await prisma.supplier.delete({ where: { id: parsed.data.id } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
    }
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET() {
  const suppliers = await prisma.supplier.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(suppliers)
}
