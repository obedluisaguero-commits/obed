// lib/cart.js — Carrito de compras (estado global + persistencia en navegador)
// El checkout es por WhatsApp: el carrito arma un solo mensaje con todo el pedido.
// Al agregar un producto se muestra un toast ("agregado al carrito" + VER CARRITO)
// en vez de abrir el panel, según el rediseño.
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'monkys_cart_v1'
const TOAST_MS = 2600

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [hydrated, setHydrated] = useState(false)
  const toastTimer = useRef(null)

  // Cargar el carrito guardado al montar (solo en cliente)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch (e) {
      /* ignorar */
    }
    setHydrated(true)
    return () => clearTimeout(toastTimer.current)
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

  const showToast = useCallback((msg) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), TOAST_MS)
  }, [])

  const clearToast = useCallback(() => {
    clearTimeout(toastTimer.current)
    setToast('')
  }, [])

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
    showToast(`${product.Nombre || 'Producto'} agregado al carrito`)
  }, [showToast])

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
      value={{ items, count, total, addItem, removeItem, updateQty, clear, open, setOpen, hydrated, toast, clearToast }}
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

// Arma el mensaje de WhatsApp con todo el pedido (formato del rediseño).
export function buildWhatsappOrder(items, total) {
  const lines = items.map(
    (i) => `• ${i.qty} x ${i.nombre}${i.talla ? ` (Talla ${i.talla})` : ''} — S/ ${i.precio * i.qty}`
  )
  return `Hola Monky's Store, quiero confirmar mi pedido:\n${lines.join('\n')}\nTotal: S/ ${total}\n\n¿Me confirman disponibilidad y envío?`
}
