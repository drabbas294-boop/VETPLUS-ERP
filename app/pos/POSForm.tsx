'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

type Item = { id:string, name:string, uom:string }

export default function POSForm() {
  const [items, setItems] = useState<Item[]>([])
  const [form, setForm] = useState({ saleNo:'', itemId:'', qty:1, uom:'', unitPrice:0 })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string|null>(null)

  useEffect(()=>{ axios.get('/api/items').then(res=>{ setItems(res.data); if(res.data[0]) setForm(f=>({...f, itemId:res.data[0].id, uom:res.data[0].uom})) }) },[])

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setMsg(null)
    const res = await axios.post('/api/pos', form)
    setLoading(false)
    if(res.status===200){ setMsg('Recorded'); setForm({ saleNo:'', itemId: form.itemId, qty:1, uom: form.uom, unitPrice:0 }); window.location.reload() }
    else setMsg('Failed')
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="label">Sale No</label>
        <input className="input" value={form.saleNo} onChange={e=>setForm({...form, saleNo:e.target.value})} required />
      </div>
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
        <div className="flex-1">
          <label className="label">Unit Price</label>
          <input type="number" className="input" value={form.unitPrice} onChange={e=>setForm({...form, unitPrice:Number(e.target.value)})} />
        </div>
      </div>
      <button className="btn" disabled={loading}>{loading?'Saving...':'Record Sale'}</button>
      {msg && <div className="text-sm text-gray-500">{msg}</div>}
    </form>
  )
}
