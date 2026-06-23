// pages/ofertas.jsx — Sweet Raquel · Premium
import { useState, useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { fetchOffers } from '../lib/sheets'

const WPP_NUMBER = process.env.NEXT_PUBLIC_WPP_NUMBER || '51999999999'

export default function OfertasPage({ offers }) {
  const [cat, setCat] = useState('todas')
  const categories = useMemo(() => [...new Set(offers.map(p => p.Categoria))], [offers])
  const filtered = cat === 'todas' ? offers : offers.filter(p => p.Categoria === cat)

  return (
    <>
      <Head>
        <title>Ofertas | Sweet Raquel</title>
        <meta name="description" content="Hasta 50% de descuento en ropa para mujer, hombre y niños. Ofertas por tiempo limitado en Sweet Raquel." />
        <link rel="canonical" href="https://sweetraquel.pe/ofertas" />
      </Head>

      <div style={{background:'var(--black)',padding:'48px 32px',textAlign:'center'}}>
        <p style={{fontSize:'10px',fontWeight:600,letterSpacing:'3px',textTransform:'uppercase',color:'var(--emerald-mist)',marginBottom:'14px'}}>Tiempo limitado</p>
        <h1 style={{fontSize:'44px',fontWeight:700,letterSpacing:'-1.5px',color:'#fff',marginBottom:'8px'}}>Ofertas especiales</h1>
        <p style={{fontSize:'13px',color:'rgba(255,255,255,.4)',fontWeight:300}}>{filtered.length} productos con descuento</p>
      </div>

      <div style={{padding:'32px'}}>
        <div style={{display:'flex',gap:'8px',marginBottom:'32px',flexWrap:'wrap'}}>
          {['todas',...categories].map(c => (
            <button key={c} onClick={()=>setCat(c)} style={{
              background: cat===c ? 'var(--black)' : 'transparent',
              color: cat===c ? '#fff' : 'var(--mid)',
              border: cat===c ? '1px solid var(--black)' : '1px solid var(--border)',
              padding:'7px 18px', fontSize:'11px', fontWeight:600,
              letterSpacing:'1px', textTransform:'uppercase', cursor:'pointer',
            }}>{c==='todas'?'Todas':c}</button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1px',background:'var(--border)'}}>
            {filtered.map(p => {
              const discount = Math.round(((p.Precio-p.PrecioOferta)/p.Precio)*100)
              const wppMsg = encodeURIComponent(`Hola Sweet Raquel 👋 Me interesa esta oferta:\n\n*${p.Nombre}*\nPrecio oferta: S/ ${p.PrecioOferta}`)
              return (
                <div key={p.ID} style={{background:'#fff',transition:'background .15s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--surface)'}
                  onMouseLeave={e=>e.currentTarget.style.background='#fff'}
                >
                  <Link href={`/producto/${p.ID}`} style={{textDecoration:'none',display:'block'}}>
                    <div style={{height:'200px',background:'var(--surface)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'40px',position:'relative',overflow:'hidden',cursor:'pointer'}}>
                      {p.Imagen1 ? <Image src={p.Imagen1} alt={p.Nombre} fill style={{objectFit:'cover'}} sizes="25vw" /> : <span>👗</span>}
                      <span className="badge-sale" style={{position:'absolute',top:'12px',left:'12px'}}>−{discount}%</span>
                    </div>
                  </Link>
                  <div style={{padding:'14px'}}>
                    <p style={{fontSize:'10px',color:'var(--light)',fontWeight:500,letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:'4px'}}>{p.Categoria}</p>
                    <Link href={`/producto/${p.ID}`} style={{textDecoration:'none'}}>
                      <p style={{fontSize:'13px',fontWeight:500,color:'var(--black)',marginBottom:'8px',cursor:'pointer'}} className="line-clamp-2">{p.Nombre}</p>
                    </Link>
                    <div style={{display:'flex',alignItems:'baseline',gap:'8px',marginBottom:'10px'}}>
                      <span style={{fontSize:'15px',fontWeight:700,color:'var(--black)'}}>S/ {p.PrecioOferta}</span>
                      <span style={{fontSize:'11px',color:'var(--light)',textDecoration:'line-through'}}>S/ {p.Precio}</span>
                    </div>
                    <div style={{display:'flex',gap:'6px'}}>
                      <a href={`https://wa.me/${WPP_NUMBER}?text=${wppMsg}`} target="_blank" rel="noopener noreferrer"
                        style={{flex:1,textAlign:'center',textDecoration:'none',padding:'9px',fontSize:'10px',fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',background:'var(--black)',color:'#fff',transition:'background .15s'}}
                        onMouseEnter={e=>e.currentTarget.style.background='var(--emerald)'}
                        onMouseLeave={e=>e.currentTarget.style.background='var(--black)'}
                      >Aprovechar oferta</a>
                      <Link href={`/producto/${p.ID}`}
                        style={{textDecoration:'none',background:'var(--surface)',color:'var(--mid)',border:'1px solid var(--border)',padding:'9px 12px',fontSize:'11px',display:'flex',alignItems:'center'}}
                        aria-label={`Ver detalle de ${p.Nombre}`}
                      >→</Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{textAlign:'center',padding:'80px',color:'var(--light)'}}>
            <p style={{fontSize:'13px',letterSpacing:'.5px'}}>No hay ofertas activas en esta categoría</p>
            <Link href="/" style={{color:'var(--emerald)',textDecoration:'none',fontSize:'12px',marginTop:'12px',display:'inline-block'}}>← Volver al inicio</Link>
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
