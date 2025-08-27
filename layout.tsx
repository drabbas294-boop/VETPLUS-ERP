import './globals.css'
import Link from 'next/link'
import { headers } from 'next/headers'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth'

export const metadata = {
  title: 'PetFood ERP',
  description: 'ERP for pet food manufacturers'
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authConfig as any)
  const path = (await headers()).get('x-invoke-path') || ''

  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white">
          <div className="container py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gray-900" />
              <span className="font-semibold">PetFood ERP</span>
            </div>
            <nav className="flex gap-2">
              {session ? (
                <>
                  <Link className="btn" href="/dashboard">Dashboard</Link>
                  <Link className="btn" href="/items">Items</Link>
                  <Link className="btn" href="/suppliers">Suppliers</Link>
                  <Link className="btn" href="/inventory/lots">Lots</Link>
                  <Link className="btn" href="/api/auth/signout?callbackUrl=/login">Sign out</Link>
                </>
              ) : (
                <Link className="btn" href="/login">Login</Link>
              )}
            </nav>
          </div>
        </header>
        <main className="container py-6">{children}</main>
      </body>
    </html>
  )
}
