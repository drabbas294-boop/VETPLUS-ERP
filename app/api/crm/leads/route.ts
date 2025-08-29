import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { LeadStatus } from '@prisma/client'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  status: z.nativeEnum(LeadStatus).optional()
})

export async function GET() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, include: { interactions: true } })
  return NextResponse.json(leads)
}

export async function POST(req: Request) {
  const data = await req.json()
  const parsed = schema.safeParse(data)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  try {
    const lead = await prisma.lead.create({ data: { ...parsed.data, email: parsed.data.email || null, phone: parsed.data.phone || null } })
    return NextResponse.json(lead)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
