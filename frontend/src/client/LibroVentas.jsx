import React, { useState } from 'react';

function clp(v){return new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(v);}

const VENTAS_MOCK = [
  { folio:'F-001', fecha:'02/05/2026', cliente:'Constructora Paine SA',   rut:'82.111.222-3', neto:1500000, iva:285000, total:1785000, tipo:'Factura', estado:'Cobrada' },
  { folio:'F-002', fecha:'05/05/2026', cliente:'Agrícola El Roble Ltda.', rut:'76.444.555-6', neto:2200000, iva:418000, total:2618000, tipo:'Factura', estado:'Cobrada' },
  { folio:'B-101', fecha:'08/05/2026', cliente:'Juan Muñoz (particular)', rut:'15.333.444-5', neto:450000,  iva:85500,  total:535500,  tipo:'Boleta',  estado:'Cobrada' },
  { folio:'F-003', fecha:'12/05/2026', cliente:'Retail Maipo SpA',        rut:'77.888.999-0', neto:3100000, iva:589000, total:3689000, tipo:'Factura', estado:'Pendiente' },
  { folio:'F-004', fecha:'18/05/2026', cliente:'Minera Atacama SA',       rut:'91.222.333-4', neto:1170000, iva:222300, total:1392300, tipo:'Factura', estado:'Cobrada' },
];

