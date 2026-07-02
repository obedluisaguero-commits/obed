// pages/index.jsx — monky's · Estética premium internacional
import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { fetchProducts } from '../lib/sheets'
import { useCart } from '../lib/cart'
import { safeJsonLd } from '../lib/jsonld'

const SEO = {
  title: "monky's | Moda para toda la familia – Huancayo, Perú",
  description: 'Tienda de ropa moderna para mujer, hombre y niños. Vestidos, blusas, polos, casacas y más. Precios competitivos, envíos a todo Perú.',
  canonical: 'https://monkysstore.pe',
}

const CATEGORIES = [
  { num:'01', label:'Mujer',    sub:'Vestidos · Blusas · Lencería · Conjuntos', href:'/mujer',   accent:'var(--emerald)' },
  { num:'02', label:'Hombre',   sub:'Casacas · Polos · Pantalones · Táctica',   href:'/hombre',  accent:'var(--navy)' },
  { num:'03', label:'Niños',    sub:'Vestidos · Conjuntos · Ropa casual',        href:'/ninos',   accent:'var(--dark)' },
  { num:'04', label:'Otros',    sub:'Hogar · Accesorios · Novedades',            href:'/otros',   accent:'var(--gold)' },
]

function normalizarTexto(texto = '') {
  return texto.toString().trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
}

