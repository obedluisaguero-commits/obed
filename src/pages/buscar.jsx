// pages/buscar.jsx — Resultados de búsqueda (rediseño 2026)
// El header redirige aquí con ?q=…; esta página consume /api/buscar.
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import ProductCard from '../components/ProductCard'

export default function BuscarPage() {
  const router = useRouter()
  const q = typeof router.query.q === 'string' ? router.query.q : ''

  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!router.isReady) return
    const query = q.trim()
    if (query.length < 2) {
      setResults([])
      return
    }

    let cancelled = false
    setLoading(true)
    setError(false)

    fetch(`/api/buscar?q=${encodeURIComponent(query)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Error en la búsqueda')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setResults(data.results || [])
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [router.isReady, q])

  return (
    <>
      <Head>
        <title>{q ? `Buscar: ${q} | monky's` : "Buscar | monky's"}</title>
        <meta name="robots" content="noindex, follow" />
      </Head>

      <div className="wrap" style={{ paddingTop: 28, paddingBottom: 80 }}>
        <div style={{ fontSize: 13, color: 'var(--text-3)', display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="/" style={{ color: 'var(--green)', textDecoration: 'none' }}>Inicio</Link>
          <span>·</span>
          <span>Búsqueda</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, margin: '14px 0 8px', flexWrap: 'wrap' }}>
          <h1 style={{ font: "750 clamp(30px,4vw,46px)/1.1 'Archivo',sans-serif", letterSpacing: '-.02em', margin: 0, color: 'var(--ink)' }}>
            {q ? <>Resultados: &ldquo;{q}&rdquo;</> : 'Buscar productos'}
          </h1>
          {q && !loading && (
            <span style={{ fontSize: 14.5, color: 'var(--text-3)' }}>
              {results.length} {results.length === 1 ? 'producto' : 'productos'}
            </span>
          )}
        </div>
        <div style={{ width: 44, height: 3, background: 'var(--gold)', margin: '14px 0 34px' }} />

        {loading && (
          <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-3)', fontSize: 14 }}>Buscando…</div>
        )}

        {!loading && error && (
          <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-3)', fontSize: 14 }}>Ocurrió un error al buscar. Intenta de nuevo.</div>
        )}

        {!loading && !error && q.trim().length < 2 && (
          <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-3)', fontSize: 14 }}>Escribe al menos 2 letras en el buscador.</div>
        )}

        {!loading && !error && q.trim().length >= 2 && results.length === 0 && (
          <div style={{ textAlign: 'center', padding: '90px 20px', color: 'var(--text-3)' }}>
            <div style={{ font: "700 20px 'Archivo',sans-serif", color: 'var(--ink)', marginBottom: 8 }}>Sin resultados</div>
            <div style={{ fontSize: 14 }}>No encontramos productos para &ldquo;{q}&rdquo;. Prueba con otra palabra.</div>
            <Link href="/productos" className="btn-outline" style={{ marginTop: 22, textDecoration: 'none' }}>Ver todos los productos</Link>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="product-grid">
            {results.map((p) => <ProductCard key={p.ID} product={p} />)}
          </div>
        )}
      </div>
    </>
  )
}
