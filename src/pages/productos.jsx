// pages/productos.jsx — Catálogo completo (rediseño 2026)
import { useState, useMemo, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { fetchProducts } from '../lib/sheets'
import { SITE_URL } from '../lib/config'
import ProductCard from '../components/ProductCard'

function normalizar(t = '') {
  return t.toString().trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

// Cantidad de productos que se muestran por tanda ("Ver más")
const PAGE_SIZE = 24

export default function ProductosPage({ products }) {
  const [cat, setCat] = useState('todas')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const categories = useMemo(() => [...new Set(products.map((p) => p.Categoria).filter(Boolean))], [products])
  const filtered = cat === 'todas' ? products : products.filter((p) => normalizar(p.Categoria) === normalizar(cat))

  useEffect(() => { setVisibleCount(PAGE_SIZE) }, [cat, products])

  return (
    <>
      <Head>
        <title>Todos los productos | monky&apos;s</title>
        <meta name="description" content="Catálogo completo de monky's: moda para mujer, hombre y niños. Envíos a todo Perú." />
        <link rel="canonical" href={`${SITE_URL}/productos`} />
      </Head>

      <div className="wrap" style={{ paddingTop: 28, paddingBottom: 80 }}>
        <div style={{ fontSize: 13, color: 'var(--text-3)', display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="/" style={{ color: 'var(--green)', textDecoration: 'none' }}>Inicio</Link>
          <span>·</span>
          <span>Todos los productos</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, margin: '14px 0 8px', flexWrap: 'wrap' }}>
          <h1 style={{ font: "750 46px/1 'Archivo',sans-serif", letterSpacing: '-.02em', margin: 0, color: 'var(--ink)' }}>Todo</h1>
          <span style={{ fontSize: 14.5, color: 'var(--text-3)' }}>{filtered.length} productos</span>
        </div>
        <div style={{ width: 44, height: 3, background: 'var(--gold)', margin: '14px 0 30px' }} />

        <div style={{ display: 'flex', gap: 8, marginBottom: 30, flexWrap: 'wrap' }}>
          {['todas', ...categories].map((c) => {
            const active = cat === c
            return (
              <button key={c} type="button" onClick={() => setCat(c)}
                style={{
                  height: 36, padding: '0 16px', borderRadius: 99,
                  border: `1px solid ${active ? 'var(--green)' : 'var(--border-strong)'}`,
                  background: active ? 'var(--green)' : '#fff',
                  color: active ? '#F5F2EA' : '#3D4C45',
                  font: "600 12px 'Archivo',sans-serif", letterSpacing: '.06em', textTransform: 'uppercase', cursor: 'pointer',
                }}
              >{c === 'todas' ? 'Todas' : c}</button>
            )
          })}
        </div>

        {filtered.length > 0 ? (
          <div className="product-grid">
            {filtered.slice(0, visibleCount).map((p) => <ProductCard key={p.ID} product={p} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '90px 20px', color: 'var(--text-3)' }}>
            <div style={{ font: "700 20px 'Archivo',sans-serif", color: 'var(--ink)', marginBottom: 8 }}>Sin productos</div>
            <div style={{ fontSize: 14 }}>No hay productos disponibles por el momento.</div>
          </div>
        )}

        {filtered.length > visibleCount && (
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button type="button" className="btn-outline" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
              Ver más productos ({filtered.length - visibleCount} restantes)
            </button>
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
