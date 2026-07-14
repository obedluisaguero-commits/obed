// components/ProductCard.jsx — Tarjeta de producto del rediseño (única para todo el sitio)
// Blanca, radio 16, foto 3:4, badge de descuento pill, eyebrow de subcategoría,
// precio Archivo 750 y botón circular "+" que agrega al carrito sin abrir el producto.
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '../lib/cart'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const hasDiscount = product.PrecioOferta && product.PrecioOferta < product.Precio
  const price = hasDiscount ? product.PrecioOferta : product.Precio
  const discount = hasDiscount ? Math.round(((product.Precio - product.PrecioOferta) / product.Precio) * 100) : 0
  const out = !(product.Stock > 0)

  return (
    <div className="pcard">
      <Link href={`/producto/${product.ID}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <div style={{ position: 'relative', aspectRatio: '3/4', background: 'var(--surface)' }}>
          {product.Imagen1 ? (
            <Image src={product.Imagen1} alt={product.Nombre} fill style={{ objectFit: 'contain' }} sizes="(max-width:768px) 50vw, 25vw" />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', font: "600 10px 'Archivo',sans-serif", letterSpacing: '.12em', color: 'var(--muted)' }}>FOTO</div>
          )}
          {hasDiscount && (
            <span className="badge-sale" style={{ position: 'absolute', top: 12, left: 12, pointerEvents: 'none' }}>−{discount}%</span>
          )}
          {!hasDiscount && product.Estado === 'nuevo' && (
            <span className="badge-new" style={{ position: 'absolute', top: 12, left: 12, pointerEvents: 'none' }}>Nuevo</span>
          )}
          {out && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(245,242,234,.72)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ font: "700 11px 'Archivo',sans-serif", letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--text-3)' }}>Sin stock</span>
            </div>
          )}
        </div>
        <div style={{ padding: '14px 16px 0' }}>
          <div style={{ font: "600 10.5px 'Archivo',sans-serif", letterSpacing: '.16em', textTransform: 'uppercase', color: '#98A29B' }}>
            {product.Subcategoria || product.Categoria}
          </div>
          <div className="line-clamp-2" style={{ font: "600 15px/1.35 'Instrument Sans',sans-serif", margin: '5px 0 12px', minHeight: 40, color: 'var(--ink)' }}>
            {product.Nombre}
          </div>
        </div>
      </Link>
      <div style={{ padding: '0 16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
          <span style={{ font: "750 18px 'Archivo',sans-serif", color: 'var(--ink)' }}>S/ {price}</span>
          {hasDiscount && <span style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'line-through' }}>S/ {product.Precio}</span>}
        </div>
        <button
          type="button"
          className="pcard-add"
          title={out ? 'Sin stock' : 'Agregar al carrito'}
          aria-label={`Agregar ${product.Nombre} al carrito`}
          disabled={out}
          onClick={() => addItem(product)}
        >+</button>
      </div>
    </div>
  )
}
