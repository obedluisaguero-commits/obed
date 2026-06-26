// pages/productos.jsx — Catálogo completo (todos los productos visibles)
// Resuelve el enlace "Ver todos los productos" del inicio, que antes apuntaba
// a una ruta inexistente (/productos → 404).
import { useState, useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { fetchProducts } from '../lib/sheets'
import { useCart } from '../lib/cart'

function normalizar(t = '') {
  return t.toString().trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export default function ProductosPage({ products }) {
  const { addItem } = useCart()
  const [cat, setCat] = useState('todas')
  const categories = useMemo(() => [...new Set(products.map((p) => p.Categoria).filter(Boolean))], [products])
  const filtered = cat === 'todas' ? products : products.filter((p) => normalizar(p.Categoria) === normalizar(cat))

  return (
    <>
      <Head>
        <title>Todos los productos | monky&apos;s</title>
        <meta name="description" content="Catálogo completo de monky's: moda para mujer, hombre y niños. Envíos a todo Perú." />
        <link rel="canonical" href="https://monkysstore.pe/productos" />
      </Head>

      <div style={{ borderBottom: '1px solid var(--border)', padding: '40px 32px 32px' }}>
        <nav style={{ fontSize: '11px', color: 'var(--light)', display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px', letterSpacing: '.3px' }}>
          <Link href="/" style={{ color: 'var(--mid)', textDecoration: 'none' }}>Inicio</Link>
          <span>·</span>
          <span style={{ color: 'var(--black)' }}>Todos los productos</span>
        </nav>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '40px', fontWeight: 700, letterSpacing: '-1.5px', color: 'var(--black)' }}>Todos los productos</h1>
          <span style={{ fontSize: '13px', color: 'var(--light)', letterSpacing: '.3px' }}>{filtered.length} productos</span>
        </div>
      </div>

      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {['todas', ...categories].map((c) => (
            <button key={c} onClick={() => setCat(c)} style={{
              background: cat === c ? 'var(--black)' : 'transparent',
              color: cat === c ? '#fff' : 'var(--mid)',
              border: cat === c ? '1px solid var(--black)' : '1px solid var(--border)',
              padding: '7px 18px', fontSize: '11px', fontWeight: 600,
              letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer',
            }}>{c === 'todas' ? 'Todas' : c}</button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="product-grid">
            {filtered.map((p) => {
              const hasDiscount = p.PrecioOferta && p.PrecioOferta < p.Precio
              const price = hasDiscount ? p.PrecioOferta : p.Precio
              const discount = hasDiscount ? Math.round(((p.Precio - p.PrecioOferta) / p.Precio) * 100) : 0
              return (
                <div key={p.ID} style={{ background: '#fff', transition: 'background .15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
                >
                  <Link href={`/producto/${p.ID}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <div style={{ height: '200px', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', position: 'relative', overflow: 'hidden' }}>
                      {p.Imagen1 ? <Image src={p.Imagen1} alt={p.Nombre} fill style={{ objectFit: 'cover' }} sizes="25vw" /> : <span>👗</span>}
                      {hasDiscount && <span className="badge-sale" style={{ position: 'absolute', top: '12px', left: '12px' }}>−{discount}%</span>}
                      {p.Estado === 'nuevo' && !hasDiscount && <span className="badge-new" style={{ position: 'absolute', top: '12px', left: '12px' }}>Nuevo</span>}
                      {p.Stock === 0 && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--mid)' }}>Sin stock</span>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div style={{ padding: '14px' }}>
                    <p style={{ fontSize: '10px', color: 'var(--light)', fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>{p.Subcategoria || p.Categoria}</p>
                    <Link href={`/producto/${p.ID}`} style={{ textDecoration: 'none' }}>
                      <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--black)', lineHeight: 1.4, marginBottom: '8px' }} className="line-clamp-2">{p.Nombre}</p>
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--black)' }}>S/ {price}</span>
                      {hasDiscount && <span style={{ fontSize: '11px', color: 'var(--light)', textDecoration: 'line-through' }}>S/ {p.Precio}</span>}
                    </div>
                    <button type="button" disabled={p.Stock <= 0} onClick={() => addItem(p)}
                      style={{
                        display: 'block', width: '100%', textAlign: 'center', padding: '9px',
                        fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
                        background: p.Stock > 0 ? 'var(--black)' : 'var(--surface)',
                        color: p.Stock > 0 ? '#fff' : 'var(--light)',
                        border: 'none', cursor: p.Stock > 0 ? 'pointer' : 'default', transition: 'background .15s',
                      }}
                      onMouseEnter={(e) => { if (p.Stock > 0) e.currentTarget.style.background = 'var(--emerald)' }}
                      onMouseLeave={(e) => { if (p.Stock > 0) e.currentTarget.style.background = 'var(--black)' }}
                    >{p.Stock > 0 ? 'Agregar' : 'Sin stock'}</button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--light)' }}>
            <p style={{ fontSize: '32px', marginBottom: '12px' }}>◎</p>
            <p style={{ fontSize: '13px', letterSpacing: '.5px' }}>No hay productos disponibles por el momento</p>
          </div>
        )}
      </div>
    </>
  )
}

export async function getStaticProps() {
  try {
    const all = await fetchProducts()
    const products = all.filter((p) => p.Estado === 'activo' || p.Estado === 'nuevo')
    return { props: { products }, revalidate: 60 }
  } catch (err) {
    console.error('Error fetching products:', err)
    return { props: { products: [] }, revalidate: 30 }
  }
}
