import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const lead = await prisma.lead.findUnique({ where: { id: params.id } })
    if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (lead.customerId) {
      const customer = await prisma.customer.findUnique({ where: { id: lead.customerId } })
      return NextResponse.json(customer)
    }
    const customer = await prisma.customer.create({
      data: { name: lead.name, email: lead.email, phone: lead.phone }
    })
    await prisma.lead.update({ where: { id: lead.id }, data: { status: 'CONVERTED', customerId: customer.id } })
    return NextResponse.json(customer)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
