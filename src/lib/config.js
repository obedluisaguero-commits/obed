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
// Puedes poner el CÓDIGO del producto (columna "Nombre", ej. 'Ves-090') o su
// ID numérico (columna "ID", ej. '12'). Si lo dejas vacío ('') o no existe,
// se usa automáticamente la foto del primer producto de esa categoría.
//   Ejemplo: mujer: 'Ves-090'  →  la tarjeta "Mujer" mostrará esa foto
export const CATEGORY_HERO_PRODUCT = {
  mujer:  '',   // código o ID del producto para la tarjeta "Mujer"
  hombre: '',   // código o ID del producto para la tarjeta "Hombre"
  ninos:  '',   // código o ID del producto para la tarjeta "Niños"
  otros:  '',   // código o ID del producto para la tarjeta "Otros"
}
