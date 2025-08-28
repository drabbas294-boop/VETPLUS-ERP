import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { LotStatus } from '@prisma/client'

export const dynamic = 'force-dynamic'

const schema = z.object({
  itemId: z.string().min(1),
  lotNumber: z.string().min(1),
  qty: z.number(),
  uom: z.string().min(1),
  status: z.nativeEnum(LotStatus),
  binId: z.string().optional().or(z.literal(''))
})

export async function GET() {
  const lots = await prisma.inventoryLot.findMany({
    include: { item: true, bin: { include: { warehouse: true } } },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(lots)
}

export async function POST(req: Request) {
  const data = await req.json()
  const parsed = schema.safeParse({ ...data, qty: Number(data.qty) })
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  try {
    const lot = await prisma.inventoryLot.create({
      data: { ...parsed.data, binId: parsed.data.binId || null }
    })
    return NextResponse.json(lot)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
