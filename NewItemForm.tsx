'use client'

import { useState } from 'react'
import axios from 'axios'

export default function NewItemForm() {
  const [form, setForm] = useState({ sku: '', name: '', category: 'RAW_MATERIAL', uom: 'kg' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setMsg(null)
    const res = await axios.post('/api/items', form)
    setLoading(false)
    if (res.status === 200) {
      setMsg('Created')
      setForm({ sku: '', name: '', category: 'RAW_MATERIAL', uom: 'kg' })
      window.location.reload()
    } else setMsg('Failed')
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="label">SKU</label>
        <input className="input" value={form.sku} onChange={e=>setForm({...form, sku:e.target.value})} required />
      </div>
      <div>
        <label className="label">Name</label>
        <input className="input" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
      </div>
      <div>
        <label className="label">Category</label>
        <select className="input" value={form.category} onChange={e=>setForm({...form, category:e.target.value})}>
          <option value="RAW_MATERIAL">RAW_MATERIAL</option>
          <option value="PACKAGING">PACKAGING</option>
          <option value="FINISHED_GOOD">FINISHED_GOOD</option>
          <option value="WIP">WIP</option>
        </select>
      </div>
      <div>
        <label className="label">UOM</label>
        <input className="input" value={form.uom} onChange={e=>setForm({...form, uom:e.target.value})} />
      </div>
      <button className="btn" disabled={loading}>{loading ? 'Saving...' : 'Save Item'}</button>
      {msg && <div className="text-sm text-gray-500">{msg}</div>}
    </form>
  )
}
