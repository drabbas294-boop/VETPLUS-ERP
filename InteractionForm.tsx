'use client'

import { useState } from 'react'
import axios from 'axios'
import { InteractionType } from '@prisma/client'

export default function InteractionForm({ leadId }: { leadId: string }) {
  const [form, setForm] = useState<{ type: InteractionType; note: string }>({ type: InteractionType.NOTE, note: '' })
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await axios.post('/api/crm/interactions', { leadId, type: form.type, note: form.note })
    setForm({ type: InteractionType.NOTE, note: '' })
    setLoading(false)
    window.location.reload()
  }

  return (
    <form onSubmit={submit} className="flex space-x-2 mt-2">
      <select className="input w-32" value={form.type} onChange={e=>setForm({ ...form, type: e.target.value as InteractionType })}>
        {Object.values(InteractionType).map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <input className="input flex-1" value={form.note} onChange={e=>setForm({ ...form, note: e.target.value })} placeholder="Note" />
      <button className="btn" disabled={loading}>{loading ? 'Add...' : 'Add'}</button>
    </form>
  )
}
