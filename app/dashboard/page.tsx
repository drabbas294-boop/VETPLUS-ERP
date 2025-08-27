import { prisma } from '@/lib/prisma'

export default async function Dashboard() {
  const [items, suppliers, lots] = await Promise.all([
    prisma.item.count().catch(() => 0),
    prisma.supplier.count().catch(() => 0),
    prisma.inventoryLot.count().catch(() => 0)
  ])
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>
      <p className="mb-2">Items: {items}</p>
      <p className="mb-2">Suppliers: {suppliers}</p>
      <p>Lots: {lots}</p>
    </div>
  )
}
