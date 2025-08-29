import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getToken } from 'next-auth/jwt'

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

export async function GET(req: NextRequest) {
  const token = await getToken({ req })
  if (!token || token.role !== 'ADMIN') {
    return new NextResponse('Forbidden', { status: 403 })
  }
  const orders = await prisma.salesOrder.findMany({
    include: { customer: true, lines: { include: { item: true } } },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(orders)
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
    const customer = await prisma.customer.findFirst({ where: { name: parsed.data.customerName } })
    const customerId = customer
      ? customer.id
      : (await prisma.customer.create({ data: { name: parsed.data.customerName } })).id
    const order = await prisma.salesOrder.create({
      data: {
        orderNo: parsed.data.orderNo,
        customerId,
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
