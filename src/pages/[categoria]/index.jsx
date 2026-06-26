// pages/[categoria]/index.jsx — monky's · Estética premium
import { useState, useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { fetchProductsByCategory } from '../../lib/sheets'
import { useCart } from '../../lib/cart'

const CATEGORY_META = {
  mujer:  { label:'Mujer',  subcats:['Vestidos','Lenceria','Ropa de dormir','Blusas','Conjuntos'], accent:'var(--emerald)' },
  hombre: { label:'Hombre', subcats:['Casacas','Polos','Pantalones','Ropa tactica'],               accent:'var(--navy)' },
  ninos:  { label:'Niños',  subcats:['Vestidos','Conjuntos','Ropa casual'],                        accent:'var(--dark)' },
  otros:  { label:'Otros',  subcats:[],                                                            accent:'var(--gold)' },
}

function normalizar(t=''){return t.toString().trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}

export default function CategoryPage({ categoria, products }) {
  const { addItem } = useCart()
  const meta = CATEGORY_META[categoria]
  const [activeSub, setActiveSub]   = useState('todas')
  const [activeSize, setActiveSize] = useState('todas')
  const [sort, setSort]             = useState('relevancia')

  const sizes = useMemo(() => [...new Set(products.map(p => p.Talla).filter(Boolean))], [products])

  // Subcategorías dinámicas: las curadas de CATEGORY_META + cualquier
  // subcategoría nueva que venga de los productos de la hoja, así aparecen
  // como pestañas sin tener que tocar el código.
  const subcats = useMemo(() => {
    const curated = meta?.subcats || []
    const enData = [...new Set(products.map(p => p.Subcategoria).filter(Boolean))]
    const extras = enData.filter(s => !curated.some(c => normalizar(c) === normalizar(s)))
    return [...curated, ...extras]
  }, [meta, products])

  const filtered = useMemo(() => {
    let list = [...products]
    if (activeSub  !== 'todas') list = list.filter(p => normalizar(p.Subcategoria) === normalizar(activeSub))
    if (activeSize !== 'todas') list = list.filter(p => p.Talla === activeSize)
    if (sort === 'precio-asc')  list.sort((a,b) => (a.PrecioOferta||a.Precio)-(b.PrecioOferta||b.Precio))
    if (sort === 'precio-desc') list.sort((a,b) => (b.PrecioOferta||b.Precio)-(a.PrecioOferta||a.Precio))
    if (sort === 'nuevo')       list = list.filter(p=>p.Estado==='nuevo').concat(list.filter(p=>p.Estado!=='nuevo'))
    return list
  }, [products, activeSub, activeSize, sort])

  const activeBtn  = { background:'var(--black)', color:'#fff', border:'1px solid var(--black)' }
  const inactiveBtn= { background:'transparent',  color:'var(--mid)', border:'1px solid var(--border)' }

  return (
    <>
      <Head>
        <title>{`${meta.label} | monky's`}</title>
        <meta name="description" content={`Ropa de ${meta.label.toLowerCase()} en monky's: ${meta.subcats.join(', ')}. Envíos a todo Perú.`} />
        <link rel="canonical" href={`https://monkysstore.pe/${categoria}`} />
      </Head>

      {/* Header de categoría */}
      <div style={{borderBottom:'1px solid var(--border)',padding:'40px 32px 32px'}}>
        <nav style={{fontSize:'11px',color:'var(--light)',display:'flex',gap:'8px',alignItems:'center',marginBottom:'16px',letterSpacing:'.3px'}}>
          <Link href="/" style={{color:'var(--mid)',textDecoration:'none'}}>Inicio</Link>
          <span>·</span>
          <span style={{color:'var(--black)'}}>{meta.label}</span>
        </nav>
        <div style={{display:'flex',alignItems:'baseline',gap:'16px',flexWrap:'wrap'}}>
          <h1 style={{fontSize:'40px',fontWeight:700,letterSpacing:'-1.5px',color:'var(--black)'}}>{meta.label}</h1>
          <span style={{fontSize:'13px',color:'var(--light)',letterSpacing:'.3px'}}>{filtered.length} productos</span>
        </div>
        <div style={{width:'40px',height:'2px',background:meta.accent,marginTop:'14px'}} />
      </div>

      <div className="category-layout">
        {/* Sidebar filtros */}
        <aside className="category-sidebar">
          <div style={{marginBottom:'28px'}}>
            <p style={{fontSize:'10px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'var(--mid)',marginBottom:'12px'}}>Subcategoría</p>
            <div style={{display:'flex',flexDirection:'column',gap:'2px'}}>
              {['todas',...subcats].map(s => (
                <button key={s} onClick={()=>setActiveSub(s)} style={{
                  textAlign:'left', padding:'8px 10px', fontSize:'12px', cursor:'pointer', border:'none',
                  background: activeSub===s ? 'var(--surface)' : 'transparent',
                  color: activeSub===s ? 'var(--black)' : 'var(--mid)',
                  fontWeight: activeSub===s ? 600 : 400,
                  letterSpacing:'.2px', transition:'all .1s'
                }}>{s === 'todas' ? 'Todas' : s}</button>
              ))}
            </div>
          </div>

          {sizes.length > 0 && (
            <div style={{marginBottom:'28px'}}>
              <p style={{fontSize:'10px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'var(--mid)',marginBottom:'12px'}}>Talla</p>
              <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                {['todas',...sizes].map(sz => (
                  <button key={sz} onClick={()=>setActiveSize(sz)} style={{
                    ...( activeSize===sz ? activeBtn : inactiveBtn ),
                    padding:'5px 10px', fontSize:'10px', fontWeight:600,
                    letterSpacing:'.5px', textTransform:'uppercase', cursor:'pointer', transition:'all .1s'
                  }}>{sz==='todas'?'All':sz}</button>
                ))}
              </div>
            </div>
          )}

          <div>
            <p style={{fontSize:'10px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'var(--mid)',marginBottom:'12px'}}>Ordenar</p>
            <select value={sort} onChange={e=>setSort(e.target.value)} style={{width:'100%',fontSize:'11px',border:'1px solid var(--border)',padding:'8px 10px',color:'var(--dark)',background:'#fff',appearance:'none',cursor:'pointer'}}>
              <option value="relevancia">Relevancia</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="nuevo">Más nuevos primero</option>
            </select>
          </div>
        </aside>

        {/* Grid de productos */}
        <main style={{flex:1,padding:'32px'}}>
          {filtered.length > 0 ? (
            <div className="category-grid">
              {filtered.map(p => {
                const hasDiscount = p.PrecioOferta && p.PrecioOferta < p.Precio
                const price = hasDiscount ? p.PrecioOferta : p.Precio
                const discount = hasDiscount ? Math.round(((p.Precio-p.PrecioOferta)/p.Precio)*100) : 0
                return (
                  <div key={p.ID} style={{background:'#fff',transition:'background .15s'}}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--surface)'}
                    onMouseLeave={e=>e.currentTarget.style.background='#fff'}
                  >
                    <Link href={`/producto/${p.ID}`} style={{textDecoration:'none',display:'block'}}>
                      <div style={{height:'180px',background:'var(--surface)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'40px',position:'relative',overflow:'hidden',cursor:'pointer'}}>
                        {p.Imagen1 ? <Image src={p.Imagen1} alt={p.Nombre} fill style={{objectFit:'cover'}} sizes="200px" /> : <span>👗</span>}
                        {hasDiscount && <span className="badge-sale" style={{position:'absolute',top:'10px',left:'10px'}}>−{discount}%</span>}
                        {p.Estado==='nuevo' && !hasDiscount && <span className="badge-new" style={{position:'absolute',top:'10px',left:'10px'}}>Nuevo</span>}
                      </div>
                    </Link>
                    <div style={{padding:'14px'}}>
                      <p style={{fontSize:'10px',color:'var(--light)',fontWeight:500,letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:'4px'}}>{p.Subcategoria}</p>
                      <Link href={`/producto/${p.ID}`} style={{textDecoration:'none'}}>
                        <p style={{fontSize:'13px',fontWeight:500,color:'var(--black)',lineHeight:1.4,marginBottom:'8px',cursor:'pointer'}} className="line-clamp-2">{p.Nombre}</p>
                      </Link>
                      <div style={{display:'flex',alignItems:'baseline',gap:'8px',marginBottom:'10px'}}>
                        <span style={{fontSize:'15px',fontWeight:700,color:'var(--black)'}}>S/ {price}</span>
                        {hasDiscount && <span style={{fontSize:'11px',color:'var(--light)',textDecoration:'line-through'}}>S/ {p.Precio}</span>}
                      </div>
                      <div style={{display:'flex',gap:'6px'}}>
                        <button type="button" onClick={() => addItem(p)}
                          style={{flex:1,textAlign:'center',padding:'9px',fontSize:'10px',fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',background:'var(--black)',color:'#fff',border:'none',cursor:'pointer',transition:'background .15s'}}
                          onMouseEnter={e=>e.currentTarget.style.background='var(--emerald)'}
                          onMouseLeave={e=>e.currentTarget.style.background='var(--black)'}
                        >Agregar</button>
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
              <p style={{fontSize:'32px',marginBottom:'12px'}}>◎</p>
              <p style={{fontSize:'13px',letterSpacing:'.5px'}}>No hay productos con estos filtros</p>
            </div>
          )}
        </main>
      </div>
    </>
  )
}

export async function getStaticPaths() {
  return { paths:[{params:{categoria:'mujer'}},{params:{categoria:'hombre'}},{params:{categoria:'ninos'}},{params:{categoria:'otros'}}], fallback:false }
}

export async function getStaticProps({ params }) {
  try {
    const products = await fetchProductsByCategory(params.categoria)
    return { props: { categoria: params.categoria, products }, revalidate: 60 }
  } catch (err) {
    console.error('Error fetching category products:', err)
    return { props: { categoria: params.categoria, products: [] }, revalidate: 30 }
  }
}
