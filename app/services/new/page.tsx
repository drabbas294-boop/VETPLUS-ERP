import NewTicketForm from '@/NewTicketForm'
import { prisma } from '@/lib/prisma'

async function loadData() {
  try {
    const customers = await prisma.customer.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } })
    const items = await prisma.item.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } })
    return { customers, items }
  } catch {
    return { customers: [], items: [] }
  }
}

export default async function Page() {
  const data = await loadData()
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">New Service Ticket</h1>
      <NewTicketForm customers={data.customers} items={data.items} />
    </div>
  )
}

