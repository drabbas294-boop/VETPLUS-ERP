import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  department: z.string().optional().or(z.literal('')),
  role: z.string().optional().or(z.literal('')),
  userEmail: z.string().email().optional().or(z.literal(''))
})

export async function GET() {
  const employees = await prisma.employee.findMany({
    include: { department: true, role: true, user: true },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(employees)
}

export async function POST(req: Request) {
  const data = await req.json()
  const parsed = schema.safeParse(data)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  try {
    const { department, role, userEmail, ...rest } = parsed.data
    let deptConnect: any = undefined
    if (department) {
      const dept = await prisma.department.upsert({ where: { name: department }, create: { name: department }, update: {} })
      deptConnect = { connect: { id: dept.id } }
    }
    let roleConnect: any = undefined
    if (role) {
      const r = await prisma.jobRole.upsert({ where: { name: role }, create: { name: role }, update: {} })
      roleConnect = { connect: { id: r.id } }
    }
    let userConnect: any = undefined
    if (userEmail) {
      const u = await prisma.user.findUnique({ where: { email: userEmail } })
      if (u) userConnect = { connect: { id: u.id } }
    }
    const employee = await prisma.employee.create({
      data: {
        firstName: rest.firstName,
        lastName: rest.lastName,
        email: rest.email || null,
        phone: rest.phone || null,
        ...(deptConnect ? { department: deptConnect } : {}),
        ...(roleConnect ? { role: roleConnect } : {}),
        ...(userConnect ? { user: userConnect } : {})
      },
      include: { department: true, role: true, user: true }
    })
    return NextResponse.json(employee)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
