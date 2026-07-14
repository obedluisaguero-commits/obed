// pages/_app.jsx — Layout global · monky's STORE · Rediseño 2026
// Header sticky con nav de pills, buscador, carrito con badge y botón WhatsApp;
// footer verde profundo de 4 columnas; carrito lateral (drawer) y toast global.
import '../styles/globals.css'
import { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { CartProvider, useCart, buildWhatsappOrder } from '../lib/cart'
import { WPP_NUMBER, WPP_DISPLAY, waLink } from '../lib/config'

const NAV_LINKS = [
  ['/', 'Inicio'],
  ['/mujer', 'Mujer'],
  ['/hombre', 'Hombre'],
  ['/ninos', 'Niños'],
  ['/otros', 'Otros'],
  ['/ofertas', 'Ofertas'],
]

const WA_GENERAL = waLink("Hola Monky's Store, tengo una consulta.")

function Topbar() {
  return (
    <div style={{ background: 'var(--green-deep)', color: 'rgba(245,242,234,.85)', fontSize: 13, letterSpacing: '.02em', textAlign: 'center', padding: '9px 16px' }}>
      Envíos a todo Perú&nbsp;&nbsp;·&nbsp;&nbsp;Yape, Plin y transferencia&nbsp;&nbsp;·&nbsp;&nbsp;
      <span style={{ color: 'var(--gold-light)' }}>Atención por WhatsApp</span>
    </div>
  )
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="4" y="7" width="16" height="14" rx="2" />
      <path d="M8 7a4 4 0 0 1 8 0" />
    </svg>
  )
}

function Logo({ onClick }) {
  return (
    <Link href="/" onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none', flex: 'none' }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
        <Image src="/monkys-simbolo.svg" alt="monky&apos;s STORE" width={30} height={30} priority />
      </div>
      <div style={{ lineHeight: 1 }}>
        <div style={{ font: "800 19px 'Archivo',sans-serif", letterSpacing: '-.01em', color: 'var(--ink)' }}>
          monky<span style={{ color: 'var(--gold)' }}>&apos;s</span>
        </div>
        <div style={{ font: "600 9px 'Archivo',sans-serif", letterSpacing: '.34em', color: 'var(--text-3)', marginTop: 3 }}>STORE</div>
      </div>
    </Link>
  )
}

function Navbar() {
  const router = useRouter()
  const { count, hydrated, setOpen } = useCart()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (href) => (href === '/' ? router.pathname === '/' : router.asPath.startsWith(href))

  const handleSearch = (e) => {
    e.preventDefault()
    if (!search.trim()) return
    setMenuOpen(false)
    router.push(`/buscar?q=${encodeURIComponent(search.trim())}`)
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Logo onClick={() => setMenuOpen(false)} />

        <nav aria-label="Categorías">
          <ul className="nav-links">
            {NAV_LINKS.map(([href, label]) => (
              <li key={href}>
                <Link href={href} className={`nav-pill${isActive(href) ? ' active' : ''}`}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ flex: 1 }} />

        <form onSubmit={handleSearch} className="nav-search-desktop">
          <input
            className="nav-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar…"
            aria-label="Buscar productos"
          />
        </form>

        <button type="button" className="nav-icon-btn" title="Carrito" aria-label="Ver carrito" onClick={() => setOpen(true)} style={{ color: 'var(--ink)' }}>
          <CartIcon />
          {hydrated && count > 0 && (
            <span style={{ position: 'absolute', top: -6, right: -6, minWidth: 20, height: 20, borderRadius: 99, background: 'var(--sale)', color: '#fff', font: "700 11px 'Archivo',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>
              {count}
            </span>
          )}
        </button>

        <a href={WA_GENERAL} target="_blank" rel="noopener noreferrer" className="nav-wsp nav-wsp-desktop">WHATSAPP</a>

        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Panel móvil */}
      <div className={`nav-mobile ${menuOpen ? 'open' : ''}`}>
        <form onSubmit={handleSearch} style={{ display: 'flex', marginBottom: 14 }}>
          <input
            className="nav-search"
            style={{ flex: 1, width: '100%', height: 44 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar productos…"
            aria-label="Buscar productos"
          />
        </form>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 2, listStyle: 'none', margin: 0, padding: 0, marginBottom: 14 }}>
          {[...NAV_LINKS, ['/contacto', 'Contacto']].map(([href, label]) => (
            <li key={href}>
              <Link href={href} onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block', textDecoration: 'none', padding: '12px 12px', borderRadius: 10,
                  background: isActive(href) ? 'var(--surface)' : 'transparent',
                  color: 'var(--ink)', font: `${isActive(href) ? '700' : '500'} 14.5px 'Instrument Sans',sans-serif`,
                }}
              >{label}</Link>
            </li>
          ))}
        </ul>
        <a href={WA_GENERAL} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: '100%', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>
          Contactar por WhatsApp
        </a>
      </div>
    </header>
  )
}

