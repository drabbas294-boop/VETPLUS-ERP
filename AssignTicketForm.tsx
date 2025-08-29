'use client'

import { useState } from 'react'
import axios from 'axios'

interface Option { id: string; name: string }

export default function AssignTicketForm({ ticketId, users }: { ticketId: string; users: Option[] }) {
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setMsg(null)
    const res = await axios.post(`/api/services/${ticketId}/assign`, { userId })
    setLoading(false)
    if (res.status === 200) {
      setMsg('Assigned')
      window.location.href = '/services'
    } else setMsg('Failed')
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="label">Assign To</label>
        <select className="input" value={userId} onChange={e=>setUserId(e.target.value)} required>
          <option value="">Select user</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
      </div>
      <button className="btn" disabled={loading}>{loading ? 'Saving...' : 'Assign'}</button>
      {msg && <div className="text-sm text-gray-500">{msg}</div>}
    </form>
  )
}

