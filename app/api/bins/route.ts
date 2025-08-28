import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const bins = await prisma.bin.findMany({
    include: { warehouse: true },
    orderBy: { code: 'asc' }
  })
  return NextResponse.json(bins)
}
