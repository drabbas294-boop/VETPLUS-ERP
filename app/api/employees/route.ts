import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const employeeSchema = z.object({
  name: z.string(),
  email: z.string().email().optional(),
  position: z.string().optional()
})

export async function GET() {
  try {
    const employees = await prisma.employee.findMany()
    return Response.json(employees)
  } catch (e) {
    return Response.json([], { status: 500 })
  }
}

export async function POST(req: Request) {
  const data = await req.json()
  const parsed = employeeSchema.safeParse(data)
  if (!parsed.success) {
    return Response.json({ error: 'Invalid data' }, { status: 400 })
  }
  try {
    const emp = await prisma.employee.create({ data: parsed.data })
    return Response.json(emp)
  } catch (e) {
    return Response.json({ error: 'Failed to create' }, { status: 500 })
  }
}
