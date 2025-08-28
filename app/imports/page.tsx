import ImportForm from './ImportForm'
import { prisma } from '@/lib/prisma'

async function loadRecords() {
  try {
    return await prisma.importRecord.findMany({ include: { item: true }, orderBy: { createdAt: 'desc' } })
  } catch {
    return []
  }
}

export default async function Page() {
  const records = await loadRecords()
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Imports</h1>
      <div className="mb-8"><ImportForm /></div>
      <table className="table">
        <thead>
          <tr>
            <th className="th">Item</th>
            <th className="th">Qty</th>
            <th className="th">Arrival</th>
          </tr>
        </thead>
        <tbody>
          {records.map(r=> (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="td">{r.item.name}</td>
              <td className="td">{r.qty} {r.uom}</td>
              <td className="td">{r.arrivalDate ? new Date(r.arrivalDate).toLocaleDateString() : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
