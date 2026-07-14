// pages/ofertas.jsx — Ofertas (rediseño 2026)
import { useState, useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { fetchOffers } from '../lib/sheets'
import { SITE_URL } from '../lib/config'
import ProductCard from '../components/ProductCard'

export default function OfertasPage({ offers }) {
  const [cat, setCat] = useState('todas')
  const categories = useMemo(() => [...new Set(offers.map((p) => p.Categoria).filter(Boolean))], [offers])
  const filtered = cat === 'todas' ? offers : offers.filter((p) => p.Categoria === cat)

  return (
    <>
      <Head>
        <title>Ofertas | monky&apos;s</title>
        <meta name="description" content="Descuentos reales en ropa para mujer, hombre y niños. Ofertas por tiempo limitado en monky's." />
        <link rel="canonical" href={`${SITE_URL}/ofertas`} />
      </Head>

      <div className="wrap" style={{ paddingTop: 28, paddingBottom: 80 }}>
        <div style={{ fontSize: 13, color: 'var(--text-3)', display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="/" style={{ color: 'var(--green)', textDecoration: 'none' }}>Inicio</Link>
          <span>·</span>
          <span>Ofertas</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, margin: '14px 0 8px', flexWrap: 'wrap' }}>
          <h1 style={{ font: "750 46px/1 'Archivo',sans-serif", letterSpacing: '-.02em', margin: 0, color: 'var(--ink)' }}>Ofertas</h1>
          <span style={{ fontSize: 14.5, color: 'var(--text-3)' }}>{filtered.length} productos con descuento</span>
        </div>
        <div style={{ width: 44, height: 3, background: 'var(--gold)', margin: '14px 0 30px' }} />

        {categories.length > 1 && (
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
        )}

        {filtered.length > 0 ? (
          <div className="product-grid">
            {filtered.map((p) => <ProductCard key={p.ID} product={p} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '90px 20px', color: 'var(--text-3)' }}>
            <div style={{ font: "700 20px 'Archivo',sans-serif", color: 'var(--ink)', marginBottom: 8 }}>No hay ofertas activas</div>
            <div style={{ fontSize: 14 }}>Vuelve pronto — publicamos descuentos cada semana.</div>
            <Link href="/" className="btn-outline" style={{ marginTop: 22, textDecoration: 'none' }}>← Volver al inicio</Link>
          </div>
        )}
      </div>
    </>
  )
}

export async function getStaticProps() {
  try {
    const offers = await fetchOffers()
    return { props: { offers }, revalidate: 60 }
  } catch (err) {
    console.error('Error fetching offers:', err)
    return { props: { offers: [] }, revalidate: 30 }
  }
}
