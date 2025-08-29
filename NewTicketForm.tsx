'use client'

import { useState } from 'react'
import axios from 'axios'

interface Option { id: string; name: string }

export default function NewTicketForm({ customers, items }: { customers: Option[]; items: Option[] }) {
  const [form, setForm] = useState({ customerId: '', itemId: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setMsg(null)
    const res = await axios.post('/api/services', form)
    setLoading(false)
    if (res.status === 200) {
      setMsg('Created')
      setForm({ customerId: '', itemId: '', description: '' })
      window.location.href = '/services'
    } else setMsg('Failed')
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="label">Customer</label>
        <select className="input" value={form.customerId} onChange={e=>setForm({...form, customerId:e.target.value})} required>
          <option value="">Select customer</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Item</label>
        <select className="input" value={form.itemId} onChange={e=>setForm({...form, itemId:e.target.value})} required>
          <option value="">Select item</option>
          {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
      </div>
      <button className="btn" disabled={loading}>{loading ? 'Saving...' : 'Create Ticket'}</button>
      {msg && <div className="text-sm text-gray-500">{msg}</div>}
    </form>
  )
}

