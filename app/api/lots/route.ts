import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const lotSchema = z.object({
  itemId: z.string(),
  lotNumber: z.string(),
  qty: z.number(),
  uom: z.string(),
  status: z.enum(['QUARANTINE','RELEASED','HOLD']),
  binId: z.string().optional()
})

export async function GET() {
  try {
    const lots = await prisma.inventoryLot.findMany({
      include: { item: true, bin: { include: { warehouse: true } } }
    })
    return Response.json(lots)
  } catch (e) {
    return Response.json([], { status: 500 })
  }
}

export async function POST(req: Request) {
  const data = await req.json()
  const parsed = lotSchema.safeParse(data)
  if (!parsed.success) {
    return Response.json({ error: 'Invalid data' }, { status: 400 })
  }
  try {
    const lot = await prisma.inventoryLot.create({ data: parsed.data })
    return Response.json(lot)
  } catch (e) {
    return Response.json({ error: 'Failed to create' }, { status: 500 })
  }
}
