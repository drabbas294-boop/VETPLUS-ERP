import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({ saleNo: z.string().min(1), itemId: z.string().min(1), qty: z.number(), uom: z.string(), unitPrice: z.number() })

export async function GET() {
  try {
    const sales = await prisma.pOSale.findMany({ include: { item: true }, orderBy: { date: 'desc' } })
    return NextResponse.json(sales)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: Request) {
  const data = await req.json()
  const parsed = schema.safeParse(data)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  try {
    const sale = await prisma.pOSale.create({ data: parsed.data, include: { item: true } })
    return NextResponse.json(sale)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
