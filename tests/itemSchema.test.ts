import { describe, expect, it } from 'vitest'
import { itemSchema } from '../lib/validators'
import { ItemCategory } from '@prisma/client'

describe('itemSchema', () => {
  it('validates a proper item', () => {
    const result = itemSchema.safeParse({
      sku: 'SKU123',
      name: 'Example',
      category: ItemCategory.RAW_MATERIAL,
      uom: 'kg'
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing fields', () => {
    const result = itemSchema.safeParse({
      sku: '',
      name: '',
      category: 'INVALID',
      uom: ''
    })
    expect(result.success).toBe(false)
  })
})
