import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const createSchema = z.object({
  customerId: z.string().min(1),
  itemId: z.string().min(1),
  description: z.string().optional()
})

export async function GET() {
  const tickets = await prisma.serviceTicket.findMany({
    include: { customer: true, item: true, assignedTo: true },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(tickets)
}

export async function POST(req: Request) {
  const data = await req.json()
  const parsed = createSchema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  }
  try {
    const ticket = await prisma.serviceTicket.create({
      data: parsed.data,
      include: { customer: true, item: true }
    })
    return NextResponse.json(ticket)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

