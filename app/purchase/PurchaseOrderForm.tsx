'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

type Option = { id:string, name:string, uom?:string }

export default function PurchaseOrderForm() {
  const [items, setItems] = useState<Option[]>([])
  const [suppliers, setSuppliers] = useState<Option[]>([])
  const [form, setForm] = useState({ orderNo:'', supplierId:'', itemId:'', qty:1, unitCost:0, uom:'' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string|null>(null)

  useEffect(()=>{
    async function load(){
      const [itemsRes, supRes] = await Promise.all([axios.get('/api/items'), axios.get('/api/suppliers')])
      setItems(itemsRes.data); setSuppliers(supRes.data)
      if(itemsRes.data[0]) setForm(f=>({...f, itemId:itemsRes.data[0].id, uom:itemsRes.data[0].uom}))
      if(supRes.data[0]) setForm(f=>({...f, supplierId:supRes.data[0].id}))
    }
    load()
  },[])

  async function submit(e: React.FormEvent){
    e.preventDefault(); setLoading(true); setMsg(null)
    const res = await axios.post('/api/purchase', { orderNo:form.orderNo, supplierId:form.supplierId, lines:[{ itemId:form.itemId, qty:form.qty, uom:form.uom, unitCost:form.unitCost }] })
    setLoading(false)
    if(res.status===200){ setMsg('Created'); setForm({ orderNo:'', supplierId: form.supplierId, itemId: form.itemId, qty:1, unitCost:0, uom: form.uom }); window.location.reload() }
    else setMsg('Failed')
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="label">Order No</label>
        <input className="input" value={form.orderNo} onChange={e=>setForm({...form, orderNo:e.target.value})} required />
      </div>
      <div>
        <label className="label">Supplier</label>
        <select className="input" value={form.supplierId} onChange={e=>setForm({...form, supplierId:e.target.value})}>
          {suppliers.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Item</label>
        <select className="input" value={form.itemId} onChange={e=>{ const itemId=e.target.value; const it=items.find(i=>i.id===itemId); setForm({...form, itemId, uom: it?.uom || ''}) }}>
          {items.map(i=> <option key={i.id} value={i.id}>{i.name}</option>)}
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
          <label className="label">Unit Cost</label>
          <input type="number" className="input" value={form.unitCost} onChange={e=>setForm({...form, unitCost:Number(e.target.value)})} />
        </div>
      </div>
      <button className="btn" disabled={loading}>{loading?'Saving...':'Save Order'}</button>
      {msg && <div className="text-sm text-gray-500">{msg}</div>}
    </form>
  )
}
