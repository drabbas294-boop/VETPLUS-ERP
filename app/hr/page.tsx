import EmployeeTable from '@/EmployeeTable'
import EmployeeForm from '@/EmployeeForm'
import { prisma } from '@/lib/prisma'

async function loadEmployees() {
  try {
    return await prisma.employee.findMany({ include: { department: true, role: true, user: true }, orderBy: { createdAt: 'desc' } })
  } catch {
    return []
  }
}

export default async function Page() {
  const employees = await loadEmployees()
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Employees</h1>
      <div className="mb-8">
        <EmployeeForm />
      </div>
      <EmployeeTable employees={employees} />
    </div>
  )
}
