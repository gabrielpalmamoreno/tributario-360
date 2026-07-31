import React, { useState } from 'react';
import { X, Lightbulb } from 'lucide-react';

function clp(v){return new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(v);}

const COMPRAS_MOCK = [
  { folio:'F-2241', fecha:'03/05/2026', proveedor:'Ferretería Central SA',    rut:'76.100.200-3', neto:890000,  iva:169100, total:1059100, tipo:'Factura', uso:'Materiales obra',    credito:true },
  { folio:'F-8812', fecha:'06/05/2026', proveedor:'Transporte Rápido Ltda.',  rut:'79.500.600-7', neto:320000,  iva:60800,  total:380800,  tipo:'Factura', uso:'Flete materiales',  credito:true },
  { folio:'F-0031', fecha:'09/05/2026', proveedor:'Copec (bencina)',          rut:'90.000.000-6', neto:145000,  iva:27550,  total:172550,  tipo:'Factura', uso:'Combustible',       credito:true },
  { folio:'B-0091', fecha:'11/05/2026', proveedor:'Restaurante El Centro',    rut:'76.900.100-2', neto:48000,   iva:9120,   total:57120,   tipo:'Boleta',  uso:'Entretención',      credito:false },
  { folio:'F-1190', fecha:'14/05/2026', proveedor:'Sodimac Constructor',      rut:'96.600.000-1', neto:1240000, iva:235600, total:1475600, tipo:'Factura', uso:'Equipos y herram.', credito:true },
];

