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
    const order = await prisma.salesOrder.findUnique({
      where: { id: params.id },
      include: { lines: true },
    })
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const total = order.lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0)

    await ensureAccount('AR', 'Accounts Receivable', 'ASSET')
    await ensureAccount('SALES', 'Sales Revenue', 'REVENUE')

    await prisma.$transaction([
      prisma.salesOrder.update({
        where: { id: order.id },
        data: { status: 'INVOICED' },
      }),
      prisma.journalEntry.create({
        data: {
          description: `Sales order ${order.orderNo}`,
          lines: {
            create: [
              { account: { connect: { code: 'AR' } }, debit: total },
              { account: { connect: { code: 'SALES' } }, credit: total },
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
