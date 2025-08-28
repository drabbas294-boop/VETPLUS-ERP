import { InventoryLot, Item, Bin, Warehouse } from '@prisma/client'

type LotWithRelations = InventoryLot & { item: Item; bin: (Bin & { warehouse: Warehouse }) | null }

export default function LotTable({ lots }: { lots: LotWithRelations[] }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th className="th">Lot #</th>
          <th className="th">Item</th>
          <th className="th">Qty</th>
          <th className="th">Status</th>
          <th className="th">Bin</th>
        </tr>
      </thead>
      <tbody>
        {lots.map(l => (
          <tr key={l.id} className="hover:bg-gray-50">
            <td className="td">{l.lotNumber}</td>
            <td className="td">{l.item.name}</td>
            <td className="td">{l.qty} {l.uom}</td>
            <td className="td"><span className="badge">{l.status}</span></td>
            <td className="td">{l.bin ? `${l.bin.warehouse.name}/${l.bin.code}` : '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
