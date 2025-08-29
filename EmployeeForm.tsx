'use client'

import { useState } from 'react'
import axios from 'axios'

export default function EmployeeForm() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', department: '', role: '', userEmail: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setMsg(null)
    const res = await axios.post('/api/hr/employees', form)
    setLoading(false)
    if (res.status === 200) {
      setMsg('Created')
      setForm({ firstName: '', lastName: '', email: '', phone: '', department: '', role: '', userEmail: '' })
      window.location.reload()
    } else setMsg('Failed')
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="label">First Name</label>
        <input className="input" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required />
      </div>
      <div>
        <label className="label">Last Name</label>
        <input className="input" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} required />
      </div>
      <div>
        <label className="label">Email</label>
        <input className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      </div>
      <div>
        <label className="label">Phone</label>
        <input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
      </div>
      <div>
        <label className="label">Department</label>
        <input className="input" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
      </div>
      <div>
        <label className="label">Role</label>
        <input className="input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
      </div>
      <div>
        <label className="label">User Email</label>
        <input className="input" value={form.userEmail} onChange={e => setForm({ ...form, userEmail: e.target.value })} />
      </div>
      <button className="btn" disabled={loading}>{loading ? 'Saving...' : 'Save Employee'}</button>
      {msg && <div className="text-sm text-gray-500">{msg}</div>}
    </form>
  )
}
