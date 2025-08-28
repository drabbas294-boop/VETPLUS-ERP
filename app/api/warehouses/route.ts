import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({ name: z.string().min(1), code: z.string().min(1), address: z.string().optional() })

export async function GET() {
  try {
    const warehouses = await prisma.warehouse.findMany({ include: { bins: true } })
    return NextResponse.json(warehouses)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: Request) {
  const data = await req.json()
  const parsed = schema.safeParse(data)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  try {
    const wh = await prisma.warehouse.create({ data: { name: parsed.data.name, code: parsed.data.code, address: parsed.data.address || null } })
    return NextResponse.json(wh)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
