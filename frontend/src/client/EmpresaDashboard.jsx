import React, { useEffect, useState } from 'react';

function clp(v) { return new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(v); }

const ALERTAS = [
  { tipo: 'urgente', msg: 'F29 mayo vence el 12/06/2026 — 18 días', icon: '⚠' },
  { tipo: 'info',    msg: 'Remuneraciones junio: liquidar antes del 30/06', icon: 'ℹ' },
  { tipo: 'ahorro',  msg: 'Oportunidad: compras de activos antes del 30 jun reducen base imponible', icon: '★' },
];

export default function EmpresaDashboard({ sesion, onNavigate }) {
  const [ind, setInd] = useState(null);
  useEffect(() => {
    fetch('/api/indicadores').then(r=>r.json()).then(setInd).catch(()=>{});
  }, []);

  const mesActual = new Date().toLocaleDateString('es-CL',{month:'long',year:'numeric'});

  return (
    <div>
      <div style={s.header}>
        <div>
          <h1 style={s.titulo}>{sesion.nombre}</h1>
          <p style={s.sub}>Panel contable · {mesActual} · RUT {sesion.empresa}</p>
        </div>
        <div style={s.regimenPill}>
          <span style={s.regimenDot}/>
          <span style={s.regimenText}>{sesion.regimen}</span>
        </div>
      </div>

      {/* Alertas */}
      <div style={s.alertasWrap}>
        {ALERTAS.map((a,i) => (
          <div key={i} style={{ ...s.alerta, ...s[`alerta_${a.tipo}`] }}>
            <span>{a.icon}</span>
            <span style={s.alertaMsg}>{a.msg}</span>
          </div>
        ))}
      </div>

      {/* KPIs */}
      <div style={s.kpiGrid}>
        {[
          { label: 'Ventas netas (mes)',      valor: clp(8420000),  sub: 'Mayo 2026',         color: '#E8EDF2' },
          { label: 'IVA débito',              valor: clp(1599800),  sub: '19% s/ventas',       color: '#FF4D6A' },
          { label: 'IVA crédito',             valor: clp(982400),   sub: 'Crédito recuperable',color: '#4A90E2' },
          { label: 'IVA a pagar',             valor: clp(617400),   sub: 'Estimado F29',       color: '#F5A623' },
          { label: 'UF hoy',                  valor: ind ? new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:2}).format(ind.uf?.valor) : '…', sub: 'Banco Central', color: '#00C896' },
          { label: 'Planilla remuneraciones', valor: clp(3200000),  sub: '2 trabajadores',     color: '#E8EDF2' },
        ].map(k => (
          <div key={k.label} style={s.kpi}>
            <p style={s.kpiLabel}>{k.label}</p>
            <p style={{ ...s.kpiValor, color: k.color }}>{k.valor}</p>
            <p style={s.kpiSub}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Accesos rápidos */}
      <div style={s.quickGrid}>
        {[
          { label: 'Registrar venta',     vista: 'Libro de Ventas',     icon: '↑', color: '#00C896' },
          { label: 'Registrar compra',    vista: 'Libro de Compras',    icon: '↓', color: '#4A90E2' },
          { label: 'Liquidar sueldo',     vista: 'Remuneraciones',      icon: '◉', color: '#F5A623' },
          { label: 'Optimizar impuestos', vista: 'Optimización Fiscal', icon: '★', color: '#F5A623' },
        ].map(q => (
          <button key={q.label} style={{ ...s.quickBtn }} onClick={() => onNavigate(q.vista)}>
            <span style={{ ...s.quickIcon, color: q.color }}>{q.icon}</span>
            <span style={s.quickLabel}>{q.label}</span>
            <span style={s.quickArrow}>→</span>
          </button>
        ))}
      </div>

      {/* Calendario obligaciones */}
      <div style={s.section}>
        <p style={s.sectionTitle}>Próximas obligaciones</p>
        {[
          { fecha:'12/06/2026', form:'F29', desc:'Declaración IVA mayo 2026',   estado:'Urgente' },
          { fecha:'30/06/2026', form:'LRE', desc:'Libro de remuneraciones',     estado:'Pendiente' },
          { fecha:'15/07/2026', form:'F50', desc:'Retención honorarios junio',  estado:'Pendiente' },
          { fecha:'12/07/2026', form:'F29', desc:'Declaración IVA junio 2026',  estado:'Futuro' },
        ].map((o,i) => {
          const colors = { Urgente:{bg:'rgba(255,77,106,0.1)',c:'#FF4D6A'}, Pendiente:{bg:'rgba(245,166,35,0.1)',c:'#F5A623'}, Futuro:{bg:'rgba(74,144,226,0.1)',c:'#4A90E2'} };
          const col = colors[o.estado];
          return (
            <div key={i} style={s.obligFila}>
              <span style={s.obligFecha}>{o.fecha}</span>
              <span style={s.obligForm}>{o.form}</span>
              <span style={s.obligDesc}>{o.desc}</span>
              <span style={{ ...s.obligBadge, backgroundColor: col.bg, color: col.c }}>{o.estado}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const s = {
  header: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.25rem' },
  titulo: { fontFamily:"'Syne',sans-serif", fontWeight:'800', fontSize:'1.6rem', color:'#E8EDF2', letterSpacing:'-0.04em' },
  sub: { fontSize:'0.78rem', color:'#4A5A6A', marginTop:'0.25rem', fontFamily:"'DM Sans',sans-serif" },
  regimenPill: { display:'flex', alignItems:'center', gap:'0.4rem', padding:'0.4rem 0.9rem', borderRadius:'20px', backgroundColor:'rgba(0,200,150,0.1)', border:'1px solid rgba(0,200,150,0.2)' },
  regimenDot: { width:'6px', height:'6px', borderRadius:'50%', backgroundColor:'#00C896', boxShadow:'0 0 6px #00C896' },
  regimenText: { fontSize:'0.75rem', fontWeight:'500', color:'#00C896', fontFamily:"'DM Sans',sans-serif" },
  alertasWrap: { display:'flex', flexDirection:'column', gap:'0.4rem', marginBottom:'1.25rem' },
  alerta: { display:'flex', alignItems:'center', gap:'0.6rem', padding:'0.6rem 0.9rem', borderRadius:'9px', border:'1px solid', fontSize:'0.82rem', fontFamily:"'DM Sans',sans-serif" },
  alerta_urgente: { backgroundColor:'rgba(255,77,106,0.08)', borderColor:'rgba(255,77,106,0.2)', color:'#FF4D6A' },
  alerta_info: { backgroundColor:'rgba(74,144,226,0.08)', borderColor:'rgba(74,144,226,0.2)', color:'#7AABF0' },
  alerta_ahorro: { backgroundColor:'rgba(245,166,35,0.08)', borderColor:'rgba(245,166,35,0.2)', color:'#F5A623' },
  alertaMsg: { flex:1 },
  kpiGrid: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.85rem', marginBottom:'1.25rem' },
  kpi: { backgroundColor:'#111820', border:'1px solid #1E2D3D', borderRadius:'12px', padding:'1.1rem 1.25rem' },
  kpiLabel: { fontSize:'0.68rem', color:'#4A5A6A', textTransform:'uppercase', letterSpacing:'0.07em', fontFamily:"'DM Sans',sans-serif", fontWeight:'600', marginBottom:'0.35rem' },
  kpiValor: { fontFamily:"'Syne',sans-serif", fontWeight:'700', fontSize:'1.25rem', letterSpacing:'-0.03em' },
  kpiSub: { fontSize:'0.72rem', color:'#4A5A6A', fontFamily:"'DM Sans',sans-serif", marginTop:'0.2rem' },
  quickGrid: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.75rem', marginBottom:'1.25rem' },
  quickBtn: { display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.85rem 1rem', backgroundColor:'#111820', border:'1px solid #1E2D3D', borderRadius:'10px', cursor:'pointer', WebkitAppearance:'none', transition:'border-color 0.15s', width:'100%' },
  quickIcon: { fontSize:'1rem' },
  quickLabel: { flex:1, fontSize:'0.82rem', color:'#C8D8E8', fontFamily:"'DM Sans',sans-serif", textAlign:'left' },
  quickArrow: { fontSize:'0.8rem', color:'#4A5A6A' },
  section: { backgroundColor:'#111820', border:'1px solid #1E2D3D', borderRadius:'14px', padding:'1.4rem' },
  sectionTitle: { fontFamily:"'Syne',sans-serif", fontWeight:'700', fontSize:'0.95rem', color:'#E8EDF2', marginBottom:'1rem' },
  obligFila: { display:'grid', gridTemplateColumns:'100px 60px 1fr auto', gap:'0.75rem', alignItems:'center', padding:'0.7rem 0', borderBottom:'1px solid #1A2535' },
  obligFecha: { fontSize:'0.8rem', color:'#7A8FA6', fontFamily:"'DM Sans',sans-serif" },
  obligForm: { fontSize:'0.72rem', fontWeight:'700', color:'#4A90E2', backgroundColor:'rgba(74,144,226,0.1)', padding:'2px 7px', borderRadius:'5px', fontFamily:"'DM Sans',sans-serif", textAlign:'center' },
  obligDesc: { fontSize:'0.84rem', color:'#C8D8E8', fontFamily:"'DM Sans',sans-serif" },
  obligBadge: { fontSize:'0.68rem', fontWeight:'600', padding:'2px 9px', borderRadius:'20px', fontFamily:"'DM Sans',sans-serif" },
};
