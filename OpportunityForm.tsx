'use client'

import { useState } from 'react'
import axios from 'axios'

export default function OpportunityForm({ leads }: { leads: { id: string; name: string }[] }) {
  const [form, setForm] = useState({ title: '', value: '', leadId: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setMsg(null)
    try {
      await axios.post('/api/crm/opportunities', { title: form.title, value: form.value ? Number(form.value) : undefined, leadId: form.leadId || undefined })
      setForm({ title: '', value: '', leadId: '' })
      setMsg('Created')
      window.location.reload()
    } catch {
      setMsg('Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="label">Title</label>
        <input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
      </div>
      <div>
        <label className="label">Value</label>
        <input type="number" className="input" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} />
      </div>
      <div>
        <label className="label">Lead</label>
        <select className="input" value={form.leadId} onChange={e => setForm({ ...form, leadId: e.target.value })}>
          <option value="">None</option>
          {leads.map(l => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      </div>
      <button className="btn" disabled={loading}>{loading ? 'Saving...' : 'Save Opportunity'}</button>
      {msg && <div className="text-sm text-gray-500">{msg}</div>}
    </form>
  )
}
