import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const accounts = await prisma.account.findMany({
    include: { lines: true },
    orderBy: { code: 'asc' },
  })

  const data = accounts.map(acc => {
    const debit = acc.lines.reduce((s, l) => s + l.debit, 0)
    const credit = acc.lines.reduce((s, l) => s + l.credit, 0)
    return { id: acc.id, code: acc.code, name: acc.name, debit, credit, balance: debit - credit }
  })

  return NextResponse.json(data)
}
