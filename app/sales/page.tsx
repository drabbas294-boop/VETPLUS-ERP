import SalesOrderForm from './SalesOrderForm'
import { prisma } from '@/lib/prisma'

async function loadOrders() {
  try {
    return await prisma.salesOrder.findMany({
      include: { customer: true, lines: { include: { item: true } } },
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
      <h1 className="text-xl font-bold mb-4">Sales Orders</h1>
      <div className="mb-8">
        <SalesOrderForm />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th className="th">Order No</th>
            <th className="th">Customer</th>
            <th className="th">Items</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} className="hover:bg-gray-50">
              <td className="td">{o.orderNo}</td>
              <td className="td">{o.customer.name}</td>
              <td className="td">
                {o.lines.map(l => (
                  <div key={l.id}>{l.qty} x {l.item.name} @ {l.unitPrice}</div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
