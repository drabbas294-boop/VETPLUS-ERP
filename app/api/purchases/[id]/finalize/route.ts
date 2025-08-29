import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

async function ensureAccount(code: string, name: string, type: any) {
  await prisma.account.upsert({
    where: { code },
    update: {},
    create: { code, name, type },
  })
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.purchaseOrder.findUnique({
      where: { id: params.id },
      include: { lines: true },
    })
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const total = order.lines.reduce((sum, l) => sum + l.qty * l.unitCost, 0)

    await ensureAccount('INV', 'Inventory', 'ASSET')
    await ensureAccount('AP', 'Accounts Payable', 'LIABILITY')

    await prisma.$transaction([
      prisma.purchaseOrder.update({
        where: { id: order.id },
        data: { status: 'RECEIVED' },
      }),
      prisma.journalEntry.create({
        data: {
          description: `Purchase order ${order.orderNo}`,
          lines: {
            create: [
              { account: { connect: { code: 'INV' } }, debit: total },
              { account: { connect: { code: 'AP' } }, credit: total },
            ],
          },
        },
      }),
    ])

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
