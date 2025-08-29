import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { POStatus } from '@prisma/client'

const lineSchema = z.object({
  itemId: z.string().min(1),
  qty: z.number(),
  uom: z.string().min(1),
  lotNumber: z.string().min(1)
})

const createSchema = z.object({
  orderNo: z.string().min(1),
  supplierId: z.string().min(1),
  lines: z.array(lineSchema)
})

export async function GET() {
  const orders = await prisma.purchaseOrder.findMany({
    include: { supplier: true, lines: { include: { item: true } } },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(orders)
}

export async function POST(req: Request) {
  const data = await req.json()
  const parsed = createSchema.safeParse({
    ...data,
    lines: data.lines?.map((l: any) => ({ ...l, qty: Number(l.qty) }))
  })
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
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

const updateSchema = z.object({
  id: z.string().min(1),
  status: z.nativeEnum(POStatus)
})

export async function PUT(req: Request) {
  const data = await req.json()
  const parsed = updateSchema.safeParse(data)
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  try {
    const existing = await prisma.purchaseOrder.findUnique({
      where: { id: parsed.data.id },
      include: { lines: true }
    })
    if (!existing)
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const updated = await prisma.purchaseOrder.update({
      where: { id: parsed.data.id },
      data: { status: parsed.data.status }
    })
    if (
      parsed.data.status === 'RECEIVED' &&
      existing.status !== 'RECEIVED'
    ) {
      const lotData = existing.lines.map((l) => ({
        itemId: l.itemId,
        lotNumber: l.lotNumber,
        qty: l.qty,
        uom: l.uom
      }))
      if (lotData.length) await prisma.inventoryLot.createMany({ data: lotData })
    }
    return NextResponse.json(updated)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

const deleteSchema = z.object({ id: z.string().min(1) })

export async function DELETE(req: Request) {
  const data = await req.json()
  const parsed = deleteSchema.safeParse(data)
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  try {
    await prisma.purchaseOrder.delete({ where: { id: parsed.data.id } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
