// pages/api/stock/[id].js — Verifica stock en tiempo real de un producto
// Se usa en la página de producto para refrescar el stock cada cierto intervalo
// sin tener que regenerar toda la página estática.

import { fetchProductById } from '../../../lib/sheets'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  try {
    const product = await fetchProductById(id)
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }
    res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=30')
    return res.status(200).json({
      ID: product.ID,
      Stock: product.Stock,
      Estado: product.Estado,
      Precio: product.Precio,
      PrecioOferta: product.PrecioOferta,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Error al consultar stock' })
  }
}
