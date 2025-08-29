import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getToken } from 'next-auth/jwt'

const schema = z.object({
  fgItemId: z.string().min(1),
  batchNumber: z.string().min(1),
  plannedQty: z.number(),
  uom: z.string().min(1)
})

export async function GET(req: NextRequest) {
  const token = await getToken({ req })
  if (!token || token.role !== 'ADMIN') {
    return new NextResponse('Forbidden', { status: 403 })
  }
  const batches = await prisma.productionBatch.findMany({
    include: { fgItem: true },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(batches)
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req })
  if (!token || token.role !== 'ADMIN') {
    return new NextResponse('Forbidden', { status: 403 })
  }
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
