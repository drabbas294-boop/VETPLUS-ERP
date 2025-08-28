import AssetForm from './AssetForm'
import { prisma } from '@/lib/prisma'

async function loadAssets() {
  try {
    return await prisma.asset.findMany({ orderBy: { createdAt: 'desc' } })
  } catch {
    return []
  }
}

export default async function Page() {
  const assets = await loadAssets()
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Assets</h1>
      <div className="mb-8"><AssetForm /></div>
      <table className="table">
        <thead>
          <tr>
            <th className="th">Name</th>
            <th className="th">Value</th>
            <th className="th">Acquired</th>
          </tr>
        </thead>
        <tbody>
          {assets.map(a=> (
            <tr key={a.id} className="hover:bg-gray-50">
              <td className="td">{a.name}</td>
              <td className="td">{a.value}</td>
              <td className="td">{a.acquiredAt ? new Date(a.acquiredAt).toLocaleDateString() : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
