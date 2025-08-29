import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { SOStatus, LotStatus } from '@prisma/client'

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

const confirmSchema = z.object({
  orderId: z.string().min(1)
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

export async function PUT(req: Request) {
  const data = await req.json()
  const parsed = confirmSchema.safeParse(data)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  try {
    const updated = await prisma.$transaction(async tx => {
      const order = await tx.salesOrder.findUnique({
        where: { id: parsed.data.orderId },
        include: { lines: true }
      })
      if (!order) throw new Error('Order not found')
      for (const line of order.lines) {
        const lot = await tx.inventoryLot.findFirst({
          where: { itemId: line.itemId, status: LotStatus.RELEASED, qty: { gte: line.qty } },
          orderBy: { createdAt: 'asc' }
        })
        if (!lot) throw new Error(`Insufficient stock for item ${line.itemId}`)
        await tx.inventoryLot.update({
          where: { id: lot.id },
          data: { qty: { decrement: line.qty } }
        })
      }
      return tx.salesOrder.update({
        where: { id: order.id },
        data: { status: SOStatus.CONFIRMED },
        include: { customer: true, lines: { include: { item: true } } }
      })
    })
    return NextResponse.json(updated)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

