import { ProductionBatch, Item } from '@prisma/client'

type BatchWithItem = ProductionBatch & { fgItem: Item }

export default function BatchTable({ batches }: { batches: BatchWithItem[] }) {
  return (
    <table className="table-auto w-full text-left border">
      <thead>
        <tr>
          <th className="px-2 py-1 border">Batch #</th>
          <th className="px-2 py-1 border">Item</th>
          <th className="px-2 py-1 border">Qty</th>
          <th className="px-2 py-1 border">Status</th>
        </tr>
      </thead>
      <tbody>
        {batches.map(b => (
          <tr key={b.id}>
            <td className="px-2 py-1 border">{b.batchNumber}</td>
            <td className="px-2 py-1 border">{b.fgItem.name}</td>
            <td className="px-2 py-1 border">{b.plannedQty} {b.uom}</td>
            <td className="px-2 py-1 border">{b.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