function ProductCard({ product }) {
  const { addItem } = useCart()
  const hasDiscount = product.PrecioOferta && product.PrecioOferta < product.Precio
  const price = hasDiscount ? product.PrecioOferta : product.Precio
  const discount = hasDiscount ? Math.round(((product.Precio - product.PrecioOferta) / product.Precio) * 100) : 0

  return (
    <div style={{background:'#fff',border:'1px solid var(--border)',cursor:'pointer',transition:'background .15s'}}
      onMouseEnter={e=>e.currentTarget.style.background='var(--surface)'}
      onMouseLeave={e=>e.currentTarget.style.background='#fff'}
    >
      {/* Imagen */}
      <div style={{height:'200px',background:'var(--surface)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'52px',position:'relative',overflow:'hidden'}}>
        {product.Imagen1
          ? <Image src={product.Imagen1} alt={product.Nombre} fill style={{objectFit:'contain'}} sizes="(max-width:768px) 50vw, 25vw" />
          : <span>👗</span>
        }
        {hasDiscount && <span className="badge-sale" style={{position:'absolute',top:'12px',left:'12px'}}>−{discount}%</span>}
        {product.Estado === 'nuevo' && !hasDiscount && <span className="badge-new" style={{position:'absolute',top:'12px',left:'12px'}}>Nuevo</span>}
        {product.Stock === 0 && (
          <div style={{position:'absolute',inset:0,background:'rgba(255,255,255,.7)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <span style={{fontSize:'11px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'var(--mid)'}}>Sin stock</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{padding:'16px'}}>
        <p style={{fontSize:'10px',color:'var(--light)',fontWeight:500,letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:'5px'}}>
          {product.Subcategoria}
        </p>
        <h3 style={{fontSize:'13px',fontWeight:500,color:'var(--black)',lineHeight:1.4,marginBottom:'8px'}} className="line-clamp-2">
          {product.Nombre}
        </h3>

        {/* Disponibilidad (sin mostrar la cantidad) */}
        <div style={{display:'flex',alignItems:'center',gap:'4px',marginBottom:'8px'}}>
          <span style={{width:'5px',height:'5px',borderRadius:'50%',background: product.Stock > 0 ? 'var(--emerald)' : '#ccc',flexShrink:0}} />
          <span style={{fontSize:'10px',fontWeight:500,letterSpacing:'.3px',color: product.Stock > 0 ? 'var(--emerald)' : 'var(--light)'}}>
            {product.Stock > 0 ? 'Disponible' : 'Sin stock'}
          </span>
        </div>

        {/* Talla / color */}
        {(product.Talla || product.Color) && (
          <div style={{display:'flex',gap:'6px',marginBottom:'10px',flexWrap:'wrap'}}>
            {product.Talla && <span style={{fontSize:'10px',background:'var(--surface)',color:'var(--dark)',border:'1px solid var(--border)',padding:'2px 8px',letterSpacing:'.5px'}}>T: {product.Talla}</span>}
            {product.Color && <span style={{fontSize:'10px',background:'var(--surface)',color:'var(--mid)',border:'1px solid var(--border)',padding:'2px 8px'}}>{product.Color}</span>}
          </div>
        )}

        {/* Precio */}
        <div style={{display:'flex',alignItems:'baseline',gap:'8px',marginBottom:'12px'}}>
          <span style={{fontSize:'16px',fontWeight:700,color:'var(--black)'}}>S/ {price}</span>
          {hasDiscount && <span style={{fontSize:'12px',color:'var(--light)',textDecoration:'line-through'}}>S/ {product.Precio}</span>}
          {hasDiscount && <span style={{fontSize:'9px',color:'var(--emerald)',fontWeight:700,letterSpacing:'.5px'}}>−{discount}%</span>}
        </div>

        {/* Botón */}
        <div style={{display:'flex',gap:'6px'}}>
          <button
            type="button"
            disabled={product.Stock <= 0}
            onClick={() => addItem(product)}
            style={{
              flex:1, textAlign:'center', padding:'10px',
              fontSize:'10px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase',
              background: product.Stock > 0 ? 'var(--black)' : 'var(--surface)',
              color: product.Stock > 0 ? '#fff' : 'var(--light)',
              border:'none', cursor: product.Stock > 0 ? 'pointer' : 'default',
              transition:'background .15s',
            }}
            onMouseEnter={e=>{ if(product.Stock > 0) e.currentTarget.style.background='var(--emerald)' }}
            onMouseLeave={e=>{ if(product.Stock > 0) e.currentTarget.style.background='var(--black)' }}
          >
            {product.Stock > 0 ? 'Agregar' : 'Sin stock'}
          </button>
          <Link href={`/producto/${product.ID}`}
            style={{textDecoration:'none',background:'var(--surface)',color:'var(--mid)',border:'1px solid var(--border)',padding:'10px 12px',fontSize:'11px',display:'flex',alignItems:'center'}}
          >→</Link>
        </div>
      </div>
    </div>
  )
}

export default function Home({ featuredProducts = [], offersCount = 0, maxDiscount = 0, offerCategories = [] }) {
  const [filter, setFilter] = useState('todos')

  const filtered = filter === 'todos'
    ? featuredProducts
    : featuredProducts.filter(p => normalizarTexto(p.Categoria) === normalizarTexto(filter))

  const FILTERS = [['todos','Todos'],['mujer','Mujer'],['hombre','Hombre'],['ninos','Niños'],['otros','Otros']]

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
          '@context':'https://schema.org','@type':'ClothingStore',
          name:"monky's", url: SEO.canonical,
          address:{'@type':'PostalAddress',addressLocality:'Huancayo',addressRegion:'Junín',addressCountry:'PE'},
          openingHours:'Mo-Sa 09:00-20:00'
        })}} />
      </Head>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="hero section-pad" style={{background:'var(--anthracite)',color:'#fff',padding:'72px 32px',display:'flex',alignItems:'center',gap:'48px',position:'relative',overflow:'hidden'}}>
        <div style={{flex:1,zIndex:1,maxWidth:'480px'}}>
          <div style={{fontSize:'10px',fontWeight:600,letterSpacing:'3px',textTransform:'uppercase',color:'var(--emerald-mist)',marginBottom:'20px',display:'flex',alignItems:'center',gap:'10px'}}>
            <span style={{width:'24px',height:'1px',background:'var(--emerald-mist)',display:'inline-block'}} />
            Nueva temporada {new Date().getFullYear()}
          </div>
          <h1 style={{fontSize:'52px',fontWeight:700,lineHeight:1.08,letterSpacing:'-2px',color:'#fff',marginBottom:'20px'}}>
            Moda para<br/><em style={{fontStyle:'normal',color:'var(--emerald-mist)'}}>toda tu familia</em>
          </h1>
          <p style={{fontSize:'14px',color:'rgba(255,255,255,.5)',lineHeight:1.7,marginBottom:'32px',fontWeight:300}}>
            Ropa moderna, cómoda y a precios competitivos. Calidad peruana, estilo internacional.
          </p>
          <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
            <Link href="/mujer" className="btn-primary" style={{textDecoration:'none',display:'inline-block'}}>Ver colección</Link>
            <Link href="/ofertas" style={{textDecoration:'none',background:'transparent',color:'#fff',border:'1px solid rgba(255,255,255,.25)',padding:'13px 28px',fontSize:'11px',fontWeight:500,letterSpacing:'1px',textTransform:'uppercase'}}>
              Ver ofertas
            </Link>
          </div>
        </div>

      </section>

      {/* ── BARRA DE BENEFICIOS ───────────────────────────────────────────── */}
      <div className="grid-benefits">
        {[['↗','Envíos a todo Perú','Todas las regiones'],['◈','Pagos seguros','Yape · Plin · Transferencia'],['↺','Cambios en 7 días','Sin costo adicional'],['◉','Stock en tiempo real','Disponibilidad actualizada']].map(([icon,t,s])=>(
          <div key={t} style={{padding:'18px 16px',textAlign:'center',borderRight:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',gap:'10px'}}>
            <span style={{color:'var(--emerald)',fontSize:'18px',flexShrink:0}}>{icon}</span>
            <div>
              <p style={{fontSize:'11px',color:'var(--dark)',fontWeight:600,letterSpacing:'.2px'}}>{t}</p>
              <p style={{fontSize:'10px',color:'var(--light)',marginTop:'1px'}}>{s}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── CATEGORÍAS ───────────────────────────────────────────────────── */}
      <section style={{padding:'64px 32px 0'}}>
        <div style={{marginBottom:'40px'}}>
          <p style={{fontSize:'10px',fontWeight:600,letterSpacing:'3px',textTransform:'uppercase',color:'var(--emerald)',marginBottom:'10px'}}>Colecciones</p>
          <h2 style={{fontSize:'32px',fontWeight:700,letterSpacing:'-1px',color:'var(--black)'}}>Explora por categoría</h2>
          <p style={{fontSize:'13px',color:'var(--mid)',marginTop:'6px',fontWeight:300}}>Todo lo que tu familia necesita en un solo lugar</p>
        </div>
        <div className="grid-cats">
          {CATEGORIES.map(cat => (
            <Link key={cat.href} href={cat.href} style={{textDecoration:'none',background:'#fff',padding:'36px 28px',cursor:'pointer',position:'relative',transition:'background .15s',display:'block'}}
              onMouseEnter={e=>e.currentTarget.style.background='var(--surface)'}
              onMouseLeave={e=>e.currentTarget.style.background='#fff'}
            >
              <p style={{fontSize:'11px',color:'var(--light)',fontWeight:500,letterSpacing:'2px',marginBottom:'12px'}}>{cat.num}</p>
              <div style={{width:'32px',height:'2px',background:cat.accent,marginBottom:'14px'}} />
              <p style={{fontSize:'20px',fontWeight:700,color:'var(--black)',letterSpacing:'-0.5px',marginBottom:'4px'}}>{cat.label}</p>
              <p style={{fontSize:'11px',color:'var(--mid)',letterSpacing:'.2px'}}>{cat.sub}</p>
              <span style={{position:'absolute',right:'24px',top:'50%',transform:'translateY(-50%)',color:'var(--light)',fontSize:'18px'}}>→</span>
            </Link>
          ))}
          {/* Bloque Ofertas (solo si hay ofertas reales) */}
          {offersCount > 0 && (
            <Link href="/ofertas" className="cats-ofertas" style={{textDecoration:'none',background:'var(--black)',padding:'36px 28px',cursor:'pointer',position:'relative',display:'block',transition:'background .15s'}}
              onMouseEnter={e=>e.currentTarget.style.background='#1a1a1a'}
              onMouseLeave={e=>e.currentTarget.style.background='var(--black)'}
            >
              <p style={{fontSize:'11px',color:'rgba(255,255,255,.3)',fontWeight:500,letterSpacing:'2px',marginBottom:'12px'}}>05</p>
              <div style={{width:'32px',height:'2px',background:'var(--emerald-mist)',marginBottom:'14px'}} />
              <p style={{fontSize:'24px',fontWeight:700,color:'#fff',letterSpacing:'-1px',marginBottom:'4px'}}>Ofertas especiales</p>
              <p style={{fontSize:'12px',color:'rgba(255,255,255,.4)'}}>
                {maxDiscount > 0 ? `Hasta ${maxDiscount}% de descuento · ` : ''}{offersCount} {offersCount === 1 ? 'producto en oferta' : 'productos en oferta'}
              </p>
              <span style={{position:'absolute',right:'32px',top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,.3)',fontSize:'24px'}}>→</span>
            </Link>
          )}
        </div>
      </section>

      {/* ── PRODUCTOS DESTACADOS ──────────────────────────────────────────── */}
      <section style={{padding:'64px 32px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'32px',flexWrap:'wrap',gap:'16px'}}>
          <div>
            <p style={{fontSize:'10px',fontWeight:600,letterSpacing:'3px',textTransform:'uppercase',color:'var(--emerald)',marginBottom:'10px'}}>Más vendidos</p>
            <h2 style={{fontSize:'32px',fontWeight:700,letterSpacing:'-1px',color:'var(--black)'}}>Productos destacados</h2>
          </div>
          {/* Filtros */}
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
            {FILTERS.map(([val,label]) => (
              <button key={val} onClick={() => setFilter(val)}
                style={{
                  background: filter === val ? 'var(--black)' : 'transparent',
                  color: filter === val ? '#fff' : 'var(--mid)',
                  border: filter === val ? '1px solid var(--black)' : '1px solid var(--border)',
                  padding:'7px 16px', fontSize:'11px', fontWeight:600, letterSpacing:'1px',
                  textTransform:'uppercase', cursor:'pointer', transition:'all .15s',
                }}
              >{label}</button>
            ))}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="product-grid">
            {filtered.slice(0,8).map(p => <ProductCard key={p.ID} product={p} />)}
          </div>
        ) : (
          <div style={{textAlign:'center',padding:'64px',color:'var(--light)'}}>
            <p style={{fontSize:'32px',marginBottom:'12px'}}>◎</p>
            <p style={{fontSize:'13px',letterSpacing:'.5px'}}>No hay productos en esta categoría por el momento</p>
          </div>
        )}

        <div style={{textAlign:'center',marginTop:'40px'}}>
          <Link href="/productos" className="btn-outline" style={{textDecoration:'none',display:'inline-block'}}>
            Ver todos los productos →
          </Link>
        </div>
      </section>

      {/* ── BANNER PROMO (solo si hay ofertas reales) ────────────────────── */}
      {offersCount > 0 && (
        <section style={{background:'var(--black)',padding:'72px 32px',textAlign:'center'}}>
          <p style={{fontSize:'10px',fontWeight:600,letterSpacing:'3px',textTransform:'uppercase',color:'var(--emerald-mist)',marginBottom:'16px'}}>Ofertas</p>
          <h2 style={{fontSize:'44px',fontWeight:700,color:'#fff',letterSpacing:'-1.5px',marginBottom:'8px'}}>
            {maxDiscount > 0
              ? <>Hasta <em style={{fontStyle:'normal',color:'var(--emerald-mist)'}}>{maxDiscount}% OFF</em></>
              : <>Ofertas <em style={{fontStyle:'normal',color:'var(--emerald-mist)'}}>especiales</em></>}
          </h2>
          <p style={{fontSize:'13px',color:'rgba(255,255,255,.35)',marginBottom:'28px',fontWeight:300}}>
            {offersCount} {offersCount === 1 ? 'producto con descuento' : 'productos con descuento'}
          </p>
          {offerCategories.length > 0 && (
            <div style={{display:'flex',gap:'8px',justifyContent:'center',flexWrap:'wrap',marginBottom:'32px'}}>
              {offerCategories.map(c => (
                <span key={c} style={{border:'1px solid rgba(255,255,255,.15)',color:'rgba(255,255,255,.6)',padding:'7px 18px',fontSize:'11px',letterSpacing:'.5px',textTransform:'uppercase'}}>Ofertas en {c}</span>
              ))}
            </div>
          )}
          <Link href="/ofertas" className="btn-primary" style={{textDecoration:'none',display:'inline-block',padding:'14px 40px',letterSpacing:'2px'}}>
            Ver todas las ofertas
          </Link>
        </section>
      )}

      {/* ── MÉTRICAS ─────────────────────────────────────────────────────── */}
      <div className="grid-stats">
        {[['99%','Satisfacción','Clientes que vuelven a comprar'],['24h','Respuesta','Atención WhatsApp todos los días'],['7d','Cambios','Sin costo por talla incorrecta'],['PE','Todo el Perú','Envíos a todas las regiones']].map(([n,t,d])=>(
          <div key={t} style={{background:'var(--surface)',padding:'32px 24px',textAlign:'center'}}>
            <p style={{fontSize:'30px',fontWeight:700,color:'var(--emerald)',letterSpacing:'-1px',marginBottom:'6px'}}>{n}</p>
            <p style={{fontSize:'11px',fontWeight:700,color:'var(--black)',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:'4px'}}>{t}</p>
            <p style={{fontSize:'11px',color:'var(--mid)',lineHeight:1.5}}>{d}</p>
          </div>
        ))}
      </div>

      {/* ── TESTIMONIOS ──────────────────────────────────────────────────── */}
      <section style={{padding:'64px 32px',background:'#fff'}}>
        <div style={{marginBottom:'40px'}}>
          <p style={{fontSize:'10px',fontWeight:600,letterSpacing:'3px',textTransform:'uppercase',color:'var(--emerald)',marginBottom:'10px'}}>Testimonios</p>
          <h2 style={{fontSize:'32px',fontWeight:700,letterSpacing:'-1px',color:'var(--black)'}}>Lo que dicen nuestras clientas</h2>
        </div>
        <div className="grid-3">
          {[
            {q:'"Compré un vestido para mi hija y llegó perfecto. La calidad es increíble para el precio. Ya pedí tres cosas más."',n:'María P.',l:'Huancayo, Junín'},
            {q:'"Los polos de mi esposo quedaron perfectos. El trato por WhatsApp fue muy amable y el delivery súper rápido."',n:'Lucía R.',l:'Lima, Lima'},
            {q:'"Encontré ropa para toda la familia en un solo lugar y a muy buenos precios. Totalmente recomendado."',n:'Carmen R.',l:'Arequipa, Arequipa'},
          ].map(t => (
            <div key={t.n} style={{border:'1px solid var(--border)',padding:'24px'}}>
              <div style={{display:'flex',gap:'3px',marginBottom:'16px'}}>
                {[0,1,2,3,4].map(i => <span key={i} style={{width:'10px',height:'10px',background:'var(--black)',display:'inline-block'}} />)}
              </div>
              <p style={{fontSize:'13px',color:'var(--dark)',lineHeight:1.7,marginBottom:'18px',fontWeight:300}}>{t.q}</p>
              <div style={{width:'24px',height:'1px',background:'var(--emerald)',marginBottom:'12px'}} />
              <p style={{fontSize:'12px',fontWeight:700,color:'var(--black)',letterSpacing:'.3px',textTransform:'uppercase'}}>{t.n}</p>
              <p style={{fontSize:'11px',color:'var(--light)',marginTop:'2px'}}>{t.l}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export async function getStaticProps() {
  try {
    const products = await fetchProducts()
    const visibles = products.filter(p => p.Estado === 'activo' || p.Estado === 'nuevo')

    const featured = visibles
      .filter(p => p.Stock > 0)
      .sort((a, b) => (b.PrecioOferta ? 1 : 0) - (a.PrecioOferta ? 1 : 0))
      .slice(0, 12)

    // Ofertas reales: productos visibles con precio de oferta válido
    const offers = visibles.filter(p => p.PrecioOferta && p.PrecioOferta < p.Precio)
    const maxDiscount = offers.reduce((max, p) => {
      const d = Math.round(((p.Precio - p.PrecioOferta) / p.Precio) * 100)
      return d > max ? d : max
    }, 0)
    const offerCategories = [...new Set(offers.map(p => p.Categoria).filter(Boolean))].slice(0, 4)

    return {
      props: { featuredProducts: featured, offersCount: offers.length, maxDiscount, offerCategories },
      revalidate: 60,
    }
  } catch (err) {
    console.error('Error fetching products:', err)
    return { props: { featuredProducts: [], offersCount: 0, maxDiscount: 0, offerCategories: [] }, revalidate: 30 }
  }
}
