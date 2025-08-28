'use client'
import { InventoryLot, Item, Bin, Warehouse } from '@prisma/client'

type LotWithRelations = InventoryLot & {
  item: Item
  bin: (Bin & { warehouse: Warehouse }) | null
}

export default function LotTable({ lots }: { lots: LotWithRelations[] }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th className="th">Lot</th>
          <th className="th">Item</th>
          <th className="th">Qty</th>
          <th className="th">UOM</th>
          <th className="th">Status</th>
          <th className="th">Bin</th>
        </tr>
      </thead>
      <tbody>
        {lots.map((lot) => (
          <tr key={lot.id} className="hover:bg-gray-50">
            <td className="td">{lot.lotNumber}</td>
            <td className="td">{lot.item.name}</td>
            <td className="td">{lot.qty}</td>
            <td className="td">{lot.uom}</td>
            <td className="td">{lot.status}</td>
            <td className="td">
              {lot.bin ? `${lot.bin.warehouse.name}/${lot.bin.code}` : '-'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
