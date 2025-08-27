import SupplierForm from '@/SupplierForm'
import { prisma } from '@/lib/prisma'

export default async function Page() {
  const suppliers = await prisma.supplier.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Suppliers</h1>
      <div className="mb-8">
        <SupplierForm />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th className="th">Name</th>
            <th className="th">Email</th>
            <th className="th">Phone</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map(s => (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="td">{s.name}</td>
              <td className="td">{s.email}</td>
              <td className="td">{s.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
