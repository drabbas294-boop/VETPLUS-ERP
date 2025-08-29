'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

export default function TrialBalancePage() {
  const [rows, setRows] = useState<any[]>([])

  useEffect(() => {
    axios.get('/api/finance/trial-balance').then(res => setRows(res.data))
  }, [])

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Trial Balance</h1>
      <table className="table">
        <thead>
          <tr>
            <th className="th">Account</th>
            <th className="th">Debit</th>
            <th className="th">Credit</th>
            <th className="th">Balance</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td className="td">{r.code} - {r.name}</td>
              <td className="td">{r.debit.toFixed(2)}</td>
              <td className="td">{r.credit.toFixed(2)}</td>
              <td className="td">{r.balance.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
