import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({ name: z.string().min(1), value: z.number(), acquiredAt: z.string().optional() })

export async function GET() {
  try {
    const assets = await prisma.asset.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(assets)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: Request) {
  const data = await req.json()
  const parsed = schema.safeParse(data)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  try {
    const asset = await prisma.asset.create({ data: { name: parsed.data.name, value: parsed.data.value, acquiredAt: parsed.data.acquiredAt ? new Date(parsed.data.acquiredAt) : null } })
    return NextResponse.json(asset)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
