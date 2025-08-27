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

  const moduleLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/items', label: 'Items' },
    { href: '/suppliers', label: 'Suppliers' },
    { href: '/inventory/lots', label: 'Lots' },
    { href: '/sales', label: 'Sales' },
    { href: '/purchase', label: 'Purchase' },
    { href: '/pos', label: 'POS' },
    { href: '/inventory', label: 'Inventory' },
    { href: '/imports', label: 'Imports' },
    { href: '/crm', label: 'CRM' },
    { href: '/assets', label: 'Assets' },
    { href: '/finance', label: 'Finance' },
    { href: '/hr', label: 'HR' },
    { href: '/manufacturing', label: 'Manufacturing' },
    { href: '/services', label: 'Services' },
    { href: '/security', label: 'Security' },
  ]

  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white">
          <div className="container py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gray-900" />
              <span className="font-semibold">PetFood ERP</span>
            </div>
            <nav className="flex flex-wrap gap-2">
              {session ? (
                <>
                  {moduleLinks.map((link) => (
                    <Link key={link.href} className="btn" href={link.href}>
                      {link.label}
                    </Link>
                  ))}
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
