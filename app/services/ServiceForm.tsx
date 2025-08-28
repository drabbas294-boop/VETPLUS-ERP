'use client'
import { useState } from 'react'
import axios from 'axios'

export default function ServiceForm() {
  const [form, setForm] = useState({ description:'', status:'OPEN' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string|null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setMsg(null)
    const res = await axios.post('/api/services', form)
    setLoading(false)
    if(res.status===200){ setMsg('Saved'); setForm({ description:'', status:'OPEN' }); window.location.reload() }
    else setMsg('Failed')
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="label">Description</label>
        <textarea className="input" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} required />
      </div>
      <div>
        <label className="label">Status</label>
        <select className="input" value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>
      </div>
      <button className="btn" disabled={loading}>{loading?'Saving...':'Save Service'}</button>
      {msg && <div className="text-sm text-gray-500">{msg}</div>}
    </form>
  )
}
