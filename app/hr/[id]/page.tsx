import EmployeeProfileForm from '@/EmployeeProfileForm'
import { prisma } from '@/lib/prisma'

export default async function Page({ params }: { params: { id: string } }) {
  const employee = await prisma.employee.findUnique({
    where: { id: params.id },
    include: { department: true, role: true, user: true }
  })
  if (!employee) return <div>Not found</div>
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Employee Profile</h1>
      <EmployeeProfileForm employee={employee} />
    </div>
  )
}