export default function LibroVentas({ sesion }) {
  const [ventas, setVentas] = useState(VENTAS_MOCK);
  const [form, setForm] = useState({ cliente:'', rut:'', neto:'', tipo:'Factura' });
  const [mostrar, setMostrar] = useState(false);

  const totalNeto = ventas.reduce((a,v)=>a+v.neto,0);
  const totalIva  = ventas.reduce((a,v)=>a+v.iva,0);
  const totalBruto= ventas.reduce((a,v)=>a+v.total,0);

  function agregar() {
    const neto = parseInt(form.neto)||0;
    if (!form.cliente || !neto) return;
    const iva = Math.round(neto*0.19);
    setVentas(p=>[...p,{
      folio: form.tipo==='Factura'?`F-${String(p.length+1).padStart(3,'0')}`:`B-${String(p.length+1).padStart(3,'0')}`,
      fecha: new Date().toLocaleDateString('es-CL'),
      cliente: form.cliente, rut: form.rut||'—', neto, iva, total: neto+iva,
      tipo: form.tipo, estado:'Pendiente'
    }]);
    setForm({ cliente:'', rut:'', neto:'', tipo:'Factura' });
    setMostrar(false);
  }

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div>
          <h1 style={s.titulo}>Libro de Ventas</h1>
          <p style={s.sub}>Mayo 2026 · {ventas.length} documentos</p>
        </div>
        <button style={s.btnAdd} onClick={()=>setMostrar(v=>!v)}>
          {mostrar ? '✕ Cancelar' : '+ Nueva venta'}
        </button>
      </div>

      {/* Totales */}
      <div style={s.totalesGrid}>
        <div style={s.total}><p style={s.totalLabel}>Total neto</p><p style={s.totalValor}>{clp(totalNeto)}</p></div>
        <div style={s.total}><p style={s.totalLabel}>IVA débito</p><p style={{ ...s.totalValor, color:'#FF4D6A' }}>{clp(totalIva)}</p></div>
        <div style={s.total}><p style={s.totalLabel}>Total bruto</p><p style={{ ...s.totalValor, color:'#00C896' }}>{clp(totalBruto)}</p></div>
      </div>

      {/* Formulario */}
      {mostrar && (
        <div style={s.formCard}>
          <p style={s.formTitle}>Registrar documento</p>
          <div style={s.formGrid}>
            <div style={s.campo}><label style={s.label}>Tipo</label>
              <select style={s.input} value={form.tipo} onChange={e=>setForm(p=>({...p,tipo:e.target.value}))}>
                <option>Factura</option><option>Boleta</option><option>Nota de crédito</option>
              </select>
            </div>
            <div style={s.campo}><label style={s.label}>Cliente</label>
              <input style={s.input} placeholder="Razón social" value={form.cliente} onChange={e=>setForm(p=>({...p,cliente:e.target.value}))} />
            </div>
            <div style={s.campo}><label style={s.label}>RUT cliente</label>
              <input style={s.input} placeholder="76.xxx.xxx-x" value={form.rut} onChange={e=>setForm(p=>({...p,rut:e.target.value}))} />
            </div>
            <div style={s.campo}><label style={s.label}>Monto neto (CLP)</label>
              <input style={s.input} type="number" placeholder="0" value={form.neto} onChange={e=>setForm(p=>({...p,neto:e.target.value}))} />
            </div>
          </div>
          {form.neto && <p style={s.ivaPreview}>IVA 19%: {clp(Math.round((parseInt(form.neto)||0)*0.19))} → Total: {clp(Math.round((parseInt(form.neto)||0)*1.19))}</p>}
          <button style={s.btnGuardar} onClick={agregar}>Registrar</button>
        </div>
      )}

      {/* Tabla */}
      <div style={s.tabla}>
        <div style={s.tablaHead}>
          <span>Folio</span><span>Fecha</span><span>Cliente</span><span>Tipo</span><span>Neto</span><span>IVA</span><span>Total</span><span>Estado</span>
        </div>
        {ventas.map((v,i) => (
          <div key={i} style={s.tablaFila}>
            <span style={s.folio}>{v.folio}</span>
            <span style={s.celda}>{v.fecha}</span>
            <span style={{ ...s.celda, color:'#E8EDF2' }}>{v.cliente}</span>
            <span style={{ ...s.celdaBadge, backgroundColor: v.tipo==='Factura'?'rgba(74,144,226,0.1)':'rgba(0,200,150,0.1)', color: v.tipo==='Factura'?'#4A90E2':'#00C896' }}>{v.tipo}</span>
            <span style={s.celda}>{clp(v.neto)}</span>
            <span style={{ ...s.celda, color:'#FF4D6A' }}>{clp(v.iva)}</span>
            <span style={{ ...s.celda, fontFamily:"'Syne',sans-serif", fontWeight:'600' }}>{clp(v.total)}</span>
            <span style={{ ...s.celdaBadge, backgroundColor: v.estado==='Cobrada'?'rgba(0,200,150,0.1)':'rgba(245,166,35,0.1)', color: v.estado==='Cobrada'?'#00C896':'#F5A623' }}>{v.estado}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  wrap:{maxWidth:'960px'}, header:{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.5rem'},
  titulo:{fontFamily:"'Syne',sans-serif",fontWeight:'800',fontSize:'1.75rem',color:'#E8EDF2',letterSpacing:'-0.04em'},
  sub:{fontSize:'0.8rem',color:'#4A5A6A',marginTop:'0.3rem',fontFamily:"'DM Sans',sans-serif"},
  btnAdd:{padding:'0.6rem 1.2rem',backgroundColor:'#00C896',border:'none',WebkitAppearance:'none',borderRadius:'8px',color:'#0A0E14',fontFamily:"'DM Sans',sans-serif",fontWeight:'600',fontSize:'0.85rem',cursor:'pointer'},
  totalesGrid:{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem',marginBottom:'1.25rem'},
  total:{backgroundColor:'#111820',border:'1px solid #1E2D3D',borderRadius:'12px',padding:'1rem 1.25rem'},
  totalLabel:{fontSize:'0.7rem',color:'#4A5A6A',textTransform:'uppercase',letterSpacing:'0.07em',fontFamily:"'DM Sans',sans-serif",marginBottom:'0.35rem'},
  totalValor:{fontFamily:"'Syne',sans-serif",fontWeight:'700',fontSize:'1.3rem',color:'#E8EDF2',letterSpacing:'-0.03em'},
  formCard:{backgroundColor:'#111820',border:'1px solid #1E2D3D',borderRadius:'14px',padding:'1.4rem',marginBottom:'1.25rem'},
  formTitle:{fontFamily:"'Syne',sans-serif",fontWeight:'700',fontSize:'0.95rem',color:'#E8EDF2',marginBottom:'1rem'},
  formGrid:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.9rem',marginBottom:'0.75rem'},
  campo:{display:'flex',flexDirection:'column',gap:'0.4rem'},
  label:{fontSize:'0.7rem',color:'#7A8FA6',fontFamily:"'DM Sans',sans-serif",fontWeight:'500',textTransform:'uppercase',letterSpacing:'0.05em'},
  input:{backgroundColor:'#0A0E14',border:'1px solid #1E2D3D',borderRadius:'8px',padding:'0.6rem 0.85rem',color:'#E8EDF2',fontFamily:"'DM Sans',sans-serif",fontSize:'0.875rem',outline:'none'},
  ivaPreview:{fontSize:'0.8rem',color:'#00C896',fontFamily:"'DM Sans',sans-serif",marginBottom:'0.75rem'},
  btnGuardar:{padding:'0.6rem 1.4rem',backgroundColor:'rgba(0,200,150,0.1)',border:'1px solid rgba(0,200,150,0.3)',WebkitAppearance:'none',borderRadius:'8px',color:'#00C896',fontFamily:"'DM Sans',sans-serif",fontWeight:'600',fontSize:'0.85rem',cursor:'pointer'},
  tabla:{backgroundColor:'#111820',border:'1px solid #1E2D3D',borderRadius:'14px',overflow:'hidden'},
  tablaHead:{display:'grid',gridTemplateColumns:'0.6fr 0.7fr 1.6fr 0.8fr 1fr 1fr 1fr 0.7fr',padding:'0.65rem 1.1rem',borderBottom:'1px solid #1E2D3D',fontSize:'0.65rem',fontWeight:'600',color:'#4A5A6A',letterSpacing:'0.08em',textTransform:'uppercase',fontFamily:"'DM Sans',sans-serif"},
  tablaFila:{display:'grid',gridTemplateColumns:'0.6fr 0.7fr 1.6fr 0.8fr 1fr 1fr 1fr 0.7fr',padding:'0.8rem 1.1rem',borderBottom:'1px solid #0D1520',alignItems:'center'},
  folio:{fontSize:'0.78rem',fontWeight:'700',color:'#4A90E2',fontFamily:"'DM Sans',sans-serif"},
  celda:{fontSize:'0.82rem',color:'#C8D8E8',fontFamily:"'DM Sans',sans-serif"},
  celdaBadge:{fontSize:'0.68rem',fontWeight:'600',padding:'2px 8px',borderRadius:'20px',fontFamily:"'DM Sans',sans-serif",textAlign:'center'},
};
