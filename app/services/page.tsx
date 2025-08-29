import Link from 'next/link'
import { prisma } from '@/lib/prisma'

async function loadTickets() {
  try {
    return await prisma.serviceTicket.findMany({
      include: { customer: true, item: true, assignedTo: true },
      orderBy: { createdAt: 'desc' }
    })
  } catch {
    return []
  }
}

export default async function Page() {
  const tickets = await loadTickets()
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Service Tickets</h1>
      <div className="mb-4">
        <Link href="/services/new" className="btn">New Ticket</Link>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th className="th">Customer</th>
            <th className="th">Item</th>
            <th className="th">Status</th>
            <th className="th">Assigned To</th>
            <th className="th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(t => (
            <tr key={t.id} className="hover:bg-gray-50">
              <td className="td">{t.customer.name}</td>
              <td className="td">{t.item.name}</td>
              <td className="td"><span className="badge">{t.status}</span></td>
              <td className="td">{t.assignedTo?.name || '-'}</td>
              <td className="td space-x-2">
                {t.status === 'NEW' && (
                  <Link href={`/services/${t.id}/assign`} className="btn">Assign</Link>
                )}
                {t.status !== 'CLOSED' && (
                  <Link href={`/services/${t.id}/close`} className="btn">Close</Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

