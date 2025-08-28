'use client'
import { useState } from 'react'
import axios from 'axios'

export default function UserForm() {
  const [form, setForm] = useState({ email:'', name:'', password:'', role:'USER' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string|null>(null)

  async function submit(e: React.FormEvent){
    e.preventDefault(); setLoading(true); setMsg(null)
    const res = await axios.post('/api/users', form)
    setLoading(false)
    if(res.status===200){ setMsg('Created'); setForm({ email:'', name:'', password:'', role:'USER' }); window.location.reload() }
    else setMsg('Failed')
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="label">Email</label>
        <input className="input" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
      </div>
      <div>
        <label className="label">Name</label>
        <input className="input" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
      </div>
      <div>
        <label className="label">Password</label>
        <input type="password" className="input" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
      </div>
      <div>
        <label className="label">Role</label>
        <select className="input" value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
          <option value="QA">QA</option>
          <option value="PLANNER">PLANNER</option>
          <option value="WMS">WMS</option>
          <option value="SALES">SALES</option>
        </select>
      </div>
      <button className="btn" disabled={loading}>{loading?'Saving...':'Create User'}</button>
      {msg && <div className="text-sm text-gray-500">{msg}</div>}
    </form>
  )
}
