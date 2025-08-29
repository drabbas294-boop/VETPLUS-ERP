import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Finance Module</h1>
      <ul className="list-disc pl-5 space-y-2">
        <li><Link href="/finance/trial-balance">Trial Balance</Link></li>
        <li><Link href="/finance/ledger">General Ledger</Link></li>
      </ul>
    </div>
  )
}
