'use client'

import { useState } from 'react'
import axios from 'axios'

export default function SupplierForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setMsg(null)
    try {
      const res = await axios.post('/api/suppliers', form)
      if (res.status === 200) {
        setMsg('Created')
        setForm({ name: '', email: '', phone: '' })
        window.location.reload()
      }
    } catch (err: any) {
      setMsg(err.response?.data?.error || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="label">Name</label>
        <input className="input" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
      </div>
      <div>
        <label className="label">Email</label>
        <input className="input" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
      </div>
      <div>
        <label className="label">Phone</label>
        <input className="input" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
      </div>
      <button className="btn" disabled={loading}>{loading ? 'Saving...' : 'Save Supplier'}</button>
      {msg && <div className="text-sm text-gray-500">{msg}</div>}
    </form>
  )
}
