import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const ledgerSchema = z.object({
  description: z.string(),
  amount: z.number(),
  date: z.string().optional()
})

export async function GET() {
  try {
    const entries = await prisma.ledgerEntry.findMany({ orderBy: { date: 'desc' } })
    return Response.json(entries)
  } catch (e) {
    return Response.json([], { status: 500 })
  }
}

export async function POST(req: Request) {
  const data = await req.json()
  const parsed = ledgerSchema.safeParse(data)
  if (!parsed.success) {
    return Response.json({ error: 'Invalid data' }, { status: 400 })
  }
  try {
    const entry = await prisma.ledgerEntry.create({
      data: { description: parsed.data.description, amount: parsed.data.amount, date: parsed.data.date ? new Date(parsed.data.date) : undefined }
    })
    return Response.json(entry)
  } catch (e) {
    return Response.json({ error: 'Failed to create' }, { status: 500 })
  }
}
