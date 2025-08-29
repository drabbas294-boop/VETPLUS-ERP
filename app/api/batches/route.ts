import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { BatchStatus, LotStatus } from '@prisma/client'

const schema = z.object({
  fgItemId: z.string().min(1),
  batchNumber: z.string().min(1),
  plannedQty: z.number(),
  uom: z.string().min(1)
})

const completeSchema = z.object({
  batchId: z.string().min(1)
})

export async function GET() {
  const batches = await prisma.productionBatch.findMany({
    include: { fgItem: true },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(batches)
}

export async function POST(req: Request) {
  const data = await req.json()
  const parsed = schema.safeParse({ ...data, plannedQty: Number(data.plannedQty) })
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  try {
    const batch = await prisma.productionBatch.create({ data: parsed.data })
    return NextResponse.json(batch)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const data = await req.json()
  const parsed = completeSchema.safeParse(data)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  try {
    const updated = await prisma.$transaction(async tx => {
      const batch = await tx.productionBatch.findUnique({ where: { id: parsed.data.batchId } })
      if (!batch) throw new Error('Batch not found')
      const formulation = await tx.formulation.findFirst({
        where: { itemId: batch.fgItemId },
        include: { lines: true }
      })
      if (!formulation) throw new Error('Formulation not found')
      for (const line of formulation.lines) {
        const required = line.qty * batch.plannedQty
        const lot = await tx.inventoryLot.findFirst({
          where: { itemId: line.childId, status: LotStatus.RELEASED, qty: { gte: required } },
          orderBy: { createdAt: 'asc' }
        })
        if (!lot) throw new Error(`Insufficient stock for component ${line.childId}`)
        await tx.inventoryLot.update({
          where: { id: lot.id },
          data: { qty: { decrement: required } }
        })
      }
      await tx.inventoryLot.create({
        data: {
          itemId: batch.fgItemId,
          lotNumber: batch.batchNumber,
          qty: batch.plannedQty,
          uom: batch.uom,
          status: LotStatus.QUARANTINE
        }
      })
      return tx.productionBatch.update({
        where: { id: batch.id },
        data: { status: BatchStatus.COMPLETED, finishedAt: new Date() }
      })
    })
    return NextResponse.json(updated)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

