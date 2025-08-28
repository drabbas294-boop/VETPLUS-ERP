'use client'
import { useState } from 'react'
import axios from 'axios'

export default function WarehouseForm() {
  const [form, setForm] = useState({ name: '', code: '', address: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string|null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setMsg(null)
    const res = await axios.post('/api/warehouses', form)
    setLoading(false)
    if (res.status === 200) {
      setMsg('Created'); setForm({ name: '', code: '', address: '' }); window.location.reload()
    } else setMsg('Failed')
  }

  return (
    <form onSubmit={submit} className="space-y-3 mb-6">
      <div>
        <label className="label">Name</label>
        <input className="input" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
      </div>
      <div>
        <label className="label">Code</label>
        <input className="input" value={form.code} onChange={e=>setForm({...form, code:e.target.value})} required />
      </div>
      <div>
        <label className="label">Address</label>
        <input className="input" value={form.address} onChange={e=>setForm({...form, address:e.target.value})} />
      </div>
      <button className="btn" disabled={loading}>{loading?'Saving...':'Save Warehouse'}</button>
      {msg && <div className="text-sm text-gray-500">{msg}</div>}
    </form>
  )
}
