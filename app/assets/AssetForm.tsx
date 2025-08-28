'use client'
import { useState } from 'react'
import axios from 'axios'

export default function AssetForm() {
  const [form, setForm] = useState({ name:'', value:0, acquiredAt:'' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string|null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setMsg(null)
    const res = await axios.post('/api/assets', { ...form, value: Number(form.value) })
    setLoading(false)
    if(res.status===200){ setMsg('Saved'); setForm({ name:'', value:0, acquiredAt:'' }); window.location.reload() }
    else setMsg('Failed')
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="label">Name</label>
        <input className="input" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
      </div>
      <div>
        <label className="label">Value</label>
        <input type="number" className="input" value={form.value} onChange={e=>setForm({...form, value:Number(e.target.value)})} />
      </div>
      <div>
        <label className="label">Acquired</label>
        <input type="date" className="input" value={form.acquiredAt} onChange={e=>setForm({...form, acquiredAt:e.target.value})} />
      </div>
      <button className="btn" disabled={loading}>{loading?'Saving...':'Save Asset'}</button>
      {msg && <div className="text-sm text-gray-500">{msg}</div>}
    </form>
  )
}
