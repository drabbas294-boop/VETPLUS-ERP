import SupplierForm from '@/SupplierForm'
import SupplierTable from '@/SupplierTable'
import { prisma } from '@/lib/prisma'

async function loadSuppliers() {
  try {
    return await prisma.supplier.findMany({ orderBy: { createdAt: 'desc' } })
  } catch {
    return []
  }
}

export default async function Page() {
  const suppliers = await loadSuppliers()
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Suppliers</h1>
      <div className="mb-8">
        <SupplierForm />
      </div>
      <SupplierTable suppliers={suppliers} />
    </div>
  )
}
