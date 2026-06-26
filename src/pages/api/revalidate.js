// pages/api/revalidate.js — Revalidación bajo demanda
// Hace que la tienda relea Google Sheets al instante (en vez de esperar la
// regeneración automática cada 60s). Lo llama el Apps Script (Code.gs) cuando
// editas la hoja.
//
//   GET /api/revalidate?secret=TU_SECRETO
//   Opcional: &id=PRD-001  → refresca también esa ficha de producto.
//
// Requiere la variable de entorno REVALIDATE_SECRET (en Vercel y en el Apps
// Script, deben coincidir).

const PATHS = ['/', '/mujer', '/hombre', '/ninos', '/otros', '/ofertas', '/productos']

export default async function handler(req, res) {
  const secret = req.query.secret || req.headers['x-revalidate-secret']

  if (!process.env.REVALIDATE_SECRET) {
    return res.status(500).json({ revalidated: false, message: 'Falta REVALIDATE_SECRET en el servidor' })
  }
  if (secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ revalidated: false, message: 'Token inválido' })
  }

  try {
    const paths = [...PATHS]
    if (req.query.id) paths.push(`/producto/${req.query.id}`)
    await Promise.all(paths.map((p) => res.revalidate(p)))
    return res.status(200).json({ revalidated: true, paths, at: new Date().toISOString() })
  } catch (err) {
    return res.status(500).json({ revalidated: false, message: 'Error al revalidar', error: String(err) })
  }
}
