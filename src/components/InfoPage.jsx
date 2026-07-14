// components/InfoPage.jsx — Plantilla para páginas informativas
// (guía de tallas, política de cambios, preguntas frecuentes, sobre nosotros)
import Head from 'next/head'
import Link from 'next/link'

import { WPP_NUMBER } from '../lib/config'

export default function InfoPage({ title, description, path, children }) {
  return (
    <>
      <Head>
        <title>{`${title} | monky's`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://monkysstore.pe${path}`} />
      </Head>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '56px 24px 80px' }}>
        <nav style={{ fontSize: '11px', color: 'var(--light)', display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '20px', letterSpacing: '.3px' }}>
          <Link href="/" style={{ color: 'var(--mid)', textDecoration: 'none' }}>Inicio</Link>
          <span>·</span>
          <span style={{ color: 'var(--black)' }}>{title}</span>
        </nav>

        <h1 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-1px', color: 'var(--black)', marginBottom: '8px' }}>{title}</h1>
        <div style={{ width: '40px', height: '2px', background: 'var(--gold)', marginBottom: '32px' }} />

        <div className="info-content">{children}</div>

        <div style={{ marginTop: '48px', borderTop: '1px solid var(--border)', paddingTop: '28px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: 'var(--mid)', marginBottom: '16px' }}>¿Tienes otra duda? Escríbenos y te respondemos al toque.</p>
          <a
            href={`https://wa.me/${WPP_NUMBER}?text=${encodeURIComponent("Hola monky's 👋 Tengo una consulta")}`}
            target="_blank" rel="noopener noreferrer"
            className="btn-primary"
            style={{ textDecoration: 'none', display: 'inline-block' }}
          >
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </>
  )
}
