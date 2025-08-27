# PetFood ERP (Next.js + Prisma + MySQL)

A production-grade starter tailored for pet-food manufacturing ERP. It implements authentication, RBAC (role on user), and 3 live modules (Items, Suppliers, Inventory Lots) you can extend to cover formulation, QC, batches, sales, etc.

## Tech
- Next.js App Router (TypeScript), Tailwind
- NextAuth (Credentials) with JWT sessions
- Prisma ORM (MySQL) — works on XAMPP MySQL or Hostinger
- Clean modules: Items, Suppliers, Inventory Lots

## Quick Start (Local)
1. **Install Node.js 18+** and MySQL (XAMPP or Docker).
2. Copy `.env.example` to `.env` and set `DATABASE_URL` (e.g. `mysql://root:password@localhost:3306/petfood_erp`).
3. Create DB: `CREATE DATABASE petfood_erp;`
4. Install deps & generate client:
   ```bash
   npm i
   npx prisma migrate dev --name init
   npm run seed
   npm run dev
   ```
5. Sign in at `/login` with: `admin@example.com / admin123`

## Deploy on Hostinger (Node app)
1. **MySQL**: create a database & user; whitelist your app; note connection details.
2. Set environment variables in Hostinger dashboard (`DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`).
3. Build the app:
   ```bash
   npm ci
   npx prisma migrate deploy
   npm run build
   npm start
   ```
   Or run with PM2 if offered by your plan.

## Extend to Full ERP
Use the Prisma models that are already defined for: Formulation, BOMLine, ProductionBatch, QCTest/COA, SalesOrder. Add app routes under `app/` and API route handlers in `app/api/*` similar to Items/Suppliers/Lots.

Suggested next screens:
- `app/formulations/*` — versioned formulations, GA calculations.
- `app/qc/*` — sampling, results entry, release workflow (set lot status to RELEASED).
- `app/batches/*` — batch tickets, weigh-up, parameters capture.
- `app/sales/*` — orders, pricing tiers, AR aging.

## Security
- Update `AUTH_SECRET` and change the seeded admin password immediately.
- Add fine-grained RBAC by checking `(session.user as any).role` in routes/pages.

## Notes
- This project keeps UI simple for clarity; swap in shadcn/ui later if you want richer components.
- For file storage (COAs), use an object store (S3-compatible) and save the URL in `COA.url`.
