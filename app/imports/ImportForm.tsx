'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

type Item = { id:string, name:string, uom:string }

export default function ImportForm() {
  const [items, setItems] = useState<Item[]>([])
  const [form, setForm] = useState({ itemId:'', qty:0, uom:'', arrivalDate:'' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string|null>(null)

  useEffect(()=>{ axios.get('/api/items').then(res=>{ setItems(res.data); if(res.data[0]) setForm(f=>({...f, itemId:res.data[0].id, uom:res.data[0].uom})) }) },[])

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setMsg(null)
    const res = await axios.post('/api/imports', form)
    setLoading(false)
    if(res.status===200){ setMsg('Recorded'); setForm({ itemId:form.itemId, qty:0, uom:form.uom, arrivalDate:'' }); window.location.reload() }
    else setMsg('Failed')
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="label">Item</label>
        <select className="input" value={form.itemId} onChange={e=>{ const id=e.target.value; const it=items.find(i=>i.id===id); setForm({...form, itemId:id, uom:it?.uom||''}) }}>
          {items.map(it=> <option key={it.id} value={it.id}>{it.name}</option>)}
        </select>
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="label">Qty</label>
          <input type="number" className="input" value={form.qty} onChange={e=>setForm({...form, qty:Number(e.target.value)})} />
        </div>
        <div className="flex-1">
          <label className="label">UOM</label>
          <input className="input" value={form.uom} onChange={e=>setForm({...form, uom:e.target.value})} />
        </div>
      </div>
      <div>
        <label className="label">Arrival Date</label>
        <input type="date" className="input" value={form.arrivalDate} onChange={e=>setForm({...form, arrivalDate:e.target.value})} />
      </div>
      <button className="btn" disabled={loading}>{loading?'Saving...':'Record Import'}</button>
      {msg && <div className="text-sm text-gray-500">{msg}</div>}
    </form>
  )
}
