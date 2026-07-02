// pages/politica-de-cambios.jsx — Política de cambios
import InfoPage from '../components/InfoPage'

const h2 = { fontSize: '18px', fontWeight: 700, color: 'var(--black)', margin: '28px 0 12px' }
const p = { fontSize: '14px', color: 'var(--mid)', lineHeight: 1.7, marginBottom: '16px' }
const li = { fontSize: '14px', color: 'var(--mid)', lineHeight: 1.7, marginBottom: '8px' }

export default function PoliticaDeCambios() {
  return (
    <InfoPage
      title="Política de cambios"
      description="Cambios en 7 días sin costo adicional en monky's. Conoce las condiciones y cómo solicitar tu cambio por WhatsApp."
      path="/politica-de-cambios"
    >
      <p style={p}>
        Queremos que quedes feliz con tu compra. Si la talla no fue la correcta o el producto no era lo que esperabas,
        puedes solicitar un <strong>cambio dentro de los 7 días calendario</strong> desde que recibiste tu pedido, sin costo adicional
        por el cambio de talla.
      </p>

      <h2 style={h2}>Condiciones para el cambio</h2>
      <ul style={{ paddingLeft: '20px' }}>
        <li style={li}>El producto debe estar <strong>sin uso, sin lavar</strong> y con sus etiquetas originales.</li>
        <li style={li}>Debes conservar el empaque en buen estado.</li>
        <li style={li}>El cambio está sujeto a <strong>stock disponible</strong>; si no hay stock de la talla o modelo, te ofrecemos otro producto o un vale por el mismo valor.</li>
      </ul>

      <h2 style={h2}>Productos sin cambio</h2>
      <p style={p}>
        Por razones de <strong>higiene</strong>, no aplican cambios en ropa interior, lencería, medias, pantimedias, fajas
        ni accesorios de uso personal (antifaces, pestañas). Revisa bien la talla antes de comprar — con gusto te asesoramos.
      </p>

      <h2 style={h2}>¿Cómo solicito un cambio?</h2>
      <ol style={{ paddingLeft: '20px' }}>
        <li style={li}>Escríbenos por <strong>WhatsApp</strong> dentro de los 7 días, indicando tu nombre y el <strong>código del producto</strong> (lo encuentras en la etiqueta o en tu pedido).</li>
        <li style={li}>Te confirmamos el stock de la talla o modelo que necesitas.</li>
        <li style={li}>Coordinamos la entrega: en Huancayo puede ser presencial; para otras regiones, el costo del envío de retorno corre por cuenta del cliente.</li>
      </ol>

      <h2 style={h2}>Devoluciones de dinero</h2>
      <p style={p}>
        Solo realizamos devolución de dinero cuando el producto presenta <strong>fallas de fábrica</strong> verificadas y no hay stock
        para reponerlo. En ese caso, devolvemos el monto por Yape, Plin o transferencia en un máximo de 48 horas.
      </p>
    </InfoPage>
  )
}
