import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const bins = await prisma.bin.findMany({ include: { warehouse: true } })
    return Response.json(bins)
  } catch (e) {
    return Response.json([], { status: 500 })
  }
}
