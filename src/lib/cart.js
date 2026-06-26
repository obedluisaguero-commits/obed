// lib/cart.js — Carrito de compras (estado global + persistencia en navegador)
// El checkout es por WhatsApp: el carrito arma un solo mensaje con todo el pedido.
import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'monkys_cart_v1'

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // Cargar el carrito guardado al montar (solo en cliente)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch (e) {
      /* ignorar */
    }
    setHydrated(true)
  }, [])

  // Persistir cambios
  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (e) {
      /* ignorar */
    }
  }, [items, hydrated])

  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const id = String(product.ID)
      const found = prev.find((i) => i.id === id)
      if (found) return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i))
      const hasDiscount = product.PrecioOferta && product.PrecioOferta < product.Precio
      const precio = Number(hasDiscount ? product.PrecioOferta : product.Precio) || 0
      return [
        ...prev,
        {
          id,
          nombre: product.Nombre || 'Producto',
          codigo: product.Codigo || '',
          precio,
          imagen: product.Imagen1 || '',
          talla: product.Talla || '',
          color: product.Color || '',
          qty,
        },
      ]
    })
    setOpen(true) // abrir el carrito al agregar
  }, [])

  const removeItem = useCallback((id) => setItems((prev) => prev.filter((i) => i.id !== id)), [])

  const updateQty = useCallback(
    (id, qty) =>
      setItems((prev) =>
        prev.flatMap((i) => {
          if (i.id !== id) return [i]
          const q = Math.max(0, qty)
          return q === 0 ? [] : [{ ...i, qty: q }]
        })
      ),
    []
  )

  const clear = useCallback(() => setItems([]), [])

  const count = items.reduce((s, i) => s + i.qty, 0)
  const total = items.reduce((s, i) => s + i.precio * i.qty, 0)

  return (
    <CartContext.Provider
      value={{ items, count, total, addItem, removeItem, updateQty, clear, open, setOpen, hydrated }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}

// Arma el mensaje de WhatsApp con todo el pedido.
export function buildWhatsappOrder(items, total) {
  const lines = items.map((i, n) => {
    const detalle = [i.talla && `Talla: ${i.talla}`, i.color].filter(Boolean).join(' · ')
    return `${n + 1}. *${i.nombre}*${i.codigo ? ` (${i.codigo})` : ''}\n   ${
      detalle ? detalle + ' · ' : ''
    }Cantidad: ${i.qty} · S/ ${i.precio * i.qty}`
  })
  return `Hola monky's 👋 Quiero hacer este pedido:\n\n${lines.join(
    '\n'
  )}\n\n*Total: S/ ${total}*\n\n¿Me confirman disponibilidad y el envío?`
}
