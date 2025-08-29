'use client'

import { PurchaseOrder, Supplier, PurchaseOrderLine, Item } from '@prisma/client'
import axios from 'axios'

type Order = PurchaseOrder & { supplier: Supplier, lines: (PurchaseOrderLine & { item: Item })[] }

export default function PurchaseOrderTable({ orders }: { orders: Order[] }) {
  async function receive(id: string) {
    await axios.put('/api/purchases', { id, status: 'RECEIVED' })
    window.location.reload()
  }
  return (
    <table className="table">
      <thead>
        <tr>
          <th className="th">Order No</th>
          <th className="th">Supplier</th>
          <th className="th">Status</th>
          <th className="th">Lines</th>
          <th className="th">Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(o => (
          <tr key={o.id} className="hover:bg-gray-50">
            <td className="td">{o.orderNo}</td>
            <td className="td">{o.supplier?.name}</td>
            <td className="td">{o.status}</td>
            <td className="td">
              {o.lines.map(l => (
                <div key={l.id}>{l.item?.sku} ({l.qty} {l.uom})</div>
              ))}
            </td>
            <td className="td">
              {o.status !== 'RECEIVED' && (
                <button className="btn" onClick={() => receive(o.id)}>Receive</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
