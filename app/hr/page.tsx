'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

type Employee = { id: string, name: string, email?: string, position?: string }

export default function HRPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [form, setForm] = useState({ name: '', email: '', position: '' })
  const [loading, setLoading] = useState(false)

  async function load() {
    const res = await axios.get('/api/employees')
    setEmployees(res.data)
  }
  useEffect(() => { load() }, [])

  async function remove(id: string) {
    await axios.delete(`/api/employees/${id}`)
    load()
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await axios.post('/api/employees', form)
    setForm({ name: '', email: '', position: '' })
    setLoading(false)
    load()
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">HR - Employees</h1>
      <form onSubmit={submit} className="mb-6 space-y-3 max-w-md">
        <div>
          <label className="label">Name</label>
          <input className="input" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        </div>
        <div>
          <label className="label">Position</label>
          <input className="input" value={form.position} onChange={e=>setForm({...form, position:e.target.value})} />
        </div>
        <button className="btn" disabled={loading}>{loading?'Saving...':'Add Employee'}</button>
      </form>
      <table className="table-auto w-full">
        <thead>
          <tr><th className="px-2 py-1">Name</th><th className="px-2 py-1">Email</th><th className="px-2 py-1">Position</th><th className="px-2 py-1" /></tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id} className="border-t">
              <td className="px-2 py-1">{emp.name}</td>
              <td className="px-2 py-1">{emp.email}</td>
              <td className="px-2 py-1">{emp.position}</td>
              <td className="px-2 py-1 text-right"><button onClick={() => remove(emp.id)} className="text-red-600 text-sm">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
