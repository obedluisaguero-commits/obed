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
// Puedes poner el CÓDIGO del producto (columna "Codigo", ej. 'Ves-0252Y') o su
// ID numérico (columna "ID", ej. '252'). Si lo dejas vacío ('') o no existe,
// se usa automáticamente la foto del primer producto de esa categoría.
//   Ejemplo: mujer: 'Ves-0252Y'  →  la tarjeta "Mujer" mostrará esa foto
export const CATEGORY_HERO_PRODUCT = {
  mujer:  'Ves-0252Y',   // Vestido elegante de canalé elástico cepillado
  hombre: 'Cas-0344R',   // Casaca piel de tiburón
  ninos:  'Con-0130R',   // Conjunto Niña
  otros:  'Aud-0378Y',   // ATTACK SHARK L80 Pro
}
