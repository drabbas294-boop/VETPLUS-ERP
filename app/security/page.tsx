import UserForm from './UserForm'
import { prisma } from '@/lib/prisma'

async function loadUsers() {
  try {
    return await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
  } catch {
    return []
  }
}

export default async function Page() {
  const users = await loadUsers()
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Security - Users</h1>
      <div className="mb-8"><UserForm /></div>
      <table className="table">
        <thead>
          <tr>
            <th className="th">Email</th>
            <th className="th">Name</th>
            <th className="th">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u=> (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="td">{u.email}</td>
              <td className="td">{u.name}</td>
              <td className="td">{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
