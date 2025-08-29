'use client'
import { useState } from 'react'
import axios from 'axios'
import { Item, ItemCategory } from '@prisma/client'

export default function ItemTable({ items }: { items: Item[] }) {
  const cat = (c: ItemCategory) => c.replace('_', ' ')
  const [editing, setEditing] = useState<Item | null>(null)
  const [form, setForm] = useState({ sku: '', name: '', category: 'RAW_MATERIAL', uom: '', isActive: true })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  function startEdit(item: Item) {
    setEditing(item)
    setForm({ sku: item.sku, name: item.name, category: item.category, uom: item.uom, isActive: item.isActive })
    setMsg(null)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!editing) return
    setLoading(true); setMsg(null)
    try {
      const res = await axios.put('/api/items', { id: editing.id, ...form })
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
    if (!confirm('Delete this item?')) return
    try {
      await axios.delete('/api/items', { data: { id } })
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
            <label className="label">SKU</label>
            <input className="input" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} required />
          </div>
          <div>
            <label className="label">Name</label>
            <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              <option value="RAW_MATERIAL">RAW_MATERIAL</option>
              <option value="PACKAGING">PACKAGING</option>
              <option value="FINISHED_GOOD">FINISHED_GOOD</option>
              <option value="WIP">WIP</option>
            </select>
          </div>
          <div>
            <label className="label">UOM</label>
            <input className="input" value={form.uom} onChange={e => setForm({ ...form, uom: e.target.value })} />
          </div>
          <div>
            <label className="label">Active</label>
            <select
              className="input"
              value={form.isActive ? 'true' : 'false'}
              onChange={e => setForm({ ...form, isActive: e.target.value === 'true' })}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
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
            <th className="th">SKU</th>
            <th className="th">Name</th>
            <th className="th">Category</th>
            <th className="th">UOM</th>
            <th className="th">Active</th>
            <th className="th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it.id} className="hover:bg-gray-50">
              <td className="td">{it.sku}</td>
              <td className="td">{it.name}</td>
              <td className="td"><span className="badge">{cat(it.category)}</span></td>
              <td className="td">{it.uom}</td>
              <td className="td">{it.isActive ? 'Yes' : 'No'}</td>
              <td className="td space-x-2">
                <button className="btn" onClick={() => startEdit(it)}>Edit</button>
                <button className="btn" onClick={() => remove(it.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
