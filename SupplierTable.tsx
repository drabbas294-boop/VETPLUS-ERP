'use client'

import { useState } from 'react'
import axios from 'axios'
import { Supplier } from '@prisma/client'

export default function SupplierTable({ suppliers }: { suppliers: Supplier[] }) {
  const [editing, setEditing] = useState<Supplier | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  function startEdit(s: Supplier) {
    setEditing(s)
    setForm({ name: s.name, email: s.email || '', phone: s.phone || '' })
    setMsg(null)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!editing) return
    setLoading(true); setMsg(null)
    try {
      const res = await axios.put('/api/suppliers', { id: editing.id, ...form })
      if (res.status === 200) {
        setEditing(null)
        window.location.reload()
      }
    } catch (err: any) {
      setMsg(err.response?.data?.error || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this supplier?')) return
    try {
      await axios.delete('/api/suppliers', { data: { id } })
      window.location.reload()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed')
    }
  }

  return (
    <div>
      {editing && (
        <form onSubmit={save} className="space-y-3 mb-6">
          <div>
            <label className="label">Name</label>
            <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="space-x-2">
            <button className="btn" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
            <button type="button" className="btn" onClick={() => setEditing(null)}>Cancel</button>
          </div>
          {msg && <div className="text-sm text-gray-500">{msg}</div>}
        </form>
      )}
      <table className="table">
        <thead>
          <tr>
            <th className="th">Name</th>
            <th className="th">Email</th>
            <th className="th">Phone</th>
            <th className="th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map(s => (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="td">{s.name}</td>
              <td className="td">{s.email}</td>
              <td className="td">{s.phone}</td>
              <td className="td space-x-2">
                <button className="btn" onClick={() => startEdit(s)}>Edit</button>
                <button className="btn" onClick={() => remove(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
