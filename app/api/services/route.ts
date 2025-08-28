import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({ description: z.string().min(1), status: z.string().optional() })

export async function GET() {
  try {
    const services = await prisma.serviceOrder.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(services)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: Request) {
  const data = await req.json()
  const parsed = schema.safeParse(data)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  try {
    const service = await prisma.serviceOrder.create({ data: { description: parsed.data.description, status: parsed.data.status as any || undefined } })
    return NextResponse.json(service)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
