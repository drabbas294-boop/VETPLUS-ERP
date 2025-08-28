import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const schema = z.object({
  code: z.string().min(1),
  warehouseId: z.string().min(1)
})

export async function GET() {
  const bins = await prisma.bin.findMany({
    include: { warehouse: true },
    orderBy: { code: 'asc' }
  })
  return NextResponse.json(bins)
}

export async function POST(req: Request) {
  const data = await req.json()
  const parsed = schema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  }
  try {
    const bin = await prisma.bin.create({ data: parsed.data })
    return NextResponse.json(bin)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
