// pages/sitemap.xml.js — Genera sitemap.xml dinámico en cada build/ISR
import { fetchProducts } from '../lib/sheets'

const BASE_URL = 'https://sweetraquel.pe'

function generateSiteMap(products) {
  const staticPages = ['', '/mujer', '/hombre', '/ninos', '/ofertas', '/contacto']
  const staticXml = staticPages
    .map(
      (path) => `
  <url>
    <loc>${BASE_URL}${path}</loc>
    <changefreq>daily</changefreq>
    <priority>${path === '' ? '1.0' : '0.8'}</priority>
  </url>`
    )
    .join('')

  const productXml = products
    .map(
      (p) => `
  <url>
    <loc>${BASE_URL}/producto/${p.ID}</loc>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>`
    )
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticXml}${productXml}
</urlset>`
}

export default function SiteMap() {
  // Este componente nunca se renderiza; getServerSideProps maneja la respuesta.
  return null
}

export async function getServerSideProps({ res }) {
  let products = []
  try {
    products = await fetchProducts()
  } catch (err) {
    console.error('Error fetching products for sitemap:', err)
    // Si Sheets falla, devolvemos al menos el sitemap con las páginas estáticas.
  }
  const sitemap = generateSiteMap(products)

  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.write(sitemap)
  res.end()

  return { props: {} }
}
