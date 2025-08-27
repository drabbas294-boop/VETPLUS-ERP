'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

export default function SalesOrderForm() {
  const [form, setForm] = useState({ orderNo: '', customerName: '', itemId: '', qty: 1, unitPrice: 0 })
  const [items, setItems] = useState<{id:string,name:string}[]>([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    axios.get('/api/items').then(res => setItems(res.data))
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setMsg(null)
    const res = await axios.post('/api/sales', {
      orderNo: form.orderNo,
      customerName: form.customerName,
      lines: [{ itemId: form.itemId, qty: form.qty, unitPrice: form.unitPrice }]
    })
    setLoading(false)
    if (res.status === 200) {
      setMsg('Created')
      setForm({ orderNo: '', customerName: '', itemId: '', qty: 1, unitPrice: 0 })
      window.location.reload()
    } else setMsg('Failed')
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="label">Order No</label>
        <input className="input" value={form.orderNo} onChange={e=>setForm({...form, orderNo:e.target.value})} required />
      </div>
      <div>
        <label className="label">Customer</label>
        <input className="input" value={form.customerName} onChange={e=>setForm({...form, customerName:e.target.value})} required />
      </div>
      <div>
        <label className="label">Item</label>
        <select className="input" value={form.itemId} onChange={e=>setForm({...form, itemId:e.target.value})} required>
          <option value="">Select item</option>
          {items.map(it => <option key={it.id} value={it.id}>{it.name}</option>)}
        </select>
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="label">Quantity</label>
          <input type="number" className="input" value={form.qty} onChange={e=>setForm({...form, qty:Number(e.target.value)})} min="0" step="any" />
        </div>
        <div className="flex-1">
          <label className="label">Unit Price</label>
          <input type="number" className="input" value={form.unitPrice} onChange={e=>setForm({...form, unitPrice:Number(e.target.value)})} min="0" step="any" />
        </div>
      </div>
      <button className="btn" disabled={loading}>{loading ? 'Saving...' : 'Save Order'}</button>
      {msg && <div className="text-sm text-gray-500">{msg}</div>}
    </form>
  )
}
