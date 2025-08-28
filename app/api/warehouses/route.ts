import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const schema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  address: z.string().optional().or(z.literal(''))
})

export async function GET() {
  const warehouses = await prisma.warehouse.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(warehouses)
}

export async function POST(req: Request) {
  const data = await req.json()
  const parsed = schema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  }
  try {
    const warehouse = await prisma.warehouse.create({
      data: { name: parsed.data.name, code: parsed.data.code, address: parsed.data.address || null }
    })
    return NextResponse.json(warehouse)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
