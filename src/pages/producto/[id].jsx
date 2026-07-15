// pages/producto/[id].jsx — Ficha de producto (rediseño 2026)
// Foto 4:5 radio 22 + galería; columna derecha sticky con chips de talla/color,
// stepper de cantidad, AGREGAR AL CARRITO y compra directa por WhatsApp.
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { fetchProducts, fetchProductById, fetchRelatedProducts } from '../../lib/sheets'
import { useCart } from '../../lib/cart'
import { safeJsonLd } from '../../lib/jsonld'
import { waLink, SITE_URL } from '../../lib/config'
import ProductCard from '../../components/ProductCard'

// Normaliza la categoría a un slug sin tildes para enlazar a la ruta correcta
function slugCategoria(t = '') {
  return t.toString().trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

const sideTitle = { font: "600 11px 'Archivo',sans-serif", letterSpacing: '.24em', color: 'var(--text-3)', marginBottom: 12 }
const chipOn = {
  minWidth: 48, height: 42, padding: '0 16px', borderRadius: 10, border: '1px solid var(--green)',
  background: 'var(--green)', color: '#F5F2EA', font: "600 12.5px 'Archivo',sans-serif", cursor: 'default',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
}

export default function ProductPage({ product, related }) {
  const { addItem } = useCart()
  const [activeImg, setActiveImg] = useState(0)
  const [qty, setQty] = useState(1)
  const [liveStock, setLiveStock] = useState(product.Stock)

  // Stock en tiempo real: refresca cada 20s contra la API interna
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/stock/${product.ID}`)
        if (res.ok) {
          const data = await res.json()
          setLiveStock(data.Stock)
        }
      } catch (e) {
        // silencioso: si falla, mantenemos el último valor conocido
      }
    }, 20000)
    return () => clearInterval(interval)
  }, [product.ID])

  const images = [product.Imagen1, product.Imagen2, product.Imagen3].filter(Boolean)
  const hasDiscount = product.PrecioOferta && product.PrecioOferta < product.Precio
  const price = hasDiscount ? product.PrecioOferta : product.Precio
  const discount = hasDiscount ? Math.round(((product.Precio - product.PrecioOferta) / product.Precio) * 100) : 0
  const out = !(liveStock > 0)

  const buyMsg = `Hola Monky's Store, quiero comprar:\n• ${qty} x ${product.Nombre}${product.Talla ? ` (Talla ${product.Talla}${product.Color ? `, ${product.Color}` : ''})` : ''} — S/ ${price * qty}\n¿Está disponible?`

  return (
    <>
      <Head>
        <title>{`${product.Nombre} | monky's`}</title>
        <meta name="description" content={product.Descripcion?.slice(0, 155) || product.Nombre} />
        <link rel="canonical" href={`${SITE_URL}/producto/${product.ID}`} />
        <meta property="og:title" content={product.Nombre} />
        <meta property="og:image" content={product.Imagen1} />
        <meta property="og:type" content="product" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: product.Nombre,
              description: product.Descripcion,
              image: images,
              sku: product.Codigo,
              brand: { '@type': 'Brand', name: product.Marca || "monky's" },
              offers: {
                '@type': 'Offer',
                priceCurrency: 'PEN',
                price,
                availability: liveStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                url: `${SITE_URL}/producto/${product.ID}`,
              },
            }),
          }}
        />
      </Head>

      <div className="wrap" style={{ paddingTop: 28, paddingBottom: 80 }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 13, color: 'var(--text-3)', display: 'flex', gap: 8, alignItems: 'center', marginBottom: 26, flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: 'var(--green)', textDecoration: 'none' }}>Inicio</Link>
          <span>·</span>
          <Link href={`/${slugCategoria(product.Categoria)}`} style={{ color: 'var(--green)', textDecoration: 'none', textTransform: 'capitalize' }}>{product.Categoria}</Link>
          <span>·</span>
          <span className="line-clamp-1" style={{ maxWidth: 320 }}>{product.Nombre}</span>
        </div>

        <div className="prod-grid">
          {/* Galería */}
          <div>
            <div style={{ position: 'relative', aspectRatio: '4/5', borderRadius: 22, overflow: 'hidden', background: 'var(--surface)' }}>
              {images.length > 0 ? (
                <Image src={images[activeImg]} alt={product.Nombre} fill style={{ objectFit: 'contain' }} sizes="(max-width:900px) 100vw, 50vw" priority />
              ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', font: "600 12px 'Archivo',sans-serif", letterSpacing: '.14em', color: 'var(--muted)' }}>FOTO</div>
              )}
              {hasDiscount && (
                <span className="badge-sale" style={{ position: 'absolute', top: 16, left: 16, fontSize: 13, padding: '6px 12px', pointerEvents: 'none' }}>−{discount}%</span>
              )}
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                {images.map((img, i) => (
                  <button key={i} type="button" onClick={() => setActiveImg(i)} aria-label={`Foto ${i + 1}`}
                    style={{
                      position: 'relative', width: 76, height: 76, borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
                      background: 'var(--surface)', border: `2px solid ${activeImg === i ? 'var(--gold)' : 'transparent'}`,
                    }}
                  >
                    <Image src={img} alt={`${product.Nombre} ${i + 1}`} fill style={{ objectFit: 'contain' }} sizes="76px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info sticky */}
          <div className="prod-sticky">
            <div style={{ font: "600 11px 'Archivo',sans-serif", letterSpacing: '.24em', color: 'var(--gold)', textTransform: 'uppercase' }}>
              {product.Subcategoria || product.Categoria}{product.Marca ? ` · ${product.Marca}` : ''}
            </div>
            <h1 style={{ font: "750 36px/1.15 'Archivo',sans-serif", letterSpacing: '-.02em', margin: '10px 0 14px', color: 'var(--ink)' }}>{product.Nombre}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: out ? 'var(--sale)' : 'var(--ok)', marginBottom: 18 }}>
              <span style={{ width: 8, height: 8, borderRadius: 99, background: out ? 'var(--sale)' : 'var(--ok)', display: 'inline-block' }} />
              {out ? 'Sin stock por el momento' : 'Disponible'}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 26 }}>
              <span style={{ font: "750 34px 'Archivo',sans-serif", color: 'var(--ink)' }}>S/ {price}</span>
              {hasDiscount && (
                <>
                  <span style={{ fontSize: 17, color: 'var(--muted)', textDecoration: 'line-through' }}>S/ {product.Precio}</span>
                  <span style={{ font: "700 13px 'Archivo',sans-serif", color: 'var(--sale)' }}>−{discount}%</span>
                </>
              )}
            </div>

            {product.Descripcion && (
              <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--text-2)', margin: '0 0 26px', maxWidth: 460 }}>{product.Descripcion}</p>
            )}

            {product.Talla && (
              <>
                <div style={sideTitle}>TALLA</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginBottom: 24 }}>
                  <span style={chipOn}>{product.Talla}</span>
                </div>
              </>
            )}
            {product.Color && (
              <>
                <div style={sideTitle}>COLOR</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginBottom: 24 }}>
                  <span style={{ ...chipOn, minWidth: 0, fontFamily: "'Instrument Sans',sans-serif" }}>{product.Color}</span>
                </div>
              </>
            )}
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 12.5, color: 'var(--text-3)' }}>Código: {product.Codigo}</span>
            </div>

            {/* Cantidad + agregar */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '18px 0 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(16,36,29,.16)', borderRadius: 99, height: 52, background: '#fff' }}>
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Menos"
                  style={{ width: 44, height: '100%', border: 'none', background: 'none', fontSize: 18, color: 'var(--ink)', cursor: 'pointer' }}>−</button>
                <span style={{ minWidth: 28, textAlign: 'center', font: "700 15px 'Archivo',sans-serif" }}>{qty}</span>
                <button type="button" onClick={() => setQty((q) => q + 1)} aria-label="Más"
                  style={{ width: 44, height: '100%', border: 'none', background: 'none', fontSize: 18, color: 'var(--ink)', cursor: 'pointer' }}>+</button>
              </div>
              <button type="button" className="btn-primary" disabled={out}
                style={{ flex: 1, height: 52, opacity: out ? .5 : 1, cursor: out ? 'default' : 'pointer' }}
                onClick={() => { if (!out) addItem({ ...product, Stock: liveStock }, qty) }}
              >
                {out ? 'Sin stock' : 'Agregar al carrito'}
              </button>
            </div>
            <a href={out ? undefined : waLink(buyMsg)} target="_blank" rel="noopener noreferrer" className="btn-outline"
              style={{ width: '100%', height: 52, textDecoration: 'none', pointerEvents: out ? 'none' : 'auto', opacity: out ? .5 : 1 }}
            >
              Comprar ahora por WhatsApp
            </a>

            {/* Info de envíos/cambios */}
            <div style={{ marginTop: 30, borderTop: '1px solid rgba(16,36,29,.1)' }}>
              <div style={{ display: 'flex', gap: 13, padding: '16px 0', borderBottom: '1px solid rgba(16,36,29,.1)' }}>
                <span style={{ color: 'var(--gold)' }}>→</span>
                <div>
                  <div style={{ font: "600 13.5px 'Instrument Sans',sans-serif" }}>Envíos a todo Perú</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 2 }}>Entrega en 24–72h según región</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 13, padding: '16px 0' }}>
                <span style={{ color: 'var(--gold)' }}>→</span>
                <div>
                  <div style={{ font: "600 13.5px 'Instrument Sans',sans-serif" }}>Cambios en 7 días</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 2 }}>Sin costo adicional · <Link href="/politica-de-cambios" style={{ color: 'var(--green)' }}>ver política</Link></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Relacionados */}
        {related.length > 0 && (
          <div style={{ marginTop: 70 }}>
            <h2 style={{ font: "750 28px 'Archivo',sans-serif", letterSpacing: '-.01em', margin: '0 0 24px', color: 'var(--ink)' }}>También te puede gustar</h2>
            <div className="product-grid">
              {related.map((p) => <ProductCard key={p.ID} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export async function getStaticPaths() {
  try {
    const products = await fetchProducts()
    const paths = products.slice(0, 50).map((p) => ({ params: { id: p.ID } })) // pre-renderiza los primeros 50
    return { paths, fallback: 'blocking' } // el resto se genera bajo demanda (ISR)
  } catch (err) {
    console.error('Error fetching products for paths:', err)
    return { paths: [], fallback: 'blocking' }
  }
}

export async function getStaticProps({ params }) {
  try {
    const product = await fetchProductById(params.id)
    if (!product) return { notFound: true }

    const related = await fetchRelatedProducts(product, 4)
    return { props: { product, related }, revalidate: 60 }
  } catch (err) {
    console.error('Error fetching product:', err)
    return { notFound: true, revalidate: 30 }
  }
}
