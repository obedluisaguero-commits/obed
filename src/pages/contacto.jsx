// pages/contacto.jsx — monky's · Premium
import Head from 'next/head'

const WPP_NUMBER = process.env.NEXT_PUBLIC_WPP_NUMBER || '51999999999'

export default function ContactoPage() {
  return (
    <>
      <Head>
        <title>Contacto | monky&apos;s</title>
        <meta name="description" content="Contáctanos por WhatsApp, redes sociales o visita nuestra tienda en Huancayo." />
      </Head>

      <div style={{maxWidth:'640px',margin:'0 auto',padding:'80px 32px',textAlign:'center'}}>
        <p style={{fontSize:'10px',fontWeight:600,letterSpacing:'3px',textTransform:'uppercase',color:'var(--emerald)',marginBottom:'14px'}}>Hablemos</p>
        <h1 style={{fontSize:'40px',fontWeight:700,letterSpacing:'-1.5px',color:'var(--black)',marginBottom:'12px'}}>Contáctanos</h1>
        <p style={{fontSize:'14px',color:'var(--mid)',marginBottom:'48px',fontWeight:300,lineHeight:1.7}}>
          ¿Dudas sobre tallas, stock o envíos? Escríbenos y respondemos en minutos.
        </p>

        <div className="grid-3-sep" style={{marginBottom:'40px'}}>
          {[
            { icon:'◉', label:'WhatsApp', detail:'+51 999 999 999', href:`https://wa.me/${WPP_NUMBER}` },
            { icon:'◈', label:'Instagram', detail:'@monkysstore', href:'https://instagram.com/monkysstore' },
            { icon:'◎', label:'Tienda', detail:'Huancayo, Junín', href:'#' },
          ].map(c => (
            <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
              style={{textDecoration:'none',background:'#fff',padding:'32px 20px',textAlign:'center',transition:'background .15s'}}
              onMouseEnter={e=>e.currentTarget.style.background='var(--surface)'}
              onMouseLeave={e=>e.currentTarget.style.background='#fff'}
            >
              <p style={{fontSize:'24px',color:'var(--emerald)',marginBottom:'12px'}}>{c.icon}</p>
              <p style={{fontSize:'12px',fontWeight:700,color:'var(--black)',letterSpacing:'.5px',textTransform:'uppercase',marginBottom:'4px'}}>{c.label}</p>
              <p style={{fontSize:'12px',color:'var(--mid)'}}>{c.detail}</p>
            </a>
          ))}
        </div>

        <a href={`https://wa.me/${WPP_NUMBER}?text=${encodeURIComponent("Hola monky's 👋 Tengo una consulta")}`}
          target="_blank" rel="noopener noreferrer"
          className="btn-primary"
          style={{textDecoration:'none',display:'inline-block',padding:'14px 40px',letterSpacing:'2px'}}
        >
          Escribir por WhatsApp
        </a>
      </div>
    </>
  )
}
