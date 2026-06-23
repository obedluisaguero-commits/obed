// pages/_app.jsx — Layout global · Sweet Raquel · Estética premium internacional
import '../styles/globals.css'
import { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'

const WPP_NUMBER = process.env.NEXT_PUBLIC_WPP_NUMBER || '51999999999'
const NAV_LINKS = [['/', 'Inicio'],['/mujer','Mujer'],['/hombre','Hombre'],['/ninos','Niños'],['/ofertas','Ofertas'],['/contacto','Contacto']]

function Topbar() {
  return (
    <div style={{background:'var(--anthracite)',color:'rgba(255,255,255,.65)',textAlign:'center',padding:'8px',fontSize:'11px',letterSpacing:'.5px'}}>
      Envíos a todo Perú &nbsp;·&nbsp; Yape, Plin y transferencia &nbsp;·&nbsp;{' '}
      <span style={{color:'var(--emerald-mist)'}}>Atención por WhatsApp</span>
    </div>
  )
}

function Navbar() {
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) window.location.href = `/buscar?q=${encodeURIComponent(search)}`
  }

  const wppHref = `https://wa.me/${WPP_NUMBER}?text=${encodeURIComponent('Hola Sweet Raquel 👋 quiero información sobre sus productos')}`

  return (
    <nav className="navbar">
      <Link href="/" className="nav-logo" style={{textDecoration:'none'}} onClick={() => setMenuOpen(false)}>
        <span style={{fontSize:'20px',fontWeight:700,color:'var(--black)',letterSpacing:'-1px'}}>
          Sweet Raquel <span style={{fontWeight:300,color:'var(--mid)'}}>/ MODA</span>
        </span>
      </Link>

      {/* Enlaces de escritorio */}
      <ul className="nav-links">
        {NAV_LINKS.map(([href, label]) => (
          <li key={href}>
            <Link href={href} style={{textDecoration:'none',color:'var(--dark)',fontSize:'12px',fontWeight:500,letterSpacing:'.3px',textTransform:'uppercase',transition:'color .15s'}}
              onMouseEnter={e=>e.currentTarget.style.color='var(--emerald)'}
              onMouseLeave={e=>e.currentTarget.style.color='var(--dark)'}
            >{label}</Link>
          </li>
        ))}
      </ul>

      <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
        <form onSubmit={handleSearch} className="nav-search-desktop" style={{display:'flex'}}>
          <input
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="Buscar..."
            aria-label="Buscar productos"
            style={{border:'1px solid var(--border)',borderRadius:'4px',padding:'7px 14px',fontSize:'11px',color:'var(--dark)',background:'var(--surface)',width:'160px',letterSpacing:'.3px'}}
          />
        </form>
        <a
          href={wppHref}
          target="_blank" rel="noopener noreferrer"
          className="btn-primary nav-wpp-desktop"
          style={{textDecoration:'none',display:'inline-block'}}
        >
          WhatsApp
        </a>

        {/* Botón hamburguesa (solo móvil) */}
        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Panel desplegable (solo móvil) */}
      <div className={`nav-mobile ${menuOpen ? 'open' : ''}`}>
        <form onSubmit={handleSearch} style={{display:'flex',marginBottom:'16px'}}>
          <input
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="Buscar productos..."
            aria-label="Buscar productos"
            style={{flex:1,border:'1px solid var(--border)',borderRadius:'4px',padding:'10px 14px',fontSize:'13px',color:'var(--dark)',background:'var(--surface)',letterSpacing:'.3px'}}
          />
        </form>
        <ul style={{display:'flex',flexDirection:'column',gap:'2px',listStyle:'none',margin:0,padding:0,marginBottom:'16px'}}>
          {NAV_LINKS.map(([href, label]) => (
            <li key={href}>
              <Link href={href} onClick={() => setMenuOpen(false)}
                style={{display:'block',textDecoration:'none',color:'var(--dark)',fontSize:'14px',fontWeight:500,letterSpacing:'.3px',textTransform:'uppercase',padding:'12px 8px',borderBottom:'1px solid var(--border)'}}
              >{label}</Link>
            </li>
          ))}
        </ul>
        <a
          href={wppHref}
          target="_blank" rel="noopener noreferrer"
          className="btn-primary"
          style={{textDecoration:'none',display:'block',textAlign:'center'}}
          onClick={() => setMenuOpen(false)}
        >
          Contactar por WhatsApp
        </a>
      </div>
    </nav>
  )
}

