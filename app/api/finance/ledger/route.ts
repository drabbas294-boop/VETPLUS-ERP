import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const accountId = searchParams.get('account')
  if (!accountId) return NextResponse.json({ error: 'account required' }, { status: 400 })

  const lines = await prisma.journalLine.findMany({
    where: { accountId },
    include: { entry: true, account: true },
    orderBy: [{ entry: { date: 'asc' } }, { createdAt: 'asc' }],
  })

  let balance = 0
  const data = lines.map(l => {
    balance += l.debit - l.credit
    return {
      date: l.entry.date,
      description: l.entry.description,
      debit: l.debit,
      credit: l.credit,
      balance,
    }
  })

  return NextResponse.json(data)
}
