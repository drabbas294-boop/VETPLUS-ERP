'use client'

import { useState } from 'react'
import axios from 'axios'

export default function PurchaseOrderForm() {
  const [form, setForm] = useState({
    orderNo: '',
    supplierId: '',
    itemId: '',
    qty: '',
    uom: 'kg',
    lotNumber: ''
  })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMsg(null)
    const res = await axios.post('/api/purchases', {
      orderNo: form.orderNo,
      supplierId: form.supplierId,
      lines: [
        {
          itemId: form.itemId,
          qty: Number(form.qty),
          uom: form.uom,
          lotNumber: form.lotNumber
        }
      ]
    })
    setLoading(false)
    if (res.status === 200) {
      setMsg('Created')
      setForm({ orderNo: '', supplierId: '', itemId: '', qty: '', uom: 'kg', lotNumber: '' })
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
        <label className="label">Supplier ID</label>
        <input className="input" value={form.supplierId} onChange={e=>setForm({...form, supplierId:e.target.value})} required />
      </div>
      <div>
        <label className="label">Item ID</label>
        <input className="input" value={form.itemId} onChange={e=>setForm({...form, itemId:e.target.value})} required />
      </div>
      <div>
        <label className="label">Quantity</label>
        <input className="input" type="number" value={form.qty} onChange={e=>setForm({...form, qty:e.target.value})} required />
      </div>
      <div>
        <label className="label">UOM</label>
        <input className="input" value={form.uom} onChange={e=>setForm({...form, uom:e.target.value})} />
      </div>
      <div>
        <label className="label">Lot Number</label>
        <input className="input" value={form.lotNumber} onChange={e=>setForm({...form, lotNumber:e.target.value})} required />
      </div>
      <button className="btn" disabled={loading}>{loading ? 'Saving...' : 'Save Purchase'}</button>
      {msg && <div className="text-sm text-gray-500">{msg}</div>}
    </form>
  )
}
