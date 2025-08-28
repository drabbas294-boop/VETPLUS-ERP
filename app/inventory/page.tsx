import WarehouseForm from './WarehouseForm'
import BinForm from './BinForm'
import { prisma } from '@/lib/prisma'

async function load() {
  try {
    return await prisma.warehouse.findMany({ include: { bins: true }, orderBy: { createdAt: 'desc' } })
  } catch {
    return []
  }
}

export default async function Page() {
  const warehouses = await load()
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Inventory</h1>
      <WarehouseForm />
      <BinForm />
      <table className="table">
        <thead>
          <tr>
            <th className="th">Warehouse</th>
            <th className="th">Bins</th>
          </tr>
        </thead>
        <tbody>
          {warehouses.map(w=> (
            <tr key={w.id} className="hover:bg-gray-50">
              <td className="td">{w.name}</td>
              <td className="td">{w.bins.map(b=> <span key={b.id} className="mr-2">{b.code}</span>)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
