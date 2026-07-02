// pages/guia-de-tallas.jsx — Guía de tallas
import InfoPage from '../components/InfoPage'

const th = { textAlign: 'left', padding: '10px 14px', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#fff', background: 'var(--anthracite)' }
const td = { padding: '10px 14px', fontSize: '13px', color: 'var(--dark)', borderBottom: '1px solid var(--border)' }
const tableWrap = { overflowX: 'auto', marginBottom: '32px', border: '1px solid var(--border)' }
const h2 = { fontSize: '18px', fontWeight: 700, color: 'var(--black)', margin: '28px 0 12px' }
const p = { fontSize: '14px', color: 'var(--mid)', lineHeight: 1.7, marginBottom: '16px' }

export default function GuiaDeTallas() {
  return (
    <InfoPage
      title="Guía de tallas"
      description="Guía de tallas de monky's: medidas referenciales para mujer, hombre y niños. Si tienes dudas, te asesoramos por WhatsApp."
      path="/guia-de-tallas"
    >
      <p style={p}>
        Las medidas son <strong>referenciales</strong> y pueden variar ligeramente según el modelo y la marca.
        Si estás entre dos tallas o tienes dudas, escríbenos por WhatsApp con el código del producto y te asesoramos con gusto.
      </p>

      <h2 style={h2}>Mujer — parte superior (blusas, tops, babydolls)</h2>
      <div style={tableWrap}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th style={th}>Talla</th><th style={th}>Busto (cm)</th><th style={th}>Cintura (cm)</th></tr></thead>
          <tbody>
            <tr><td style={td}>S</td><td style={td}>82 – 88</td><td style={td}>62 – 68</td></tr>
            <tr><td style={td}>M</td><td style={td}>88 – 94</td><td style={td}>68 – 74</td></tr>
            <tr><td style={td}>L</td><td style={td}>94 – 100</td><td style={td}>74 – 80</td></tr>
            <tr><td style={td}>XL</td><td style={td}>100 – 108</td><td style={td}>80 – 88</td></tr>
          </tbody>
        </table>
      </div>

      <h2 style={h2}>Hombre — polos y casacas</h2>
      <div style={tableWrap}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th style={th}>Talla</th><th style={th}>Pecho (cm)</th><th style={th}>Estatura aprox.</th></tr></thead>
          <tbody>
            <tr><td style={td}>S</td><td style={td}>90 – 96</td><td style={td}>1.60 – 1.68 m</td></tr>
            <tr><td style={td}>M</td><td style={td}>96 – 102</td><td style={td}>1.66 – 1.74 m</td></tr>
            <tr><td style={td}>L</td><td style={td}>102 – 108</td><td style={td}>1.72 – 1.80 m</td></tr>
            <tr><td style={td}>XL</td><td style={td}>108 – 116</td><td style={td}>1.78 m a más</td></tr>
          </tbody>
        </table>
      </div>

      <h2 style={h2}>Niños y niñas</h2>
      <div style={tableWrap}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th style={th}>Talla</th><th style={th}>Edad aprox.</th><th style={th}>Estatura (cm)</th></tr></thead>
          <tbody>
            <tr><td style={td}>2</td><td style={td}>1 – 2 años</td><td style={td}>80 – 92</td></tr>
            <tr><td style={td}>4</td><td style={td}>3 – 4 años</td><td style={td}>92 – 104</td></tr>
            <tr><td style={td}>6</td><td style={td}>5 – 6 años</td><td style={td}>104 – 116</td></tr>
            <tr><td style={td}>8</td><td style={td}>7 – 8 años</td><td style={td}>116 – 128</td></tr>
            <tr><td style={td}>10</td><td style={td}>9 – 10 años</td><td style={td}>128 – 140</td></tr>
            <tr><td style={td}>12</td><td style={td}>11 – 12 años</td><td style={td}>140 – 152</td></tr>
          </tbody>
        </table>
      </div>

      <h2 style={h2}>Talla única (U)</h2>
      <p style={p}>
        Algunos productos (fajas, pantimedias, accesorios) vienen en <strong>talla única</strong>, pensada para tallas estándar S a M.
        En la descripción de cada producto indicamos si el material es elástico o si el modelo tiene ajuste regulable.
      </p>
    </InfoPage>
  )
}
