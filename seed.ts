import { prisma } from '../lib/prisma'
import { hash } from 'bcryptjs'

async function main() {
  // admin user
  const passwordHash = await hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { email: 'admin@example.com', name: 'Admin', passwordHash, role: 'ADMIN' }
  })

  // Warehouses + bins
  const wh = await prisma.warehouse.upsert({
    where: { code: 'MAIN' },
    update: {},
    create: { code: 'MAIN', name: 'Main Warehouse', address: 'HQ' }
  })
  await prisma.bin.upsert({ where: { id: 'seed_ignore_1' }, update: {}, create: { id: 'seed_ignore_1', code: 'A-01', warehouseId: wh.id } })
  await prisma.bin.upsert({ where: { id: 'seed_ignore_2' }, update: {}, create: { id: 'seed_ignore_2', code: 'A-02', warehouseId: wh.id } })

  // Suppliers
  const sup = await prisma.supplier.create({ data: { name: 'Global Meats', email: 'supply@globalmeats.com', phone: '+1-222-333-4444', score: 85 } })

  // Items
  const chickenMeal = await prisma.item.create({ data: { sku: 'RM-CHK-001', name: 'Chicken Meal', category: 'RAW_MATERIAL', uom: 'kg', supplierId: sup.id } })
  const premix = await prisma.item.create({ data: { sku: 'RM-PREMIX-01', name: 'Vitamin Premix', category: 'RAW_MATERIAL', uom: 'kg' } })
  const bag = await prisma.item.create({ data: { sku: 'PK-BAG-1KG', name: '1kg Pouch', category: 'PACKAGING', uom: 'pcs' } })
  const kibble = await prisma.item.create({ data: { sku: 'FG-CAT-ADULT-1KG-CHK', name: 'Cat Kibble Adult Chicken 1kg', category: 'FINISHED_GOOD', uom: 'bag' } })

  // Lots
  await prisma.inventoryLot.createMany({
    data: [
      { itemId: chickenMeal.id, lotNumber: 'CM240801', qty: 5000, uom: 'kg', status: 'QUARANTINE', binId: wh.id ? (await prisma.bin.findFirst({ where: { warehouseId: wh.id } }))?.id : null },
      { itemId: premix.id, lotNumber: 'PM2407A', qty: 400, uom: 'kg', status: 'RELEASED' },
      { itemId: bag.id, lotNumber: 'BAG2408', qty: 10000, uom: 'pcs', status: 'RELEASED' }
    ]
  })

  console.log('Seeded: admin user, sample warehouses/bins, suppliers, items, lots.')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(async () => { await prisma.$disconnect() })
