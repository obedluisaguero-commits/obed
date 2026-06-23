// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'drive.google.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'i.imgur.com' },
      // Agregar aquí el dominio donde se alojen las imágenes finales (ej. Cloudinary, Drive)
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      { source: '/niños', destination: '/ninos', permanent: true },
      { source: '/mujeres', destination: '/mujer', permanent: true },
      { source: '/hombres', destination: '/hombre', permanent: true },
    ]
  },
}

module.exports = nextConfig
