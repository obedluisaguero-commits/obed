// pages/preguntas-frecuentes.jsx — Preguntas frecuentes (FAQ)
import InfoPage from '../components/InfoPage'
import { safeJsonLd } from '../lib/jsonld'
import Head from 'next/head'

const FAQS = [
  {
    q: '¿Cómo compro en monky’s?',
    a: 'Muy fácil: agrega los productos que te gusten al carrito (🛒) y presiona "Enviar pedido por WhatsApp". Te llegará un mensaje con tu pedido armado y nosotros te confirmamos stock, total y envío. También puedes comprar un solo producto con el botón "Comprar ahora por WhatsApp".',
  },
  {
    q: '¿Qué medios de pago aceptan?',
    a: 'Aceptamos Yape, Plin y transferencia bancaria (BCP). Coordinamos el pago por WhatsApp al confirmar tu pedido.',
  },
  {
    q: '¿Hacen envíos a todo el Perú?',
    a: 'Sí. Enviamos a todas las regiones del Perú mediante agencias de encomienda (Shalom, Olva u otra de tu preferencia). En Huancayo también coordinamos entregas directas. El costo y tiempo de envío dependen de tu ciudad; te lo confirmamos por WhatsApp antes de pagar.',
  },
  {
    q: '¿Cuánto demora el envío?',
    a: 'En Huancayo, normalmente el mismo día o al día siguiente. A otras regiones, entre 2 y 5 días hábiles según la agencia y la distancia.',
  },
  {
    q: '¿Cómo sé cuál es mi talla?',
    a: 'Revisa nuestra Guía de tallas (en el pie de página). Si sigues con dudas, escríbenos por WhatsApp con el código del producto y tus medidas, y te recomendamos la talla ideal.',
  },
  {
    q: '¿Puedo cambiar un producto?',
    a: 'Sí, tienes 7 días calendario para cambios de talla o modelo, siempre que el producto esté sin uso y con etiquetas. Por higiene, la ropa interior y lencería no tienen cambio. Revisa la Política de cambios para más detalle.',
  },
  {
    q: '¿Los precios y el stock están actualizados?',
    a: 'Sí, la tienda se sincroniza con nuestro inventario real. Si un producto aparece "Disponible", lo tenemos en stock. Aun así, siempre te confirmamos la disponibilidad final por WhatsApp antes del pago.',
  },
  {
    q: '¿Tienen tienda física?',
    a: 'Estamos en Huancayo, Junín. Escríbenos por WhatsApp y coordinamos la entrega o visita.',
  },
]

const h2 = { fontSize: '16px', fontWeight: 700, color: 'var(--black)', marginBottom: '8px' }
const p = { fontSize: '14px', color: 'var(--mid)', lineHeight: 1.7 }

export default function PreguntasFrecuentes() {
  return (
    <InfoPage
      title="Preguntas frecuentes"
      description="Resolvemos tus dudas: cómo comprar por WhatsApp, medios de pago (Yape, Plin), envíos a todo el Perú, tallas y cambios."
      path="/preguntas-frecuentes"
    >
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQS.map(f => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        })}} />
      </Head>
      {FAQS.map(f => (
        <div key={f.q} style={{ borderBottom: '1px solid var(--border)', padding: '20px 0' }}>
          <h2 style={h2}>{f.q}</h2>
          <p style={p}>{f.a}</p>
        </div>
      ))}
    </InfoPage>
  )
}
