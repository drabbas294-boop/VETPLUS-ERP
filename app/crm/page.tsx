'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

type Customer = { id: string, name: string, email?: string }

export default function CRMPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [form, setForm] = useState({ name: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    try {
      const res = await axios.get('/api/customers')
      setCustomers(res.data)
      setError(null)
    } catch {
      setError('Failed to load customers')
    }
  }

  async function remove(id: string) {
    try {
      await axios.delete(`/api/customers/${id}`)
      load()
    } catch {
      setError('Failed to delete customer')
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('/api/customers', form)
      setForm({ name: '', email: '' })
      setError(null)
      load()
    } catch {
      setError('Failed to add customer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">CRM - Customers</h1>
      <form onSubmit={submit} className="mb-6 space-y-3 max-w-md">
        <div>
          <label className="label">Name</label>
          <input className="input" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        </div>
        <button className="btn" disabled={loading}>{loading?'Saving...':'Add Customer'}</button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
      <table className="table-auto w-full">
        <thead>
          <tr><th className="px-2 py-1">Name</th><th className="px-2 py-1">Email</th><th className="px-2 py-1" /></tr>
        </thead>
        <tbody>
          {customers.map(c=> (
            <tr key={c.id} className="border-t">
              <td className="px-2 py-1">{c.name}</td>
              <td className="px-2 py-1">{c.email}</td>
              <td className="px-2 py-1 text-right">
                <button onClick={() => remove(c.id)} className="text-red-600 text-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
