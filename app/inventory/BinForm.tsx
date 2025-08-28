'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'

type Warehouse = { id:string, name:string }

export default function BinForm() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [form, setForm] = useState({ code:'', warehouseId:'' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string|null>(null)

  useEffect(()=>{ axios.get('/api/warehouses').then(res=>{ setWarehouses(res.data); if(res.data[0]) setForm(f=>({...f, warehouseId: res.data[0].id})) }) }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setMsg(null)
    const res = await axios.post('/api/bins', form)
    setLoading(false)
    if (res.status === 200) { setMsg('Created'); setForm({ code:'', warehouseId: form.warehouseId }); window.location.reload() }
    else setMsg('Failed')
  }

  return (
    <form onSubmit={submit} className="space-y-3 mb-6">
      <div>
        <label className="label">Code</label>
        <input className="input" value={form.code} onChange={e=>setForm({...form, code:e.target.value})} required />
      </div>
      <div>
        <label className="label">Warehouse</label>
        <select className="input" value={form.warehouseId} onChange={e=>setForm({...form, warehouseId:e.target.value})}>
          {warehouses.map(w=> <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
      </div>
      <button className="btn" disabled={loading}>{loading?'Saving...':'Save Bin'}</button>
      {msg && <div className="text-sm text-gray-500">{msg}</div>}
    </form>
  )
}
