'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

type Item = { id: string, name: string, uom: string }

export default function BatchForm() {
  const [items, setItems] = useState<Item[]>([])
  const [form, setForm] = useState({ fgItemId: '', batchNumber: '', plannedQty: 0, uom: 'kg' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const res = await axios.get('/api/items')
      setItems(res.data)
      if (res.data[0]) setForm(f => ({ ...f, fgItemId: res.data[0].id, uom: res.data[0].uom }))
    }
    load()
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setMsg(null)
    const res = await axios.post('/api/batches', { ...form, plannedQty: Number(form.plannedQty) })
    setLoading(false)
    if (res.status === 200) {
      setMsg('Created')
      setForm(f => ({ ...f, batchNumber: '', plannedQty: 0 }))
      window.location.reload()
    } else setMsg('Failed')
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="label">Finished Good Item</label>
        <select className="input" value={form.fgItemId} onChange={e=>setForm({...form, fgItemId:e.target.value})}>
          {items.map(it => <option key={it.id} value={it.id}>{it.name}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Batch Number</label>
        <input className="input" value={form.batchNumber} onChange={e=>setForm({...form, batchNumber:e.target.value})} required />
      </div>
      <div>
        <label className="label">Planned Qty</label>
        <input className="input" type="number" step="0.01" value={form.plannedQty} onChange={e=>setForm({...form, plannedQty: parseFloat(e.target.value)})} required />
      </div>
      <div>
        <label className="label">UOM</label>
        <input className="input" value={form.uom} onChange={e=>setForm({...form, uom:e.target.value})} />
      </div>
      <button className="btn" disabled={loading}>{loading ? 'Saving...' : 'Save Batch'}</button>
      {msg && <div className="text-sm text-gray-500">{msg}</div>}
    </form>
  )
}
