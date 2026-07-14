// lib/config.js — Configuración central de la tienda
// El número de WhatsApp se centraliza aquí (rediseño: +51 989891140).
// En producción se define con NEXT_PUBLIC_WPP_NUMBER en Vercel.
export const WPP_NUMBER = process.env.NEXT_PUBLIC_WPP_NUMBER || '51989891140'

export const SITE_URL = 'https://monkysstore.pe'

export const waLink = (msg) => `https://wa.me/${WPP_NUMBER}?text=${encodeURIComponent(msg)}`

// Número con formato legible para mostrar en el footer.
export const WPP_DISPLAY = `+${WPP_NUMBER.slice(0, 2)} ${WPP_NUMBER.slice(2)}`
