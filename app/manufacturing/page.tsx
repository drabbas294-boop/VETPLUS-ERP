import BatchForm from '@/BatchForm'
import BatchTable from '@/BatchTable'
import { prisma } from '@/lib/prisma'

export default async function Page() {
  const batches = await prisma.productionBatch.findMany({
    include: { fgItem: true },
    orderBy: { createdAt: 'desc' }
  })
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Manufacturing</h1>
      <div className="mb-8">
        <BatchForm />
      </div>
      <BatchTable batches={batches} />
    </div>
  )
}
