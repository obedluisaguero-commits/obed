// pages/_app.jsx — Layout global · monky's · Estética premium internacional
import '../styles/globals.css'
import { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'

const WPP_NUMBER = process.env.NEXT_PUBLIC_WPP_NUMBER || '51999999999'
const NAV_LINKS = [['/', 'Inicio'],['/mujer','Mujer'],['/hombre','Hombre'],['/ninos','Niños'],['/otros','Otros'],['/ofertas','Ofertas'],['/contacto','Contacto']]

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

  const wppHref = `https://wa.me/${WPP_NUMBER}?text=${encodeURIComponent("Hola monky's 👋 quiero información sobre sus productos")}`

  return (
    <nav className="navbar">
      <Link href="/" className="nav-logo" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:'10px'}} onClick={() => setMenuOpen(false)}>
        <Image src="/monkys-simbolo.svg" alt="monky&apos;s STORE" width={36} height={36} priority />
        <span style={{display:'flex',flexDirection:'column',lineHeight:1}}>
          <span style={{fontSize:'20px',fontWeight:600,letterSpacing:'-.5px',color:'var(--anthracite)'}}>
            monky<span style={{color:'var(--gold)'}}>&apos;s</span>
          </span>
          <span style={{fontSize:'9px',fontWeight:500,letterSpacing:'4px',color:'var(--mid)',marginTop:'2px'}}>STORE</span>
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
    { title: 'Colecciones', links: [['Mujer','/mujer'],['Hombre','/hombre'],['Niños','/ninos'],['Otros','/otros'],['Ofertas','/ofertas']] },
    { title: 'Información', links: [['Guía de tallas','#'],['Política de cambios','#'],['Preguntas frecuentes','#'],['Sobre nosotros','#']] },
    { title: 'Contacto', links: [['WhatsApp','#'],['Instagram','#'],['Facebook','#'],['Huancayo, Perú','#']] },
  ]
  return (
    <footer style={{background:'var(--anthracite)',padding:'48px 32px 24px'}}>
      <div style={{display:'flex',gap:'48px',marginBottom:'40px'}}>
        <div style={{flex:1.5}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}>
            <Image src="/monkys-simbolo.svg" alt="monky&apos;s STORE" width={40} height={40} />
            <span style={{display:'flex',flexDirection:'column',lineHeight:1}}>
              <span style={{fontSize:'22px',fontWeight:600,letterSpacing:'-.5px',color:'#fff'}}>
                monky<span style={{color:'var(--gold)'}}>&apos;s</span>
              </span>
              <span style={{fontSize:'9px',fontWeight:500,letterSpacing:'4px',color:'var(--emerald-mist)',marginTop:'2px'}}>STORE</span>
            </span>
          </div>
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
          © {new Date().getFullYear()} monky&apos;s · Todos los derechos reservados · Huancayo, Perú
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
        href={`https://wa.me/${WPP_NUMBER}?text=${encodeURIComponent("Hola monky's 👋 Quiero información sobre sus productos")}`}
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
        <link rel="icon" type="image/svg+xml" href="/monkys-simbolo.svg" />
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