function Footer() {
  const cols = [
    { title: 'Colecciones', links: [['Mujer','/mujer'],['Hombre','/hombre'],['Niños','/ninos'],['Ropa de dormir','/mujer'],['Ofertas','/ofertas']] },
    { title: 'Información', links: [['Guía de tallas','#'],['Política de cambios','#'],['Preguntas frecuentes','#'],['Sobre nosotros','#']] },
    { title: 'Contacto', links: [['WhatsApp','#'],['Instagram','#'],['Facebook','#'],['Huancayo, Perú','#']] },
  ]
  return (
    <footer style={{background:'var(--anthracite)',padding:'48px 32px 24px'}}>
      <div style={{display:'flex',gap:'48px',marginBottom:'40px'}}>
        <div style={{flex:1.5}}>
          <p style={{fontSize:'22px',fontWeight:700,color:'#fff',letterSpacing:'-1px',marginBottom:'8px'}}>
            Sweet Raquel <span style={{fontWeight:300,color:'rgba(255,255,255,.35)'}}>/ MODA</span>
          </p>
          <p style={{fontSize:'11px',color:'rgba(255,255,255,.35)',lineHeight:1.6,fontWeight:300,maxWidth:'200px'}}>
            Moda para toda la familia peruana. Calidad, precio y confianza desde Huancayo.
          </p>
        </div>
        {cols.map(col => (
          <div key={col.title} style={{flex:1}}>
            <p style={{fontSize:'10px',fontWeight:600,color:'rgba(255,255,255,.35)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'14px'}}>{col.title}</p>
            <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
              {col.links.map(([label, href]) => (
                <Link key={label} href={href} style={{textDecoration:'none',fontSize:'12px',color:'rgba(255,255,255,.5)',transition:'color .15s'}}
                  onMouseEnter={e=>e.currentTarget.style.color='#fff'}
                  onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.5)'}
                >{label}</Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{borderTop:'1px solid rgba(255,255,255,.08)',paddingTop:'20px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontSize:'10px',color:'rgba(255,255,255,.25)',letterSpacing:'.3px'}}>
          © {new Date().getFullYear()} Sweet Raquel · Todos los derechos reservados · Huancayo, Perú
        </span>
        <div style={{display:'flex',gap:'6px'}}>
          {['Yape','Plin','BCP','Visa'].map(p => (
            <span key={p} style={{background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.12)',padding:'4px 8px',fontSize:'9px',color:'rgba(255,255,255,.4)',letterSpacing:'.5px',textTransform:'uppercase'}}>{p}</span>
          ))}
        </div>
      </div>
    </footer>
  )
}

function WhatsAppFloat() {
  return (
    <div style={{background:'var(--surface)',borderTop:'1px solid var(--border)',padding:'12px 32px',display:'flex',justifyContent:'flex-end'}}>
      <a
        href={`https://wa.me/${WPP_NUMBER}?text=${encodeURIComponent('Hola Sweet Raquel 👋 Quiero información sobre sus productos')}`}
        target="_blank" rel="noopener noreferrer"
        className="btn-primary"
        style={{textDecoration:'none',display:'inline-flex',alignItems:'center',gap:'8px'}}
        aria-label="Contactar por WhatsApp"
      >
        ◉ &nbsp;Contactar por WhatsApp
      </a>
    </div>
  )
}

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Topbar />
      <Navbar />
      <main style={{minHeight:'100vh',background:'#fff'}}>
        <Component {...pageProps} />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