export default function LibroCompras({ sesion }) {
  const [compras, setCompras] = useState(COMPRAS_MOCK);
  const [form, setForm] = useState({ proveedor:'', rut:'', neto:'', uso:'', tipo:'Factura', credito:true });
  const [mostrar, setMostrar] = useState(false);

  const totalNeto    = compras.reduce((a,c)=>a+c.neto,0);
  const totalIva     = compras.reduce((a,c)=>a+c.iva,0);
  const creditoFiscal= compras.filter(c=>c.credito).reduce((a,c)=>a+c.iva,0);
  const noCredito    = compras.filter(c=>!c.credito).reduce((a,c)=>a+c.iva,0);

  function agregar() {
    const neto = parseInt(form.neto)||0;
    if (!form.proveedor || !neto) return;
    const iva = Math.round(neto*0.19);
    setCompras(p=>[...p,{ folio:`F-${Math.floor(Math.random()*9000+1000)}`, fecha:new Date().toLocaleDateString('es-CL'), proveedor:form.proveedor, rut:form.rut||'—', neto, iva, total:neto+iva, tipo:form.tipo, uso:form.uso||'General', credito:form.credito }]);
    setForm({ proveedor:'', rut:'', neto:'', uso:'', tipo:'Factura', credito:true });
    setMostrar(false);
  }

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div>
          <h1 style={s.titulo}>Libro de Compras</h1>
          <p style={s.sub}>Mayo 2026 · {compras.length} documentos</p>
        </div>
        <button style={s.btnAdd} onClick={()=>setMostrar(v=>!v)}>
          {mostrar ? <><X size={14}/> Cancelar</> : '+ Nueva compra'}
        </button>
      </div>

      <div style={s.totalesGrid}>
        <div style={s.total}><p style={s.totalLabel}>Total neto compras</p><p style={s.totalValor}>{clp(totalNeto)}</p></div>
        <div style={s.total}><p style={s.totalLabel}>IVA crédito fiscal</p><p style={{...s.totalValor,color:'#4A90E2'}}>{clp(creditoFiscal)}</p><p style={s.totalSub}>Recuperable en F29</p></div>
        <div style={s.total}><p style={s.totalLabel}>IVA no recuperable</p><p style={{...s.totalValor,color:'#FF4D6A'}}>{clp(noCredito)}</p><p style={s.totalSub}>Sin derecho a crédito</p></div>
      </div>

      <div style={s.tipBox}>
        <span style={s.tipIcon}><Lightbulb size={16}/></span>
        <p style={s.tipText}><strong>Optimización:</strong> El IVA de boletas y gastos de entretención NO da derecho a crédito fiscal. Exige siempre factura a nombre de la empresa para recuperar el IVA.</p>
      </div>

      {mostrar && (
        <div style={s.formCard}>
          <p style={s.formTitle}>Registrar compra</p>
          <div style={s.formGrid}>
            <div style={s.campo}><label style={s.label}>Proveedor</label>
              <input style={s.input} value={form.proveedor} onChange={e=>setForm(p=>({...p,proveedor:e.target.value}))} placeholder="Razón social" /></div>
            <div style={s.campo}><label style={s.label}>RUT proveedor</label>
              <input style={s.input} value={form.rut} onChange={e=>setForm(p=>({...p,rut:e.target.value}))} placeholder="76.xxx.xxx-x" /></div>
            <div style={s.campo}><label style={s.label}>Monto neto</label>
              <input style={s.input} type="number" value={form.neto} onChange={e=>setForm(p=>({...p,neto:e.target.value}))} placeholder="0" /></div>
            <div style={s.campo}><label style={s.label}>Uso / descripción</label>
              <input style={s.input} value={form.uso} onChange={e=>setForm(p=>({...p,uso:e.target.value}))} placeholder="Ej: Materiales obra" /></div>
          </div>
          <div style={s.checkRow}>
            <label style={s.checkLabel}>
              <input type="checkbox" checked={form.credito} onChange={e=>setForm(p=>({...p,credito:e.target.checked}))} style={{marginRight:'0.4rem'}} />
              Tiene derecho a crédito fiscal IVA
            </label>
          </div>
          <button style={s.btnGuardar} onClick={agregar}>Registrar</button>
        </div>
      )}

      <div style={s.tabla}>
        <div style={s.tablaHead}>
          <span>Folio</span><span>Fecha</span><span>Proveedor</span><span>Uso</span><span>Neto</span><span>IVA</span><span>Crédito</span>
        </div>
        {compras.map((c,i)=>(
          <div key={i} style={s.tablaFila}>
            <span style={s.folio}>{c.folio}</span>
            <span style={s.celda}>{c.fecha}</span>
            <span style={{...s.celda,color:'#E8EDF2'}}>{c.proveedor}</span>
            <span style={{...s.celda,color:'#7A8FA6',fontSize:'0.78rem'}}>{c.uso}</span>
            <span style={s.celda}>{clp(c.neto)}</span>
            <span style={{...s.celda,color:'#4A90E2'}}>{clp(c.iva)}</span>
            <span style={{...s.celdaBadge,backgroundColor:c.credito?'rgba(0,200,150,0.1)':'rgba(255,77,106,0.1)',color:c.credito?'#00C896':'#FF4D6A'}}>
              {c.credito?'Sí':'No'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  wrap:{maxWidth:'960px'}, header:{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.5rem'},
  titulo:{fontFamily:"'Montserrat',sans-serif",fontWeight:'800',fontSize:'1.75rem',color:'#E8EDF2',letterSpacing:'-0.04em'},
  sub:{fontSize:'0.8rem',color:'#4A5A6A',marginTop:'0.3rem',fontFamily:"'Montserrat',sans-serif"},
  btnAdd:{padding:'0.6rem 1.2rem',backgroundColor:'#00C896',border:'none',WebkitAppearance:'none',borderRadius:'8px',color:'#0A0E14',fontFamily:"'Montserrat',sans-serif",fontWeight:'600',fontSize:'0.85rem',cursor:'pointer',display:'inline-flex',alignItems:'center',gap:'0.35rem'},
  totalesGrid:{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem',marginBottom:'1.25rem'},
  total:{backgroundColor:'#111820',border:'1px solid #1E2D3D',borderRadius:'12px',padding:'1rem 1.25rem'},
  totalLabel:{fontSize:'0.7rem',color:'#4A5A6A',textTransform:'uppercase',letterSpacing:'0.07em',fontFamily:"'Montserrat',sans-serif",marginBottom:'0.35rem'},
  totalValor:{fontFamily:"'Montserrat',sans-serif",fontWeight:'700',fontSize:'1.3rem',color:'#E8EDF2'},
  totalSub:{fontSize:'0.7rem',color:'#4A5A6A',fontFamily:"'Montserrat',sans-serif",marginTop:'0.15rem'},
  tipBox:{display:'flex',gap:'0.7rem',backgroundColor:'rgba(245,166,35,0.07)',border:'1px solid rgba(245,166,35,0.2)',borderRadius:'10px',padding:'0.85rem 1rem',marginBottom:'1.25rem',alignItems:'flex-start'},
  tipIcon:{color:'#F5A623',fontSize:'0.9rem',flexShrink:0,marginTop:'1px'},
  tipText:{fontSize:'0.82rem',color:'#C8B060',fontFamily:"'Montserrat',sans-serif",lineHeight:1.6},
  formCard:{backgroundColor:'#111820',border:'1px solid #1E2D3D',borderRadius:'14px',padding:'1.4rem',marginBottom:'1.25rem'},
  formTitle:{fontFamily:"'Montserrat',sans-serif",fontWeight:'700',fontSize:'0.95rem',color:'#E8EDF2',marginBottom:'1rem'},
  formGrid:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.9rem',marginBottom:'0.75rem'},
  campo:{display:'flex',flexDirection:'column',gap:'0.4rem'},
  label:{fontSize:'0.7rem',color:'#7A8FA6',fontFamily:"'Montserrat',sans-serif",fontWeight:'500',textTransform:'uppercase',letterSpacing:'0.05em'},
  input:{backgroundColor:'#0A0E14',border:'1px solid #1E2D3D',borderRadius:'8px',padding:'0.6rem 0.85rem',color:'#E8EDF2',fontFamily:"'Montserrat',sans-serif",fontSize:'0.875rem',outline:'none'},
  checkRow:{marginBottom:'0.75rem'},
  checkLabel:{fontSize:'0.82rem',color:'#7A8FA6',fontFamily:"'Montserrat',sans-serif",cursor:'pointer',display:'flex',alignItems:'center'},
  btnGuardar:{padding:'0.6rem 1.4rem',backgroundColor:'rgba(0,200,150,0.1)',border:'1px solid rgba(0,200,150,0.3)',WebkitAppearance:'none',borderRadius:'8px',color:'#00C896',fontFamily:"'Montserrat',sans-serif",fontWeight:'600',fontSize:'0.85rem',cursor:'pointer'},
  tabla:{backgroundColor:'#111820',border:'1px solid #1E2D3D',borderRadius:'14px',overflow:'hidden'},
  tablaHead:{display:'grid',gridTemplateColumns:'0.7fr 0.7fr 1.6fr 1.2fr 1fr 1fr 0.6fr',padding:'0.65rem 1.1rem',borderBottom:'1px solid #1E2D3D',fontSize:'0.65rem',fontWeight:'600',color:'#4A5A6A',letterSpacing:'0.08em',textTransform:'uppercase',fontFamily:"'Montserrat',sans-serif"},
  tablaFila:{display:'grid',gridTemplateColumns:'0.7fr 0.7fr 1.6fr 1.2fr 1fr 1fr 0.6fr',padding:'0.8rem 1.1rem',borderBottom:'1px solid #0D1520',alignItems:'center'},
  folio:{fontSize:'0.78rem',fontWeight:'700',color:'#4A90E2',fontFamily:"'Montserrat',sans-serif"},
  celda:{fontSize:'0.82rem',color:'#C8D8E8',fontFamily:"'Montserrat',sans-serif"},
  celdaBadge:{fontSize:'0.68rem',fontWeight:'600',padding:'2px 8px',borderRadius:'20px',fontFamily:"'Montserrat',sans-serif",textAlign:'center'},
};
