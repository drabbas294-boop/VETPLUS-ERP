'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

export default function LedgerPage() {
  const [accounts, setAccounts] = useState<any[]>([])
  const [accountId, setAccountId] = useState('')
  const [lines, setLines] = useState<any[]>([])

  useEffect(() => {
    axios.get('/api/finance/trial-balance').then(res => setAccounts(res.data))
  }, [])

  async function load() {
    if (!accountId) return
    const res = await axios.get('/api/finance/ledger?account=' + accountId)
    setLines(res.data)
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">General Ledger</h1>
      <div className="mb-4 flex gap-2">
        <select className="input" value={accountId} onChange={e => setAccountId(e.target.value)}>
          <option value="">Select account</option>
          {accounts.map(a => (
            <option key={a.id} value={a.id}>{a.code} - {a.name}</option>
          ))}
        </select>
        <button className="btn" onClick={load}>Load</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th className="th">Date</th>
            <th className="th">Description</th>
            <th className="th">Debit</th>
            <th className="th">Credit</th>
            <th className="th">Balance</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((l, idx) => (
            <tr key={idx}>
              <td className="td">{new Date(l.date).toISOString().slice(0,10)}</td>
              <td className="td">{l.description}</td>
              <td className="td">{l.debit.toFixed(2)}</td>
              <td className="td">{l.credit.toFixed(2)}</td>
              <td className="td">{l.balance.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