function Footer() {
  const tienda = [['Mujer', '/mujer'], ['Hombre', '/hombre'], ['Niños', '/ninos'], ['Otros', '/otros'], ['Ofertas', '/ofertas']]
  const ayuda = [
    ['Guía de tallas', '/guia-de-tallas'],
    ['Política de cambios', '/politica-de-cambios'],
    ['Preguntas frecuentes', '/preguntas-frecuentes'],
    ['Sobre nosotros', '/sobre-nosotros'],
  ]
  const linkStyle = { color: 'rgba(245,242,234,.75)', textDecoration: 'none', fontSize: 13.5, cursor: 'pointer' }
  const colTitle = { font: "600 11px 'Archivo',sans-serif", letterSpacing: '.24em', color: 'var(--gold-light)', marginBottom: 16 }

  return (
    <footer style={{ background: 'var(--green-deep)', color: 'rgba(245,242,234,.75)', marginTop: 'auto' }}>
      <div className="wrap footer-grid" style={{ paddingTop: 56 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(245,242,234,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image src="/monkys-simbolo.svg" alt="" width={26} height={26} />
            </div>
            <div style={{ font: "800 18px 'Archivo',sans-serif", color: '#F5F2EA' }}>
              monky<span style={{ color: 'var(--gold-light)' }}>&apos;s</span>{' '}
              <span style={{ font: "600 10px 'Archivo',sans-serif", letterSpacing: '.3em', color: 'rgba(245,242,234,.5)' }}>STORE</span>
            </div>
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.65, margin: '0 0 18px', maxWidth: 280 }}>
            Moda para toda tu familia. Calidad peruana, estilo internacional, precios competitivos.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Yape', 'Plin', 'Transferencia'].map((p) => (
              <span key={p} style={{ border: '1px solid rgba(245,242,234,.2)', borderRadius: 8, padding: '6px 12px', font: "600 11.5px 'Archivo',sans-serif" }}>{p}</span>
            ))}
          </div>
        </div>

        <div>
          <div style={colTitle}>TIENDA</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tienda.map(([label, href]) => (
              <Link key={href} href={href} style={linkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-light)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,242,234,.75)')}
              >{label}</Link>
            ))}
          </div>
        </div>

        <div>
          <div style={colTitle}>AYUDA</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ayuda.map(([label, href]) => (
              <Link key={href} href={href} style={linkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-light)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,242,234,.75)')}
              >{label}</Link>
            ))}
          </div>
        </div>

        <div>
          <div style={colTitle}>CONTACTO</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13.5 }}>
            <span>WhatsApp: {WPP_DISPLAY}</span>
            <span>Lun – Sáb · 9:00 a 20:00</span>
            <span>Envíos a todas las regiones del Perú</span>
            <a href="https://instagram.com/monkysstore" target="_blank" rel="noopener noreferrer" style={linkStyle}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-light)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,242,234,.75)')}
            >Instagram</a>
          </div>
          <a href={WA_GENERAL} target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ marginTop: 16, height: 42, padding: '0 22px', fontSize: 12, textDecoration: 'none' }}>
            ESCRÍBENOS
          </a>
        </div>
      </div>
      <div className="wrap" style={{ padding: '22px 28px', borderTop: '1px solid rgba(245,242,234,.12)', marginTop: 44, display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', fontSize: 12.5, color: 'rgba(245,242,234,.5)' }}>
        <span>© {new Date().getFullYear()} Monky&apos;s Store — Todos los derechos reservados</span>
        <span>Huancayo, Perú</span>
      </div>
    </footer>
  )
}

