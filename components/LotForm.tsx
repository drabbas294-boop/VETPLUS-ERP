'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

type Item = { id: string, name: string, uom: string }
type Bin = { id: string, code: string, warehouse: { name: string } }

export default function LotForm() {
  const [items, setItems] = useState<Item[]>([])
  const [bins, setBins] = useState<Bin[]>([])
  const [form, setForm] = useState({ itemId: '', lotNumber: '', qty: 0, uom: 'kg', status: 'QUARANTINE', binId: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const [itemsRes, binsRes] = await Promise.all([axios.get('/api/items'), axios.get('/api/bins')])
      setItems(itemsRes.data)
      setBins(binsRes.data)
      if (itemsRes.data[0]) setForm(f => ({ ...f, itemId: itemsRes.data[0].id, uom: itemsRes.data[0].uom }))
      if (binsRes.data[0]) setForm(f => ({ ...f, binId: binsRes.data[0].id }))
    }
    load()
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setMsg(null)
    const res = await axios.post('/api/lots', form)
    setLoading(false)
    if (res.status === 200) {
      setMsg('Created')
      setForm({ ...form, lotNumber: '', qty: 0 })
      window.location.reload()
    } else setMsg('Failed')
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="label">Item</label>
        <select className="input" value={form.itemId} onChange={e=>setForm({...form, itemId:e.target.value})}>
          {items.map(it => <option key={it.id} value={it.id}>{it.name}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Lot Number</label>
        <input className="input" value={form.lotNumber} onChange={e=>setForm({...form, lotNumber:e.target.value})} required />
      </div>
      <div>
        <label className="label">Qty</label>
        <input className="input" type="number" step="0.01" value={form.qty} onChange={e=>setForm({...form, qty: parseFloat(e.target.value)})} required />
      </div>
      <div>
        <label className="label">UOM</label>
        <input className="input" value={form.uom} onChange={e=>setForm({...form, uom:e.target.value})} />
      </div>
      <div>
        <label className="label">Status</label>
        <select className="input" value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
          <option value="QUARANTINE">QUARANTINE</option>
          <option value="RELEASED">RELEASED</option>
          <option value="HOLD">HOLD</option>
        </select>
      </div>
      <div>
        <label className="label">Bin</label>
        <select className="input" value={form.binId} onChange={e=>setForm({...form, binId:e.target.value})}>
          {bins.map(b => <option key={b.id} value={b.id}>{b.warehouse.name}/{b.code}</option>)}
        </select>
      </div>
      <button className="btn" disabled={loading}>{loading ? 'Saving...' : 'Save Lot'}</button>
      {msg && <div className="text-sm text-gray-500">{msg}</div>}
    </form>
  )
}
