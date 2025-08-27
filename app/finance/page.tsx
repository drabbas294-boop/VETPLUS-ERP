'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

type Entry = { id: string, date: string, description: string, amount: number }

export default function FinancePage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [form, setForm] = useState({ description: '', amount: 0, date: '' })
  const [loading, setLoading] = useState(false)

  async function load() {
    const res = await axios.get('/api/ledger')
    setEntries(res.data)
  }
  useEffect(() => { load() }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await axios.post('/api/ledger', { ...form, amount: Number(form.amount) })
    setForm({ description: '', amount: 0, date: '' })
    setLoading(false)
    load()
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Finance - Ledger</h1>
      <form onSubmit={submit} className="mb-6 space-y-3 max-w-md">
        <div>
          <label className="label">Description</label>
          <input className="input" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} required />
        </div>
        <div>
          <label className="label">Amount</label>
          <input className="input" type="number" step="0.01" value={form.amount} onChange={e=>setForm({...form, amount: parseFloat(e.target.value)})} required />
        </div>
        <div>
          <label className="label">Date</label>
          <input className="input" type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} />
        </div>
        <button className="btn" disabled={loading}>{loading?'Saving...':'Add Entry'}</button>
      </form>
      <table className="table-auto w-full">
        <thead>
          <tr><th className="px-2 py-1">Date</th><th className="px-2 py-1">Description</th><th className="px-2 py-1">Amount</th></tr>
        </thead>
        <tbody>
          {entries.map(en => (
            <tr key={en.id} className="border-t"><td className="px-2 py-1">{new Date(en.date).toLocaleDateString()}</td><td className="px-2 py-1">{en.description}</td><td className="px-2 py-1">{en.amount.toFixed(2)}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
