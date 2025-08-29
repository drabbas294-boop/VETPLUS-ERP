'use client'
import Link from 'next/link'
import { Employee, Department, JobRole, User } from '@prisma/client'

type Emp = Employee & { department: Department | null, role: JobRole | null, user: User | null }

export default function EmployeeTable({ employees }: { employees: Emp[] }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th className="th">Name</th>
          <th className="th">Department</th>
          <th className="th">Role</th>
          <th className="th">Email</th>
          <th className="th">Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees.map(e => (
          <tr key={e.id} className="hover:bg-gray-50">
            <td className="td">{e.firstName} {e.lastName}</td>
            <td className="td">{e.department?.name || ''}</td>
            <td className="td">{e.role?.name || ''}</td>
            <td className="td">{e.email || ''}</td>
            <td className="td"><Link href={`/hr/${e.id}`} className="link">Edit</Link></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
