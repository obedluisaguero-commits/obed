// lib/config.js — Configuración central de la tienda
// El número de WhatsApp se centraliza aquí (rediseño: +51 989891140).
// En producción se define con NEXT_PUBLIC_WPP_NUMBER en Vercel.
export const WPP_NUMBER = process.env.NEXT_PUBLIC_WPP_NUMBER || '51989891140'

export const SITE_URL = 'https://monkysstore.pe'

export const waLink = (msg) => `https://wa.me/${WPP_NUMBER}?text=${encodeURIComponent(msg)}`

// Número con formato legible para mostrar en el footer.
export const WPP_DISPLAY = `+${WPP_NUMBER.slice(0, 2)} ${WPP_NUMBER.slice(2)}`

// ─── Foto de cada categoría en el inicio ───────────────────────────────
// Elige QUÉ producto representa a cada categoría en las tarjetas del inicio.
// Pon el ID del producto (columna "ID" de tu Google Sheet) cuya foto quieras
// mostrar. Si lo dejas vacío ('') o el ID no existe, se usa automáticamente
// la foto del primer producto de esa categoría.
//   Ejemplo: mujer: '12'  →  la tarjeta "Mujer" mostrará la foto del producto 12
export const CATEGORY_HERO_PRODUCT = {
  mujer:  '',   // ID del producto para la tarjeta "Mujer"
  hombre: '',   // ID del producto para la tarjeta "Hombre"
  ninos:  '',   // ID del producto para la tarjeta "Niños"
  otros:  '',   // ID del producto para la tarjeta "Otros"
}
