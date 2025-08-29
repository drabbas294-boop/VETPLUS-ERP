'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'

interface Item {
  id: string
  name: string
}

interface CartLine {
  item: Item
  qty: number
  unitPrice: number
}

export default function Page() {
  const [items, setItems] = useState<Item[]>([])
  const [cart, setCart] = useState<CartLine[]>([])

  useEffect(() => {
    axios.get('/api/items').then(res => setItems(res.data))
  }, [])

  function addToCart(item: Item) {
    setCart(prev => {
      const existing = prev.find(l => l.item.id === item.id)
      if (existing) {
        return prev.map(l => (l.item.id === item.id ? { ...l, qty: l.qty + 1 } : l))
      }
      return [...prev, { item, qty: 1, unitPrice: 0 }]
    })
  }

  function updateQty(id: string, delta: number) {
    setCart(prev =>
      prev.map(l =>
        l.item.id === id ? { ...l, qty: Math.max(1, l.qty + delta) } : l
      )
    )
  }

  function updatePrice(id: string, price: number) {
    setCart(prev => prev.map(l => (l.item.id === id ? { ...l, unitPrice: price } : l)))
  }

  async function checkout() {
    const payload = {
      orderNo: `POS-${Date.now()}`,
      lines: cart.map(l => ({ itemId: l.item.id, qty: l.qty, unitPrice: l.unitPrice }))
    }
    await axios.post('/api/pos', payload)
    setCart([])
  }

  const total = cart.reduce((sum, l) => sum + l.qty * l.unitPrice, 0)

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <h1 className="text-xl font-bold mb-4">Point of Sale</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map(it => (
            <button
              key={it.id}
              onClick={() => addToCart(it)}
              className="p-4 bg-blue-500 text-white rounded-lg text-xl"
            >
              {it.name}
            </button>
          ))}
        </div>
      </div>
      <div className="w-full md:w-1/3">
        <h2 className="text-lg font-semibold mb-2">Cart</h2>
        {cart.map(line => (
          <div key={line.item.id} className="flex items-center mb-2">
            <div className="flex-1">{line.item.name}</div>
            <div className="flex items-center">
              <button
                className="px-2 py-1 bg-gray-300"
                onClick={() => updateQty(line.item.id, -1)}
              >
                -
              </button>
              <span className="px-2">{line.qty}</span>
              <button
                className="px-2 py-1 bg-gray-300"
                onClick={() => updateQty(line.item.id, 1)}
              >
                +
              </button>
            </div>
            <input
              type="number"
              className="w-20 ml-2 border p-1"
              value={line.unitPrice}
              onChange={e => updatePrice(line.item.id, parseFloat(e.target.value) || 0)}
            />
          </div>
        ))}
        <div className="font-bold mt-4">Total: {total.toFixed(2)}</div>
        <button
          onClick={checkout}
          className="mt-4 w-full p-4 bg-green-500 text-white rounded-lg text-xl"
        >
          Checkout
        </button>
      </div>
    </div>
  )
}
