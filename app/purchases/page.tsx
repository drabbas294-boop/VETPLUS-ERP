import PurchaseOrderForm from '@/PurchaseOrderForm'
import PurchaseOrderTable from '@/PurchaseOrderTable'
import { prisma } from '@/lib/prisma'

async function loadOrders() {
  try {
    return await prisma.purchaseOrder.findMany({
      include: { supplier: true, lines: { include: { item: true } } },
      orderBy: { createdAt: 'desc' }
    })
  } catch {
    return []
  }
}

export default async function Page() {
  const orders = await loadOrders()
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Purchase Orders</h1>
      <div className="mb-8">
        <PurchaseOrderForm />
      </div>
      <PurchaseOrderTable orders={orders} />
    </div>
  )
}