function CartDrawer() {
  const router = useRouter()
  const { items, count, total, removeItem, updateQty, open, setOpen } = useCart()
  const wppHref = items.length ? waLink(buildWhatsappOrder(items, total)) : '#'

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 90, pointerEvents: open ? 'auto' : 'none' }} aria-hidden={!open}>
      <div onClick={() => setOpen(false)}
        style={{ position: 'absolute', inset: 0, background: 'rgba(11,30,24,.5)', opacity: open ? 1 : 0, transition: 'opacity .2s' }}
      />
      <aside aria-label="Carrito de compras"
        style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: 'min(430px, 94vw)', background: '#fff',
          display: 'flex', flexDirection: 'column', boxShadow: '-20px 0 60px rgba(11,30,24,.25)',
          transform: open ? 'translateX(0)' : 'translateX(105%)', transition: 'transform .25s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ font: "750 20px 'Archivo',sans-serif", color: 'var(--ink)' }}>
            Tu carrito <span style={{ font: "600 14px 'Instrument Sans',sans-serif", color: 'var(--text-3)' }}>({count})</span>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar carrito"
            style={{ width: 36, height: 36, borderRadius: 99, border: '1px solid var(--border-strong)', background: '#fff', fontSize: 15, cursor: 'pointer', color: 'var(--ink)' }}
          >✕</button>
        </div>

        {items.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: 'var(--text-3)', padding: 30 }}>
            <div style={{ width: 64, height: 64, borderRadius: 99, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="4" y="7" width="16" height="14" rx="2" /><path d="M8 7a4 4 0 0 1 8 0" /></svg>
            </div>
            <div style={{ font: "700 17px 'Archivo',sans-serif", color: 'var(--ink)' }}>Tu carrito está vacío</div>
            <div style={{ fontSize: 13.5, textAlign: 'center' }}>Explora el catálogo y agrega tus productos favoritos.</div>
            <button type="button" className="btn-primary" style={{ marginTop: 8, height: 46 }}
              onClick={() => { setOpen(false); router.push('/mujer') }}
            >VER COLECCIÓN</button>
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 24px' }}>
              {items.map((i) => (
                <div key={i.id} style={{ display: 'flex', gap: 14, padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 62, height: 78, borderRadius: 10, background: 'var(--surface)', overflow: 'hidden', position: 'relative', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', font: "600 9px 'Archivo',sans-serif", letterSpacing: '.1em', color: 'var(--muted)' }}>
                    {i.imagen ? <Image src={i.imagen} alt={i.nombre} fill style={{ objectFit: 'contain' }} sizes="62px" /> : 'FOTO'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="line-clamp-2" style={{ font: "600 14px 'Instrument Sans',sans-serif", color: 'var(--ink)' }}>{i.nombre}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                      {i.talla ? `Talla ${i.talla} · ` : ''}S/ {i.precio} c/u
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-strong)', borderRadius: 99, height: 32 }}>
                        <button type="button" onClick={() => updateQty(i.id, i.qty - 1)} aria-label="Quitar uno" style={{ width: 30, height: '100%', border: 'none', background: 'none', fontSize: 14, cursor: 'pointer', color: 'var(--ink)' }}>−</button>
                        <span style={{ minWidth: 20, textAlign: 'center', font: "700 13px 'Archivo',sans-serif" }}>{i.qty}</span>
                        <button type="button" onClick={() => updateQty(i.id, i.qty + 1)} aria-label="Agregar uno" style={{ width: 30, height: '100%', border: 'none', background: 'none', fontSize: 14, cursor: 'pointer', color: 'var(--ink)' }}>+</button>
                      </div>
                      <div style={{ font: "750 15px 'Archivo',sans-serif", color: 'var(--ink)' }}>S/ {i.precio * i.qty}</div>
                    </div>
                  </div>
                  <button type="button" onClick={() => removeItem(i.id)} title="Quitar" aria-label={`Quitar ${i.nombre}`}
                    style={{ border: 'none', background: 'none', color: 'var(--muted)', fontSize: 14, alignSelf: 'start', padding: 2, cursor: 'pointer' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--sale)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
                  >✕</button>
                </div>
              ))}
            </div>
            <div style={{ padding: '20px 24px 24px', borderTop: '1px solid var(--border)', background: '#FBFAF6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-2)', marginBottom: 6 }}>
                <span>Envío</span><span>Se coordina por WhatsApp</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
                <span style={{ font: "600 15px 'Instrument Sans',sans-serif" }}>Total</span>
                <span style={{ font: "750 26px 'Archivo',sans-serif", color: 'var(--ink)' }}>S/ {total}</span>
              </div>
              <a href={wppHref} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: '100%', height: 52, textDecoration: 'none' }}>
                Confirmar pedido por WhatsApp
              </a>
              <div style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', marginTop: 10 }}>
                Pagas con Yape, Plin o transferencia al confirmar
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

function Toast() {
  const { toast, clearToast, setOpen } = useCart()
  if (!toast) return null
  return (
    <div style={{
      position: 'fixed', bottom: 26, left: '50%', transform: 'translateX(-50%)', zIndex: 95,
      background: 'var(--green-deep)', color: '#F5F2EA', borderRadius: 99, padding: '13px 22px',
      display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 12px 34px rgba(11,30,24,.35)',
      animation: 'toastIn .25s ease', maxWidth: '92vw',
    }}>
      <span style={{ fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{toast}</span>
      <button type="button"
        onClick={() => { clearToast(); setOpen(true) }}
        style={{ border: 'none', background: 'var(--gold-light)', color: 'var(--green-deep)', borderRadius: 99, height: 30, padding: '0 14px', font: "700 11px 'Archivo',sans-serif", letterSpacing: '.06em', cursor: 'pointer', flex: 'none' }}
      >VER CARRITO</button>
    </div>
  )
}

export default function App({ Component, pageProps }) {
  const router = useRouter()
  return (
    <CartProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <link rel="icon" type="image/svg+xml" href="/monkys-simbolo.svg" />
      </Head>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {router.pathname === '/' && <Topbar />}
        <Navbar />
        <main style={{ flex: 1 }}>
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
      <CartDrawer />
      <Toast />
    </CartProvider>
  )
}
