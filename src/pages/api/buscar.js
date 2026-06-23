// pages/api/buscar.js — Buscador inteligente
// GET /api/buscar?q=vestido+floral
import { searchProducts } from '../../lib/sheets'

export default async function handler(req, res) {
  const { q } = req.query
  if (req.method !== 'GET') return res.status(405).end()
  if (!q || q.trim().length < 2) {
    return res.status(200).json({ results: [] })
  }

  try {
    const results = await searchProducts(q.trim())
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60')
    return res.status(200).json({ results, count: results.length })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Error en la búsqueda' })
  }
}
