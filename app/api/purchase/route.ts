import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const lineSchema = z.object({ itemId: z.string(), qty: z.number(), uom: z.string(), unitCost: z.number() })
const schema = z.object({ orderNo: z.string().min(1), supplierId: z.string().min(1), lines: z.array(lineSchema).min(1) })

export async function GET() {
  try {
    const orders = await prisma.purchaseOrder.findMany({ include: { supplier: true, lines: { include: { item: true } } }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json(orders)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: Request) {
  const data = await req.json()
  const parsed = schema.safeParse(data)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  try {
    const order = await prisma.purchaseOrder.create({
      data: {
        orderNo: parsed.data.orderNo,
        supplierId: parsed.data.supplierId,
        lines: { create: parsed.data.lines }
      },
      include: { supplier: true, lines: { include: { item: true } } }
    })
    return NextResponse.json(order)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
