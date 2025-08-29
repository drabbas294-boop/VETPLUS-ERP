import AssignTicketForm from '@/AssignTicketForm'
import { prisma } from '@/lib/prisma'

interface Params { params: { id: string } }

async function loadUsers() {
  try {
    return await prisma.user.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } })
  } catch {
    return []
  }
}

export default async function Page({ params }: Params) {
  const users = await loadUsers()
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Assign Ticket</h1>
      <AssignTicketForm ticketId={params.id} users={users} />
    </div>
  )
}

