import LotForm from '@/LotForm'
import LotTable from '@/LotTable'
import { prisma } from '@/lib/prisma'

async function loadLots() {
  try {
    return await prisma.inventoryLot.findMany({
      include: { item: true, bin: { include: { warehouse: true } } },
      orderBy: { createdAt: 'desc' }
    })
  } catch {
    return []
  }
}

export default async function Page() {
  const lots = await loadLots()
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Inventory Lots</h1>
      <div className="mb-8">
        <LotForm />
      </div>
      <LotTable lots={lots} />
    </div>
  )
}
