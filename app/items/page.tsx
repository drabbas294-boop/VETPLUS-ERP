import ItemTable from '@/ItemTable'
import NewItemForm from '@/NewItemForm'
import { prisma } from '@/lib/prisma'

async function loadItems() {
  try {
    return await prisma.item.findMany({ orderBy: { createdAt: 'desc' } })
  } catch {
    return []
  }
}

export default async function Page() {
  const items = await loadItems()
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Items</h1>
      <div className="mb-8">
        <NewItemForm />
      </div>
      <ItemTable items={items} />
    </div>
  )
}
