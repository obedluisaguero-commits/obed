// pages/index.jsx — monky's STORE · Home (rediseño 2026)
// Hero verde con stats, banda de confianza, categorías con foto 4:5, banner de
// ofertas reales, destacados con tabs y banner de WhatsApp.
import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { fetchProducts } from '../lib/sheets'
import { safeJsonLd } from '../lib/jsonld'
import { waLink, SITE_URL } from '../lib/config'
import ProductCard from '../components/ProductCard'

const SEO = {
  title: "monky's | Moda para toda la familia – Huancayo, Perú",
  description: 'Tienda de ropa moderna para mujer, hombre y niños. Vestidos, blusas, polos, casacas y más. Precios competitivos, envíos a todo Perú.',
  canonical: SITE_URL,
}

const CATEGORIES = [
  { slug: 'mujer',  name: 'Mujer',  subs: 'Vestidos · Blusas · Lencería' },
  { slug: 'hombre', name: 'Hombre', subs: 'Casacas · Polos · Táctica' },
  { slug: 'ninos',  name: 'Niños',  subs: 'Vestidos · Conjuntos' },
  { slug: 'otros',  name: 'Otros',  subs: 'Hogar · Accesorios' },
]

const WA_GENERAL = waLink("Hola Monky's Store, tengo una consulta.")

