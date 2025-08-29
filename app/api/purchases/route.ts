import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const lineSchema = z.object({
  itemId: z.string().min(1),
  qty: z.number().positive(),
  unitCost: z.number().nonnegative(),
})

const schema = z.object({
  orderNo: z.string().min(1),
  supplierName: z.string().min(1),
  lines: z.array(lineSchema).min(1),
})

export async function GET() {
  const orders = await prisma.purchaseOrder.findMany({
    include: { supplier: true, lines: { include: { item: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(orders)
}

export async function POST(req: Request) {
  const data = await req.json()
  const parsed = schema.safeParse(data)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  try {
    const supplier = await prisma.supplier.findFirst({ where: { name: parsed.data.supplierName } })
    const supplierId = supplier
      ? supplier.id
      : (await prisma.supplier.create({ data: { name: parsed.data.supplierName } })).id
    const order = await prisma.purchaseOrder.create({
      data: {
        orderNo: parsed.data.orderNo,
        supplierId,
        lines: {
          create: parsed.data.lines.map(l => ({ itemId: l.itemId, qty: l.qty, uom: 'ea', unitCost: l.unitCost })),
        },
      },
      include: { supplier: true, lines: { include: { item: true } } },
    })
    return NextResponse.json(order)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
