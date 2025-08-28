import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({ itemId: z.string().min(1), qty: z.number(), uom: z.string(), arrivalDate: z.string().optional() })

export async function GET() {
  try {
    const records = await prisma.importRecord.findMany({ include: { item: true }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json(records)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: Request) {
  const data = await req.json()
  const parsed = schema.safeParse(data)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  try {
    const rec = await prisma.importRecord.create({ data: { ...parsed.data, arrivalDate: parsed.data.arrivalDate ? new Date(parsed.data.arrivalDate) : null } })
    return NextResponse.json(rec)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
