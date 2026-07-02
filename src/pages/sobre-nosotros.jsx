// pages/sobre-nosotros.jsx — Sobre nosotros
import InfoPage from '../components/InfoPage'
import Image from 'next/image'

const h2 = { fontSize: '18px', fontWeight: 700, color: 'var(--black)', margin: '28px 0 12px' }
const p = { fontSize: '14px', color: 'var(--mid)', lineHeight: 1.8, marginBottom: '16px' }

export default function SobreNosotros() {
  return (
    <InfoPage
      title="Sobre nosotros"
      description="monky's es una tienda de moda familiar de Huancayo, Perú: ropa para mujer, hombre y niños con calidad, buen precio y atención cercana."
      path="/sobre-nosotros"
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
        <Image src="/monkys-avatar.svg" alt="monky's STORE" width={110} height={110} />
      </div>

      <p style={p}>
        <strong>monky&apos;s</strong> nació en <strong>Huancayo, Junín</strong>, con una idea simple: que toda la familia peruana
        pueda vestirse con estilo sin pagar de más. Somos un emprendimiento local que selecciona cada prenda pensando en
        calidad, comodidad y precios justos.
      </p>

      <h2 style={h2}>Lo que nos mueve</h2>
      <p style={p}>
        Creemos en la atención cercana: nos escribes por WhatsApp y te responde una persona real que conoce cada producto,
        te asesora con las tallas y te acompaña hasta que tu pedido llega a tu puerta, en Huancayo o en cualquier región del Perú.
      </p>

      <h2 style={h2}>Por qué comprar con nosotros</h2>
      <p style={p}>
        📦 Envíos a todo el Perú &nbsp;·&nbsp; 💬 Atención personalizada por WhatsApp &nbsp;·&nbsp; 💳 Pagos fáciles con Yape,
        Plin o transferencia &nbsp;·&nbsp; 🔄 Cambios en 7 días &nbsp;·&nbsp; ✅ Stock real y actualizado.
      </p>

      <p style={p}>
        Gracias por confiar en nosotros. Cada compra apoya a un negocio familiar peruano. 🐵💚
      </p>
    </InfoPage>
  )
}
