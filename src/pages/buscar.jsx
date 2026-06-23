// pages/buscar.jsx — Página de resultados de búsqueda
// El navbar (_app.jsx) redirige aquí con ?q=...; esta página consume /api/buscar
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

const WPP_NUMBER = process.env.NEXT_PUBLIC_WPP_NUMBER || '51999999999'

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
        <title>{q ? `Buscar: ${q} | Sweet Raquel` : 'Buscar | Sweet Raquel'}</title>
        <meta name="robots" content="noindex, follow" />
      </Head>

      <div style={{ borderBottom: '1px solid var(--border)', padding: '40px 32px 32px' }}>
        <p style={{ fontSize: '11px', color: 'var(--light)', marginBottom: '16px', letterSpacing: '.3px' }}>
          <Link href="/" style={{ color: 'var(--mid)', textDecoration: 'none' }}>Inicio</Link>
          <span> · </span>
          <span style={{ color: 'var(--black)' }}>Búsqueda</span>
        </p>
        <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-1px', color: 'var(--black)' }}>
          {q ? <>Resultados para “{q}”</> : 'Buscar productos'}
        </h1>
        {q && !loading && (
          <p style={{ fontSize: '13px', color: 'var(--light)', marginTop: '8px' }}>
            {results.length} {results.length === 1 ? 'producto encontrado' : 'productos encontrados'}
          </p>
        )}
      </div>

      <div style={{ padding: '32px' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--light)' }}>
            <p style={{ fontSize: '13px', letterSpacing: '.5px' }}>Buscando…</p>
          </div>
        )}

        {!loading && error && (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--light)' }}>
            <p style={{ fontSize: '13px', letterSpacing: '.5px' }}>Ocurrió un error al buscar. Intenta de nuevo.</p>
          </div>
        )}

        {!loading && !error && q.trim().length < 2 && (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--light)' }}>
            <p style={{ fontSize: '13px', letterSpacing: '.5px' }}>Escribe al menos 2 letras para buscar.</p>
          </div>
        )}

        {!loading && !error && q.trim().length >= 2 && results.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--light)' }}>
            <p style={{ fontSize: '32px', marginBottom: '12px' }}>◎</p>
            <p style={{ fontSize: '13px', letterSpacing: '.5px' }}>No encontramos productos para “{q}”.</p>
            <Link href="/" style={{ color: 'var(--emerald)', textDecoration: 'none', fontSize: '12px', marginTop: '12px', display: 'inline-block' }}>
              ← Volver al inicio
            </Link>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'var(--border)' }}>
            {results.map((p) => {
              const hasDiscount = p.PrecioOferta && p.PrecioOferta < p.Precio
              const price = hasDiscount ? p.PrecioOferta : p.Precio
              const discount = hasDiscount ? Math.round(((p.Precio - p.PrecioOferta) / p.Precio) * 100) : 0
              const wppMsg = encodeURIComponent(`Hola Sweet Raquel 👋 Me interesa:\n\n*${p.Nombre}*\nCódigo: ${p.Codigo}\nPrecio: S/ ${price}`)
              return (
                <div key={p.ID} style={{ background: '#fff', transition: 'background .15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
                >
                  <Link href={`/producto/${p.ID}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <div style={{ height: '200px', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', position: 'relative', overflow: 'hidden' }}>
                      {p.Imagen1 ? <Image src={p.Imagen1} alt={p.Nombre} fill style={{ objectFit: 'cover' }} sizes="25vw" /> : <span>👗</span>}
                      {hasDiscount && <span className="badge-sale" style={{ position: 'absolute', top: '12px', left: '12px' }}>−{discount}%</span>}
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
                    <a href={`https://wa.me/${WPP_NUMBER}?text=${wppMsg}`} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'block', textAlign: 'center', textDecoration: 'none', padding: '9px', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', background: 'var(--black)', color: '#fff', transition: 'background .15s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--emerald)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--black)')}
                    >Pedir por WhatsApp</a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
