import ServiceForm from './ServiceForm'
import { prisma } from '@/lib/prisma'

async function loadServices() {
  try {
    return await prisma.serviceOrder.findMany({ orderBy: { createdAt: 'desc' } })
  } catch {
    return []
  }
}

export default async function Page() {
  const services = await loadServices()
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Services</h1>
      <div className="mb-8"><ServiceForm /></div>
      <table className="table">
        <thead>
          <tr>
            <th className="th">Description</th>
            <th className="th">Status</th>
          </tr>
        </thead>
        <tbody>
          {services.map(s=> (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="td">{s.description}</td>
              <td className="td">{s.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
