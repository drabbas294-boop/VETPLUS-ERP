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
  lines: z.array(lineSchema).min(1)
})

export async function GET() {
  const orders = await prisma.pOSOrder.findMany({
    include: { lines: { include: { item: true } }, entries: true },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(orders)
}

export async function POST(req: Request) {
  const data = await req.json()
  const parsed = schema.safeParse(data)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  const total = parsed.data.lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0)
  try {
    const order = await prisma.$transaction(async tx => {
      const created = await tx.pOSOrder.create({
        data: {
          orderNo: parsed.data.orderNo,
          total,
          lines: {
            create: parsed.data.lines.map(l => ({ itemId: l.itemId, qty: l.qty, unitPrice: l.unitPrice }))
          }
        },
        include: { lines: true }
      })

      for (const line of created.lines) {
        const lot = await tx.inventoryLot.findFirst({ where: { itemId: line.itemId }, orderBy: { createdAt: 'asc' } })
        if (lot) {
          await tx.inventoryLot.update({ where: { id: lot.id }, data: { qty: { decrement: line.qty } } })
        }
      }

      await tx.accountingEntry.createMany({
        data: [
          { posOrderId: created.id, account: 'Cash', debit: total },
          { posOrderId: created.id, account: 'Sales', credit: total }
        ]
      })

      return created
    })

    return NextResponse.json(order)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
