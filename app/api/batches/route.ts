import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  fgItemId: z.string().min(1),
  batchNumber: z.string().min(1),
  plannedQty: z.number(),
  uom: z.string().min(1)
})

export async function GET() {
  const batches = await prisma.productionBatch.findMany({
    include: { fgItem: true },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(batches)
}

export async function POST(req: Request) {
  const data = await req.json()
  const parsed = schema.safeParse({ ...data, plannedQty: Number(data.plannedQty) })
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  try {
    const batch = await prisma.productionBatch.create({ data: parsed.data })
    return NextResponse.json(batch)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
