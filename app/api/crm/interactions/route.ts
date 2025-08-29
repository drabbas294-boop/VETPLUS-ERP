import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { InteractionType } from '@prisma/client'

const schema = z.object({
  leadId: z.string().optional(),
  opportunityId: z.string().optional(),
  customerId: z.string().optional(),
  type: z.nativeEnum(InteractionType),
  note: z.string().optional()
}).refine(data => data.leadId || data.opportunityId || data.customerId, {
  message: 'leadId, opportunityId or customerId required'
})

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const where: any = {}
  if (searchParams.get('leadId')) where.leadId = searchParams.get('leadId')
  if (searchParams.get('opportunityId')) where.opportunityId = searchParams.get('opportunityId')
  if (searchParams.get('customerId')) where.customerId = searchParams.get('customerId')
  const interactions = await prisma.interaction.findMany({ where, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(interactions)
}

export async function POST(req: Request) {
  const data = await req.json()
  const parsed = schema.safeParse(data)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  try {
    const interaction = await prisma.interaction.create({ data: parsed.data })
    return NextResponse.json(interaction)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
