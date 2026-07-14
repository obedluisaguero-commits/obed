// pages/[categoria]/index.jsx — Catálogo por categoría (rediseño 2026)
// Sidebar sticky 230px: subcategorías dinámicas con contador, chips de talla y
// orden. Grid de 3 columnas con ProductCard y paginación "Ver más".
import { useState, useMemo, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { fetchProductsByCategory } from '../../lib/sheets'
import { SITE_URL } from '../../lib/config'
import ProductCard from '../../components/ProductCard'

const CATEGORY_META = {
  mujer:  { label: 'Mujer' },
  hombre: { label: 'Hombre' },
  ninos:  { label: 'Niños' },
  otros:  { label: 'Otros' },
}

function normalizar(t=''){return t.toString().replace(/[​-‍⁠﻿­]/g,'').replace(/\s+/g,' ').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}

const pct = (p) => (p.PrecioOferta && p.PrecioOferta < p.Precio ? Math.round(((p.Precio - p.PrecioOferta) / p.Precio) * 100) : 0)

// Cantidad de productos que se muestran por tanda ("Ver más")
const PAGE_SIZE = 24

const sideTitle = { font: "600 11px 'Archivo',sans-serif", letterSpacing: '.24em', color: 'var(--text-3)', marginBottom: 14 }

export default function CategoryPage({ categoria, products }) {
  const meta = CATEGORY_META[categoria]
  const [activeSub, setActiveSub]   = useState('todas')
  const [activeSize, setActiveSize] = useState('todas')
  const [sort, setSort]             = useState('rel')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  // Al cambiar cualquier filtro, vuelve a la primera tanda
  useEffect(() => { setVisibleCount(PAGE_SIZE) }, [activeSub, activeSize, sort, products])

  const sizes = useMemo(() => [...new Set(products.map(p => p.Talla).filter(Boolean))], [products])

  // Subcategorías 100% dinámicas desde los productos reales, con contador.
  const subcats = useMemo(() => {
    const vistos = new Map() // clave normalizada -> { label, count }
    for (const p of products) {
      const raw = (p.Subcategoria || '').trim()
      if (!raw) continue
      const key = normalizar(raw)
      if (!vistos.has(key)) vistos.set(key, { label: raw, count: 0 })
      vistos.get(key).count++
    }
    return [...vistos.values()].sort((a, b) => a.label.localeCompare(b.label, 'es', { sensitivity: 'base' }))
  }, [products])

  const filtered = useMemo(() => {
    let list = [...products]
    if (activeSub  !== 'todas') list = list.filter(p => normalizar(p.Subcategoria) === normalizar(activeSub))
    if (activeSize !== 'todas') list = list.filter(p => p.Talla === activeSize)
    if (sort === 'asc')  list.sort((a,b) => (a.PrecioOferta||a.Precio)-(b.PrecioOferta||b.Precio))
    if (sort === 'desc') list.sort((a,b) => (b.PrecioOferta||b.Precio)-(a.PrecioOferta||a.Precio))
    if (sort === 'dcto') list.sort((a,b) => pct(b)-pct(a))
    return list
  }, [products, activeSub, activeSize, sort])

  const chip = (active) => ({
    minWidth: 42, height: 36, padding: '0 12px', borderRadius: 10,
    border: `1px solid ${active ? 'var(--green)' : 'var(--border-strong)'}`,
    background: active ? 'var(--green)' : '#fff',
    color: active ? '#F5F2EA' : 'var(--ink)',
    font: "600 12.5px 'Archivo',sans-serif", cursor: 'pointer',
  })

  return (
    <>
      <Head>
        <title>{`${meta.label} | monky's`}</title>
        <meta name="description" content={`${meta.label} en monky's${subcats.length ? ': ' + subcats.slice(0, 8).map(s => s.label).join(', ') : ''}. Envíos a todo Perú.`} />
        <link rel="canonical" href={`${SITE_URL}/${categoria}`} />
      </Head>

      <div className="wrap" style={{ paddingTop: 28, paddingBottom: 80 }}>
        {/* Breadcrumb + título */}
        <div style={{ fontSize: 13, color: 'var(--text-3)', display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="/" style={{ color: 'var(--green)', textDecoration: 'none' }}>Inicio</Link>
          <span>·</span>
          <span>{meta.label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, margin: '14px 0 8px', flexWrap: 'wrap' }}>
          <h1 style={{ font: "750 46px/1 'Archivo',sans-serif", letterSpacing: '-.02em', margin: 0, color: 'var(--ink)' }}>{meta.label}</h1>
          <span style={{ fontSize: 14.5, color: 'var(--text-3)' }}>{filtered.length} productos</span>
        </div>
        <div style={{ width: 44, height: 3, background: 'var(--gold)', margin: '14px 0 34px' }} />

        <div className="category-layout">
          {/* Sidebar filtros */}
          <aside className="category-sidebar">
            <div style={sideTitle}>SUBCATEGORÍA</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 30 }}>
              {[{ label: 'Todas', count: products.length, todas: true }, ...subcats].map((s) => {
                const active = s.todas ? activeSub === 'todas' : normalizar(activeSub) === normalizar(s.label)
                return (
                  <button key={s.todas ? 'todas' : s.label} type="button"
                    onClick={() => setActiveSub(s.todas ? 'todas' : s.label)}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%',
                      textAlign: 'left', height: 40, padding: '0 14px', border: 'none', borderRadius: 10,
                      background: active ? 'var(--surface)' : 'transparent', color: 'var(--ink)',
                      font: `${active ? '700' : '500'} 13.5px 'Instrument Sans',sans-serif`, cursor: 'pointer',
                    }}
                  >
                    <span>{s.label}</span>
                    <span style={{ color: 'var(--muted)', fontSize: 12 }}>{s.count}</span>
                  </button>
                )
              })}
            </div>

            {sizes.length > 0 && (
              <>
                <div style={sideTitle}>TALLA</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 30 }}>
                  {['todas', ...sizes].map((sz) => (
                    <button key={sz} type="button" onClick={() => setActiveSize(sz)} style={chip(activeSize === sz)}>
                      {sz === 'todas' ? 'Todas' : sz}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div style={sideTitle}>ORDENAR</div>
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              style={{ width: '100%', height: 42, border: '1px solid var(--border-strong)', borderRadius: 10, background: '#fff', padding: '0 12px', fontSize: 13.5, color: 'var(--ink)', outline: 'none', cursor: 'pointer' }}
            >
              <option value="rel">Relevancia</option>
              <option value="asc">Precio: menor a mayor</option>
              <option value="desc">Precio: mayor a menor</option>
              <option value="dcto">Mayor descuento</option>
            </select>
          </aside>

          {/* Grid de productos */}
          <div>
            {filtered.length > 0 ? (
              <div className="category-grid">
                {filtered.slice(0, visibleCount).map((p) => <ProductCard key={p.ID} product={p} />)}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '90px 20px', color: 'var(--text-3)' }}>
                <div style={{ font: "700 20px 'Archivo',sans-serif", color: 'var(--ink)', marginBottom: 8 }}>Sin resultados</div>
                <div style={{ fontSize: 14 }}>Prueba con otra subcategoría, talla o búsqueda.</div>
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
        </div>
      </div>
    </>
  )
}

export async function getStaticPaths() {
  return { paths:[{params:{categoria:'mujer'}},{params:{categoria:'hombre'}},{params:{categoria:'ninos'}},{params:{categoria:'otros'}}], fallback:false }
}

export async function getStaticProps({ params }) {
  try {
    const products = await fetchProductsByCategory(params.categoria)
    return { props: { categoria: params.categoria, products }, revalidate: 60 }
  } catch (err) {
    console.error('Error fetching category products:', err)
    return { props: { categoria: params.categoria, products: [] }, revalidate: 30 }
  }
}
