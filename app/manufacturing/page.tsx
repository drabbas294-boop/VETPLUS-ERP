import BatchForm from '@/BatchForm'
import BatchTable from '@/BatchTable'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

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
  const role = (await auth())?.user.role
  if (role !== 'ADMIN') {
    return new Response('Forbidden', { status: 403 })
  }

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
