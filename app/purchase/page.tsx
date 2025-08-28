import PurchaseOrderForm from './PurchaseOrderForm'
import { prisma } from '@/lib/prisma'

async function loadOrders() {
  try {
    return await prisma.purchaseOrder.findMany({ include: { supplier: true, lines: { include: { item: true } } }, orderBy: { createdAt: 'desc' } })
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
      <table className="table">
        <thead>
          <tr>
            <th className="th">Order No</th>
            <th className="th">Supplier</th>
            <th className="th">Items</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o=> (
            <tr key={o.id} className="hover:bg-gray-50">
              <td className="td">{o.orderNo}</td>
              <td className="td">{o.supplier.name}</td>
              <td className="td">{o.lines.map(l=> <div key={l.id}>{l.qty} x {l.item.name} @ {l.unitCost}</div>)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
