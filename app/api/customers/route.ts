import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const customerSchema = z.object({
  name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional()
})

export async function GET() {
  try {
    const customers = await prisma.customer.findMany()
    return Response.json(customers)
  } catch (e) {
    return Response.json([], { status: 500 })
  }
}

export async function POST(req: Request) {
  const data = await req.json()
  const parsed = customerSchema.safeParse(data)
  if (!parsed.success) {
    return Response.json({ error: 'Invalid data' }, { status: 400 })
  }
  try {
    const customer = await prisma.customer.create({ data: parsed.data })
    return Response.json(customer)
  } catch (e) {
    return Response.json({ error: 'Failed to create' }, { status: 500 })
  }
}
