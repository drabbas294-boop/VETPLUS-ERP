'use client'

import { useState } from 'react'
import axios from 'axios'

export default function CloseTicketForm({ ticketId }: { ticketId: string }) {
  const [resolution, setResolution] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setMsg(null)
    const res = await axios.post(`/api/services/${ticketId}/close`, { resolution })
    setLoading(false)
    if (res.status === 200) {
      setMsg('Closed')
      window.location.href = '/services'
    } else setMsg('Failed')
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="label">Resolution</label>
        <textarea className="input" value={resolution} onChange={e=>setResolution(e.target.value)} />
      </div>
      <button className="btn" disabled={loading}>{loading ? 'Saving...' : 'Close Ticket'}</button>
      {msg && <div className="text-sm text-gray-500">{msg}</div>}
    </form>
  )
}

