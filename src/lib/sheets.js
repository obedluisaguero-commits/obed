// lib/sheets.js — Capa de acceso a datos (Google Sheets como base de datos)
// Lee la hoja "Productos" vía Google Sheets API v4 (API Key, modo lectura pública)
// y normaliza las filas al modelo de producto usado en toda la app.

const SHEET_ID = process.env.GOOGLE_SHEET_ID
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY
const RANGE = 'Productos!A2:Q' // A2 porque la fila 1 son encabezados

const COLUMNS = [
  'ID',
  'Categoria',
  'Subcategoria',
  'Codigo',
  'Nombre',
  'Descripcion',
  'Precio',
  'PrecioOferta',
  'Stock',
  'Talla',
  'Color',
  'Marca',
  'Imagen1',
  'Imagen2',
  'Imagen3',
  'Estado',
]

function rowToProduct(row) {
  const obj = {}
  COLUMNS.forEach((col, i) => {
    obj[col] = row[i] ?? ''
  })
  obj.Precio = parseFloat(obj.Precio) || 0
  obj.PrecioOferta = obj.PrecioOferta ? parseFloat(obj.PrecioOferta) : null
  obj.Stock = parseInt(obj.Stock, 10) || 0
  // Colapsa espacios múltiples e internos para evitar duplicados/desorden
  // por inconsistencias al escribir en la hoja (ej. "Vestido  Niña").
  obj.Categoria = (obj.Categoria || '').replace(/\s+/g, ' ').trim()
  obj.Subcategoria = (obj.Subcategoria || '').replace(/\s+/g, ' ').trim()
  obj.Estado = (obj.Estado || 'activo').toLowerCase().trim()
  return obj
}

/**
 * Trae todos los productos desde Google Sheets.
 * Usado en getStaticProps / getServerSideProps (server-side only).
 */
export async function fetchProducts() {
  if (!SHEET_ID || !API_KEY) {
    throw new Error('Faltan GOOGLE_SHEET_ID o GOOGLE_SHEETS_API_KEY en variables de entorno')
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(
    RANGE
  )}?key=${API_KEY}`

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Error de Google Sheets API: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  const rows = data.values || []
  return rows.filter((r) => r[0]).map(rowToProduct) // descarta filas vacías
}

export async function fetchProductById(id) {
  const products = await fetchProducts()
  return products.find((p) => p.ID === id) || null
}

// Normaliza texto para comparar sin importar tildes ni mayúsculas:
// "Niños" === "ninos" === "NIÑOS" → todas se comparan como "ninos"
function normalizar(texto = '') {
  return texto
    .toString()
    .replace(/\s+/g, ' ') // colapsa espacios múltiples/internos
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita tildes (á→a, ñ→n, etc.)
}

export async function fetchProductsByCategory(categoria, subcategoria = null) {
  const products = await fetchProducts()
  return products.filter((p) => {
    const matchCat = normalizar(p.Categoria) === normalizar(categoria)
    const matchSub = subcategoria ? normalizar(p.Subcategoria) === normalizar(subcategoria) : true
    const visible = p.Estado === 'activo' || p.Estado === 'nuevo' // ambos estados se muestran en la tienda
    return matchCat && matchSub && visible
  })
}

export async function fetchOffers() {
  const products = await fetchProducts()
  return products.filter(
    (p) => p.PrecioOferta && p.PrecioOferta < p.Precio && (p.Estado === 'activo' || p.Estado === 'nuevo')
  )
}

export async function searchProducts(query) {
  const products = await fetchProducts()
  const q = normalizar(query)
  return products.filter(
    (p) =>
      (p.Estado === 'activo' || p.Estado === 'nuevo') &&
      (normalizar(p.Nombre).includes(q) ||
        normalizar(p.Descripcion).includes(q) ||
        normalizar(p.Categoria).includes(q) ||
        normalizar(p.Subcategoria).includes(q) ||
        normalizar(p.Marca).includes(q) ||
        normalizar(p.Codigo).includes(q))
  )
}

/**
 * Productos relacionados: misma categoría/subcategoría, excluyendo el actual.
 */
export async function fetchRelatedProducts(product, limit = 4) {
  const products = await fetchProducts()
  return products
    .filter(
      (p) =>
        p.ID !== product.ID &&
        (p.Estado === 'activo' || p.Estado === 'nuevo') &&
        (normalizar(p.Subcategoria) === normalizar(product.Subcategoria) ||
          normalizar(p.Categoria) === normalizar(product.Categoria))
    )
    .slice(0, limit)
}
