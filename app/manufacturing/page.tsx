import BatchForm from '@/components/BatchForm'
import BatchTable from '@/components/BatchTable'
import { prisma } from '@/lib/prisma'

async function loadBatches() {
  try {
    return await prisma.productionBatch.findMany({
      include: { fgItem: true },
      orderBy: { createdAt: 'desc' }
    })
  } catch {
    return []
  }
}

export default async function Page() {
  const batches = await loadBatches()
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
