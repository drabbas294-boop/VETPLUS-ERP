'use client'

import axios from 'axios'
import { useState } from 'react'

export default function ConvertLeadButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)

  async function convert() {
    setLoading(true)
    try {
      await axios.post(`/api/crm/leads/${id}/convert`)
      window.location.reload()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button className="btn" onClick={convert} disabled={loading}>
      {loading ? 'Converting...' : 'Convert'}
    </button>
  )
}
