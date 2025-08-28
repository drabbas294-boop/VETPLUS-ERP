import { z } from 'zod'
import { ItemCategory } from '@prisma/client'

export const itemSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  category: z.nativeEnum(ItemCategory),
  uom: z.string().min(1)
})
