'use client'
import { Item, ItemCategory } from '@prisma/client'

export default function ItemTable({ items }: { items: Item[] }) {
  const cat = (c: ItemCategory) => c.replace('_',' ')
  return (
    <table className="table">
      <thead>
        <tr>
          <th className="th">SKU</th>
          <th className="th">Name</th>
          <th className="th">Category</th>
          <th className="th">UOM</th>
          <th className="th">Active</th>
        </tr>
      </thead>
      <tbody>
        {items.map(it => (
          <tr key={it.id} className="hover:bg-gray-50">
            <td className="td">{it.sku}</td>
            <td className="td">{it.name}</td>
            <td className="td"><span className="badge">{cat(it.category)}</span></td>
            <td className="td">{it.uom}</td>
            <td className="td">{it.isActive ? 'Yes':'No'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
