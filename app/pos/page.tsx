import POSForm from './POSForm'
import { prisma } from '@/lib/prisma'

async function loadSales() {
  try {
    return await prisma.pOSale.findMany({ include: { item: true }, orderBy: { date: 'desc' } })
  } catch {
    return []
  }
}

export default async function Page() {
  const sales = await loadSales()
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">POS Sales</h1>
      <div className="mb-8">
        <POSForm />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th className="th">Sale No</th>
            <th className="th">Item</th>
            <th className="th">Qty</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(s=> (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="td">{s.saleNo}</td>
              <td className="td">{s.item.name}</td>
              <td className="td">{s.qty} {s.uom} @ {s.unitPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
