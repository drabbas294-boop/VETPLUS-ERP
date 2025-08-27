import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const lineSchema = z.object({
  itemId: z.string().min(1),
  qty: z.number().positive(),
  unitPrice: z.number().nonnegative()
})

const schema = z.object({
  orderNo: z.string().min(1),
  customerName: z.string().min(1),
  lines: z.array(lineSchema).min(1)
})

export async function GET() {
  const orders = await prisma.salesOrder.findMany({
    include: { customer: true, lines: { include: { item: true } } },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(orders)
}

export async function POST(req: Request) {
  const data = await req.json()
  const parsed = schema.safeParse(data)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  try {
    const customer = await prisma.customer.upsert({
      where: { name: parsed.data.customerName },
      update: {},
      create: { name: parsed.data.customerName }
    })
    const order = await prisma.salesOrder.create({
      data: {
        orderNo: parsed.data.orderNo,
        customerId: customer.id,
        lines: {
          create: parsed.data.lines.map(l => ({ itemId: l.itemId, qty: l.qty, uom: 'ea', unitPrice: l.unitPrice }))
        }
      },
      include: { customer: true, lines: { include: { item: true } } }
    })
    return NextResponse.json(order)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
