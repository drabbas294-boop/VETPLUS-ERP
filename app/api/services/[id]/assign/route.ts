import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { TicketStatus } from '@prisma/client'

const schema = z.object({
  userId: z.string().min(1)
})

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json()
  const parsed = schema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  }
  try {
    const ticket = await prisma.serviceTicket.update({
      where: { id: params.id },
      data: { assignedToId: parsed.data.userId, status: TicketStatus.ASSIGNED },
      include: { customer: true, item: true, assignedTo: true }
    })
    return NextResponse.json(ticket)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

