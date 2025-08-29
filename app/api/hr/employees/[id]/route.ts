import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  department: z.string().optional().or(z.literal('')),
  role: z.string().optional().or(z.literal('')),
  userEmail: z.string().email().optional().or(z.literal(''))
})

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const employee = await prisma.employee.findUnique({
    where: { id: params.id },
    include: { department: true, role: true, user: true }
  })
  if (!employee) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(employee)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json()
  const parsed = schema.safeParse(data)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  try {
    const { department, role, userEmail, ...rest } = parsed.data
    let deptAction: any = undefined
    if (department !== undefined) {
      if (department === '') deptAction = { disconnect: true }
      else {
        const dept = await prisma.department.upsert({ where: { name: department }, create: { name: department }, update: {} })
        deptAction = { connect: { id: dept.id } }
      }
    }
    let roleAction: any = undefined
    if (role !== undefined) {
      if (role === '') roleAction = { disconnect: true }
      else {
        const r = await prisma.jobRole.upsert({ where: { name: role }, create: { name: role }, update: {} })
        roleAction = { connect: { id: r.id } }
      }
    }
    let userAction: any = undefined
    if (userEmail !== undefined) {
      if (userEmail === '') userAction = { disconnect: true }
      else {
        const u = await prisma.user.findUnique({ where: { email: userEmail } })
        if (u) userAction = { connect: { id: u.id } }
      }
    }
    const employee = await prisma.employee.update({
      where: { id: params.id },
      data: {
        ...rest,
        ...(deptAction ? { department: deptAction } : {}),
        ...(roleAction ? { role: roleAction } : {}),
        ...(userAction ? { user: userAction } : {})
      },
      include: { department: true, role: true, user: true }
    })
    return NextResponse.json(employee)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.employee.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