function normalizarTexto(texto = '') {
  return texto.toString().trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

const eyebrow = { font: "600 11.5px 'Archivo',sans-serif", letterSpacing: '.28em', color: 'var(--gold)', textTransform: 'uppercase' }
const h2 = { font: "750 38px/1.1 'Archivo',sans-serif", letterSpacing: '-.02em', margin: '10px 0 0', color: 'var(--ink)' }

export default function Home({ featuredProducts = [], offersCount = 0, maxDiscount = 0, totalProducts = 0, catImages = {} }) {
  const [tab, setTab] = useState('todos')

  const filtered = tab === 'todos'
    ? featuredProducts
    : featuredProducts.filter((p) => normalizarTexto(p.Categoria) === normalizarTexto(tab))

  const TABS = [['todos', 'Todos'], ['mujer', 'Mujer'], ['hombre', 'Hombre'], ['ninos', 'Niños'], ['otros', 'Otros']]

  return (
    <>
      <Head>
        <title>{SEO.title}</title>
        <meta name="description" content={SEO.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={SEO.canonical} />
        <meta property="og:title" content={SEO.title} />
        <meta property="og:description" content={SEO.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SEO.canonical} />
        <meta property="og:image" content={`${SEO.canonical}/og-image.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={`${SEO.canonical}/og-image.png`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
          '@context': 'https://schema.org', '@type': 'ClothingStore',
          name: "monky's", url: SEO.canonical,
          address: { '@type': 'PostalAddress', addressLocality: 'Huancayo', addressRegion: 'Junín', addressCountry: 'PE' },
          openingHours: 'Mo-Sa 09:00-20:00',
        }) }} />
      </Head>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--green)', color: '#F5F2EA' }}>
        <div className="wrap hero-grid" style={{ paddingTop: 64, paddingBottom: 72 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, font: "600 12px 'Archivo',sans-serif", letterSpacing: '.28em', color: 'var(--gold-light)' }}>
              <span style={{ width: 34, height: 2, background: 'var(--gold-light)', display: 'inline-block' }} />
              NUEVA TEMPORADA {new Date().getFullYear()}
            </div>
            <h1 style={{ font: "750 clamp(48px,5.2vw,72px)/1.04 'Archivo',sans-serif", letterSpacing: '-.03em', margin: '22px 0 0' }}>
              Moda para<br /><span style={{ color: 'var(--gold-light)' }}>toda tu familia</span>
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.65, color: 'rgba(245,242,234,.72)', maxWidth: 440, margin: '22px 0 34px' }}>
              Ropa moderna, cómoda y a precios competitivos. Estilo internacional para toda la familia.
            </p>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <Link href="/mujer" style={{ height: 52, padding: '0 30px', borderRadius: 99, background: '#F5F2EA', color: 'var(--green)', font: "700 13px 'Archivo',sans-serif", letterSpacing: '.1em', display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
                VER COLECCIÓN
              </Link>
              <Link href="/ofertas" style={{ height: 52, padding: '0 28px', border: '1px solid rgba(245,242,234,.35)', borderRadius: 99, background: 'transparent', color: '#F5F2EA', font: "700 13px 'Archivo',sans-serif", letterSpacing: '.1em', display: 'inline-flex', alignItems: 'center', textDecoration: 'none', transition: 'border-color .15s,color .15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold-light)'; e.currentTarget.style.color = 'var(--gold-light)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(245,242,234,.35)'; e.currentTarget.style.color = '#F5F2EA' }}
              >
                VER OFERTAS
              </Link>
            </div>
            <div className="stats-row">
              <div>
                <div style={{ font: "750 26px 'Archivo',sans-serif" }}>{totalProducts}+</div>
                <div style={{ fontSize: 12.5, color: 'rgba(245,242,234,.6)', marginTop: 2 }}>productos</div>
              </div>
              <div style={{ width: 1, background: 'rgba(245,242,234,.18)' }} />
              <div>
                <div style={{ font: "750 26px 'Archivo',sans-serif" }}>24-72h</div>
                <div style={{ fontSize: 12.5, color: 'rgba(245,242,234,.6)', marginTop: 2 }}>envío a todo Perú</div>
              </div>
              <div style={{ width: 1, background: 'rgba(245,242,234,.18)' }} />
              <div>
                <div style={{ font: "750 26px 'Archivo',sans-serif" }}>7 días</div>
                <div style={{ fontSize: 12.5, color: 'rgba(245,242,234,.6)', marginTop: 2 }}>para cambios</div>
              </div>
            </div>
          </div>

          <div className="hero-visual" style={{ position: 'relative', height: 520, borderRadius: 24, overflow: 'hidden', background: 'var(--green-deep)' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image src="/monkys-avatar.svg" alt="monky&apos;s STORE" width={210} height={210} priority />
            </div>
            <div style={{ position: 'absolute', top: 18, right: 18, background: 'rgba(11,46,35,.85)', backdropFilter: 'blur(6px)', color: '#F5F2EA', border: '1px solid rgba(245,242,234,.15)', borderRadius: 99, padding: '9px 16px', font: "600 12px 'Archivo',sans-serif", letterSpacing: '.06em', pointerEvents: 'none' }}>
              Envíos a todo el Perú
            </div>
          </div>
        </div>
      </section>

      {/* ── BANDA DE CONFIANZA ───────────────────────────────────────────── */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--border)' }}>
        <div className="wrap grid-trust" style={{ paddingTop: 26, paddingBottom: 26 }}>
          {[
            ['↗', 'Envíos a todo Perú', 'Todas las regiones'],
            ['◈', 'Pagos seguros', 'Yape · Plin · Transferencia'],
            ['↺', 'Cambios en 7 días', 'Sin costo adicional'],
            ['●', 'Atención personalizada', 'Te asesoramos por WhatsApp'],
          ].map(([glyph, title, sub]) => (
            <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <div style={{ width: 38, height: 38, borderRadius: 99, background: 'var(--surface-2)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: "700 15px 'Archivo',sans-serif", flex: 'none' }}>{glyph}</div>
              <div>
                <div style={{ font: "600 13.5px 'Instrument Sans',sans-serif", color: 'var(--ink)' }}>{title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 1 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORÍAS ───────────────────────────────────────────────────── */}
      <section className="wrap" style={{ paddingTop: 72, paddingBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 20, marginBottom: 34, flexWrap: 'wrap' }}>
          <div>
            <div style={eyebrow}>COLECCIONES</div>
            <h2 style={h2}>Explora por categoría</h2>
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-3)', paddingBottom: 6 }}>Todo lo que tu familia necesita en un solo lugar</div>
        </div>
        <div className="grid-cats">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/${c.slug}`} className="catcard">
              <div style={{ position: 'relative', aspectRatio: '4/5', background: 'var(--surface)' }}>
                {catImages[c.slug] ? (
                  <Image src={catImages[c.slug]} alt={c.name} fill style={{ objectFit: 'contain' }} sizes="(max-width:1024px) 50vw, 25vw" />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', font: "800 44px 'Archivo',sans-serif", color: 'rgba(16,36,29,.14)' }}>{c.name}</div>
                )}
              </div>
              <div style={{ padding: '16px 18px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <div>
                  <div style={{ font: "700 18px 'Archivo',sans-serif", letterSpacing: '-.01em', color: 'var(--ink)' }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 3 }}>{c.subs}</div>
                </div>
                <div style={{ width: 34, height: 34, borderRadius: 99, border: '1px solid rgba(16,36,29,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green)', flex: 'none' }}>→</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Banner de ofertas — solo con ofertas reales */}
        {offersCount > 0 && (
          <Link href="/ofertas" className="lift" style={{ marginTop: 20, background: 'var(--green-deep)', color: '#F5F2EA', borderRadius: 18, padding: '30px 34px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
            <div>
              <div style={{ font: "600 11px 'Archivo',sans-serif", letterSpacing: '.28em', color: 'var(--gold-light)' }}>05 — OFERTAS</div>
              <div style={{ font: "750 26px 'Archivo',sans-serif", letterSpacing: '-.01em', marginTop: 8 }}>Ofertas especiales</div>
              <div style={{ fontSize: 13.5, color: 'rgba(245,242,234,.65)', marginTop: 5 }}>
                {maxDiscount > 0 ? `Hasta ${maxDiscount}% de descuento · ` : ''}{offersCount} {offersCount === 1 ? 'producto en oferta' : 'productos en oferta'}
              </div>
            </div>
            <div style={{ width: 46, height: 46, borderRadius: 99, background: 'var(--gold-light)', color: 'var(--green-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flex: 'none' }}>→</div>
          </Link>
        )}
      </section>

      {/* ── DESTACADOS ───────────────────────────────────────────────────── */}
      <section className="wrap" style={{ paddingTop: 72, paddingBottom: 72 }}>
        <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 30 }}>
          <div>
            <div style={eyebrow}>MÁS VENDIDOS</div>
            <h2 style={h2}>Productos destacados</h2>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {TABS.map(([val, label]) => (
              <button key={val} type="button" onClick={() => setTab(val)}
                style={{
                  height: 36, padding: '0 16px', borderRadius: 99,
                  border: `1px solid ${tab === val ? 'var(--green)' : 'var(--border-strong)'}`,
                  background: tab === val ? 'var(--green)' : '#fff',
                  color: tab === val ? '#F5F2EA' : '#3D4C45',
                  font: "600 12px 'Archivo',sans-serif", letterSpacing: '.06em', textTransform: 'uppercase', cursor: 'pointer',
                }}
              >{label}</button>
            ))}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="product-grid">
            {filtered.slice(0, 8).map((p) => <ProductCard key={p.ID} product={p} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: 70, color: 'var(--text-3)' }}>
            <div style={{ font: "700 18px 'Archivo',sans-serif", color: 'var(--ink)', marginBottom: 6 }}>Sin productos por ahora</div>
            <div style={{ fontSize: 14 }}>No hay productos en esta categoría por el momento.</div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <Link href="/productos" className="btn-outline" style={{ textDecoration: 'none' }}>Ver todos los productos →</Link>
        </div>
      </section>

      {/* ── BANNER WHATSAPP ──────────────────────────────────────────────── */}
      <section className="wrap" style={{ paddingBottom: 80 }}>
        <div className="wa-banner" style={{ background: 'var(--green)', borderRadius: 24, padding: '52px 56px', color: '#F5F2EA' }}>
          <div style={{ maxWidth: 560 }}>
            <h3 style={{ font: "750 30px/1.2 'Archivo',sans-serif", letterSpacing: '-.01em', margin: 0 }}>¿Dudas con tallas o disponibilidad?</h3>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(245,242,234,.7)', margin: '12px 0 0' }}>
              Escríbenos por WhatsApp y te asesoramos al instante. Confirmamos tu pedido, coordinamos el pago con Yape, Plin o transferencia, y lo enviamos a cualquier región.
            </p>
          </div>
          <a href={WA_GENERAL} target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ height: 54, padding: '0 32px', textDecoration: 'none', flex: 'none' }}>
            ESCRÍBENOS
          </a>
        </div>
      </section>
    </>
  )
}

export async function getStaticProps() {
  try {
    const products = await fetchProducts()
    const visibles = products.filter((p) => p.Estado === 'activo' || p.Estado === 'nuevo')

    const featured = visibles
      .filter((p) => p.Stock > 0)
      .sort((a, b) => (b.PrecioOferta ? 1 : 0) - (a.PrecioOferta ? 1 : 0))
      .slice(0, 12)

    const offers = visibles.filter((p) => p.PrecioOferta && p.PrecioOferta < p.Precio)
    const maxDiscount = offers.reduce((max, p) => {
      const d = Math.round(((p.Precio - p.PrecioOferta) / p.Precio) * 100)
      return d > max ? d : max
    }, 0)

    // Foto representativa por categoría (primer producto visible con imagen)
    const slugDe = (cat = '') => cat.toString().trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    const catImages = {}
    for (const p of visibles) {
      const slug = slugDe(p.Categoria)
      if (p.Imagen1 && !catImages[slug]) catImages[slug] = p.Imagen1
    }

    return {
      props: { featuredProducts: featured, offersCount: offers.length, maxDiscount, totalProducts: visibles.length, catImages },
      revalidate: 60,
    }
  } catch (err) {
    console.error('Error fetching products:', err)
    return { props: { featuredProducts: [], offersCount: 0, maxDiscount: 0, totalProducts: 0, catImages: {} }, revalidate: 30 }
  }
}
