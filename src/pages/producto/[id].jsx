// pages/producto/[id].jsx — Ficha de producto individual
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { fetchProducts, fetchProductById, fetchRelatedProducts } from '../../lib/sheets'
import { useCart } from '../../lib/cart'
import { safeJsonLd } from '../../lib/jsonld'

const WPP_NUMBER = process.env.NEXT_PUBLIC_WPP_NUMBER || '51999999999'

// Normaliza la categoría a un slug sin tildes para enlazar a la ruta correcta
// ("Niños" → "ninos"), evitando depender de una redirección 301.
function slugCategoria(t = '') {
  return t.toString().trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export default function ProductPage({ product, related }) {
  const { addItem } = useCart()
  const [activeImg, setActiveImg] = useState(0)
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

  const wppMsg = encodeURIComponent(
    `Hola monky's 👋 Quiero comprar:\n\n*${product.Nombre}*\nCódigo: ${product.Codigo}\nTalla: ${product.Talla}\nColor: ${product.Color}\nPrecio: S/ ${price}\n\n¿Me confirman disponibilidad?`
  )

  return (
    <>
      <Head>
        <title>{`${product.Nombre} | monky's`}</title>
        <meta name="description" content={product.Descripcion?.slice(0, 155) || product.Nombre} />
        <link rel="canonical" href={`https://monkysstore.pe/producto/${product.ID}`} />
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
                url: `https://monkysstore.pe/producto/${product.ID}`,
              },
            }),
          }}
        />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <nav className="text-xs text-gray-400 font-poppins mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#173A32]">Inicio</Link>
          <span>/</span>
          <Link href={`/${slugCategoria(product.Categoria)}`} className="hover:text-[#173A32] capitalize">
            {product.Categoria}
          </Link>
          <span>/</span>
          <span className="text-slate-700">{product.Nombre}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Galería */}
          <div>
            <div className="relative h-96 bg-gradient-to-br from-[#F5F2EA] to-[#E9DFC9] rounded-2xl overflow-hidden mb-3">
              {images.length > 0 ? (
                <Image src={images[activeImg]} alt={product.Nombre} fill className="object-contain" sizes="(max-width:768px) 100vw, 50vw" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">👗</div>
              )}
              {hasDiscount && (
                <span className="absolute top-3 left-3 bg-[#173A32] text-white text-xs font-bold font-poppins px-3 py-1 rounded-full">
                  -{discount}% OFF
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 ${
                      activeImg === i ? 'border-[#C99A3C]' : 'border-transparent'
                    }`}
                  >
                    <Image src={img} alt={`${product.Nombre} ${i + 1}`} fill className="object-contain" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-xs text-[#173A32] font-poppins uppercase tracking-wide font-medium mb-2">
              {product.Categoria} · {product.Subcategoria} {product.Marca && `· ${product.Marca}`}
            </p>
            <h1 className="font-playfair text-3xl font-bold text-slate-900 mb-3">{product.Nombre}</h1>

            <div className="flex items-center gap-1.5 mb-4">
              <span className={`w-2 h-2 rounded-full ${liveStock > 5 ? 'bg-green-500' : liveStock > 0 ? 'bg-amber-400' : 'bg-red-400'}`} />
              <span className={`text-sm font-poppins ${liveStock > 5 ? 'text-green-600' : liveStock > 0 ? 'text-amber-500' : 'text-red-500'}`}>
                {liveStock > 5 ? `${liveStock} disponibles` : liveStock > 0 ? `¡Solo ${liveStock} unidades!` : 'Sin stock por el momento'}
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-[#C99A3C] font-poppins">S/ {price}</span>
              {hasDiscount && <span className="text-lg text-gray-400 line-through font-poppins">S/ {product.Precio}</span>}
            </div>

            {product.Descripcion && (
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.Descripcion}</p>
            )}

            <div className="flex gap-3 mb-6 flex-wrap">
              {product.Talla && (
                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2">
                  <p className="text-[10px] text-gray-400 font-poppins uppercase">Talla</p>
                  <p className="text-sm font-medium text-slate-700 font-poppins">{product.Talla}</p>
                </div>
              )}
              {product.Color && (
                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2">
                  <p className="text-[10px] text-gray-400 font-poppins uppercase">Color</p>
                  <p className="text-sm font-medium text-slate-700 font-poppins">{product.Color}</p>
                </div>
              )}
              <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2">
                <p className="text-[10px] text-gray-400 font-poppins uppercase">Código</p>
                <p className="text-sm font-medium text-slate-700 font-poppins">{product.Codigo}</p>
              </div>
            </div>

            {liveStock > 0 ? (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => addItem({ ...product, Stock: liveStock })}
                  className="block w-full text-center font-poppins font-semibold py-3.5 rounded-full transition-colors bg-[#173A32] text-white hover:bg-[#0F2A24]"
                >
                  🛒 Agregar al carrito
                </button>
                <a
                  href={`https://wa.me/${WPP_NUMBER}?text=${wppMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center font-poppins font-semibold py-3 rounded-full transition-colors border border-[#173A32] text-[#173A32] hover:bg-[#E9F0EC]"
                >
                  💬 Comprar ahora por WhatsApp
                </a>
              </div>
            ) : (
              <div className="block text-center font-poppins font-semibold py-3.5 rounded-full bg-gray-100 text-gray-400">
                Sin stock disponible
              </div>
            )}

            <div className="flex gap-4 mt-5 text-xs text-gray-400 font-poppins">
              <span>🚚 Envíos a todo Perú</span>
              <span>🔄 Cambios en 7 días</span>
            </div>
          </div>
        </div>

        {/* Relacionados */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-playfair text-2xl font-bold text-slate-900 mb-6">También te puede interesar</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((p) => {
                const rHasDiscount = p.PrecioOferta && p.PrecioOferta < p.Precio
                const rPrice = rHasDiscount ? p.PrecioOferta : p.Precio
                return (
                  <Link
                    key={p.ID}
                    href={`/producto/${p.ID}`}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#9FB5AC] hover:shadow-lg transition-all"
                  >
                    <div className="relative h-40 bg-gradient-to-br from-[#F5F2EA] to-[#E9DFC9]">
                      {p.Imagen1 ? (
                        <Image src={p.Imagen1} alt={p.Nombre} fill className="object-cover" sizes="200px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">👗</div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-slate-700 font-medium line-clamp-1 mb-1">{p.Nombre}</p>
                      <p className="text-sm font-bold text-[#C99A3C] font-poppins">S/ {rPrice}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
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
    return { paths: [], fallback: 'blocking' } // todo se genera bajo demanda si Sheets falla en build
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
