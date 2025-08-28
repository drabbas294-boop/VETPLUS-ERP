import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

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
    const bin = await prisma.bin.create({
      data: parsed.data,
      include: { warehouse: true }
    })
    return NextResponse.json(bin)
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        return NextResponse.json({ error: 'Bin code already exists in this warehouse' }, { status: 409 })
      }
      if (e.code === 'P2003') {
        return NextResponse.json({ error: 'Warehouse not found' }, { status: 400 })
      }
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
