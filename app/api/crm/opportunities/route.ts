import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { OpportunityStage } from '@prisma/client'

const schema = z.object({
  title: z.string().min(1),
  value: z.number().optional(),
  stage: z.nativeEnum(OpportunityStage).optional(),
  leadId: z.string().optional(),
  customerId: z.string().optional()
})

export async function GET() {
  const ops = await prisma.opportunity.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(ops)
}

export async function POST(req: Request) {
  const data = await req.json()
  const parsed = schema.safeParse(data)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  try {
    const op = await prisma.opportunity.create({ data: parsed.data })
    return NextResponse.json(op)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
