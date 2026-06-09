import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

function clp(v){return new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(v);}

const TRABAJADORES_BASE = [
  { nombre:'Carlos Fuentes',  rut:'14.222.333-4', cargo:'Maestro obras',       sueldo:850000,  afp:'Habitat', salud:'Fonasa' },
  { nombre:'Rosa Sepúlveda',  rut:'17.444.555-6', cargo:'Administradora',      sueldo:1200000, afp:'Capital', salud:'Isapre Cruz Blanca' },
];

const AFP_TASA = { 'Habitat':0.1127, 'Capital':0.1144, 'Provida':0.1154, 'Cuprum':0.1144, 'Modelo':0.1027, 'PlanVital':0.1116 };

function generarPDF(sesion, trabajador, calc) {
  const doc = new jsPDF('p', 'mm', 'letter');
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const m = 20;
  const cw = pw - m * 2;
  const mes = new Date().toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });
  const mesLabel = mes.charAt(0).toUpperCase() + mes.slice(1);

  const negro = [0, 0, 0];
  const gris  = [120, 120, 120];

  function linea(y) {
    doc.setDrawColor(...gris);
    doc.setLineWidth(0.3);
    doc.line(m, y, m + cw, y);
  }

  function fila(label, valor, y, negrita = false) {
    doc.setFont('helvetica', negrita ? 'bold' : 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...negro);
    doc.text(label, m, y);
    doc.text(valor, m + cw, y, { align: 'right' });
  }

  // ── Título ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...negro);
  doc.text('LIQUIDACIÓN DE SUELDO', pw / 2, 20, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...gris);
  doc.text(`Período: ${mesLabel}`, pw / 2, 27, { align: 'center' });

  // Línea bajo título
  doc.setDrawColor(...negro);
  doc.setLineWidth(0.5);
  doc.line(m, 31, m + cw, 31);

  let y = 40;

  // ── Datos empleador / trabajador ──
  const bw = cw / 2 - 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...gris);
  doc.text('EMPLEADOR', m, y);
  doc.text('TRABAJADOR', m + bw + 10, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...negro);
  doc.text(sesion.nombre, m, y, { maxWidth: bw });
  doc.text(trabajador.nombre, m + bw + 10, y, { maxWidth: bw });

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...gris);
  doc.text(`RUT: ${sesion.empresa}`, m, y);
  doc.text(`RUT: ${trabajador.rut}`, m + bw + 10, y);

  y += 5;
  doc.text(`Cargo: ${trabajador.cargo}`, m + bw + 10, y);

  y += 8;
  linea(y);
  y += 8;

  // ── HABERES ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...gris);
  doc.text('HABERES', m, y);
  doc.text('MONTO', m + cw, y, { align: 'right' });
  y += 7;

  fila('Sueldo Base', clp(trabajador.sueldo), y);
  y += 8;
  linea(y);
  y += 6;
  fila('Total Haberes', clp(trabajador.sueldo), y, true);
  y += 10;
  linea(y);
  y += 8;

  // ── DESCUENTOS ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...gris);
  doc.text('DESCUENTOS LEGALES', m, y);
  doc.text('MONTO', m + cw, y, { align: 'right' });
  y += 7;

  const descuentos = [
    [`AFP ${trabajador.afp} (${(AFP_TASA[trabajador.afp] * 100).toFixed(2)}%)`, `-${clp(calc.descAfp)}`],
    [`Salud ${trabajador.salud} (7.00%)`,                                        `-${clp(calc.descSalud)}`],
    ['Seguro de Cesantía trabajador (0.60%)',                                    `-${clp(calc.descCes)}`],
  ];

  for (const [label, valor] of descuentos) {
    fila(label, valor, y);
    y += 7;
  }

  linea(y);
  y += 6;
  fila('Total Descuentos', `-${clp(calc.totalDesc)}`, y, true);
  y += 10;

  // ── LÍQUIDO ──
  doc.setDrawColor(...negro);
  doc.setLineWidth(0.5);
  doc.line(m, y, m + cw, y);
  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...negro);
  doc.text('LÍQUIDO A PAGAR', m, y);
  doc.text(clp(calc.liquido), m + cw, y, { align: 'right' });
  y += 4;
  doc.setLineWidth(0.5);
  doc.line(m, y, m + cw, y);
  y += 8;

  // Info adicional
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...gris);
  doc.text(
    `Base imponible AFP/Salud: ${clp(trabajador.sueldo)}   ·   Costo total empresa: ${clp(calc.costoEmp)}`,
    pw / 2, y, { align: 'center' }
  );
  y += 22;

  // ── FIRMAS ──
  const sw = (cw - 20) / 2;

  doc.setDrawColor(...negro);
  doc.setLineWidth(0.4);
  doc.line(m, y, m + sw, y);
  doc.line(m + sw + 20, y, m + sw + 20 + sw, y);

  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...gris);
  doc.text('Firma Empleador', m + sw / 2, y, { align: 'center' });
  doc.text('Firma Trabajador', m + sw + 20 + sw / 2, y, { align: 'center' });

  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...negro);
  doc.text(sesion.nombre, m + sw / 2, y, { align: 'center', maxWidth: sw });
  doc.text(trabajador.nombre, m + sw + 20 + sw / 2, y, { align: 'center', maxWidth: sw });

  y += 6;
  doc.setFontSize(8);
  doc.setTextColor(...gris);
  doc.text(`RUT: ${sesion.empresa}`, m + sw / 2, y, { align: 'center' });
  doc.text(`RUT: ${trabajador.rut}`, m + sw + 20 + sw / 2, y, { align: 'center' });

  // ── Pie de página ──
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...gris);
  doc.text('Generado por Tributario 360', pw / 2, ph - 10, { align: 'center' });

  const nombre = trabajador.nombre.replace(/\s+/g, '_');
  doc.save(`Liquidacion_${nombre}_${mesLabel.replace(/\s+/g, '_')}.pdf`);
}

function calcular(t) {
  const afpTasa   = AFP_TASA[t.afp] ?? 0.1127;
  const saludTasa = t.salud === 'Fonasa' ? 0.07 : 0.07;
  const cesantia  = 0.006;
  const descAfp   = Math.round(t.sueldo * afpTasa);
  const descSalud = Math.round(t.sueldo * saludTasa);
  const descCes   = Math.round(t.sueldo * cesantia);
  const totalDesc = descAfp + descSalud + descCes;
  const liquido   = t.sueldo - totalDesc;
  const costoEmp  = Math.round(t.sueldo * 0.0236) + Math.round(t.sueldo * 0.0066) + t.sueldo; // SIS + cesantia empleador
  return { descAfp, descSalud, descCes, totalDesc, liquido, costoEmp };
}

export default function Remuneraciones({ sesion }) {
  const [trabajadores, setTrabajadores] = useState(TRABAJADORES_BASE);
  const [sel, setSel] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({ nombre:'', rut:'', cargo:'', sueldo:'', afp:'Habitat', salud:'Fonasa' });

  const mes = new Date().toLocaleDateString('es-CL',{month:'long',year:'numeric'});
  const totalPlanilla = trabajadores.reduce((a,t)=>a+t.sueldo,0);
  const totalCostoEmp = trabajadores.reduce((a,t)=>a+calcular(t).costoEmp,0);
  const totalLiquido  = trabajadores.reduce((a,t)=>a+calcular(t).liquido,0);

  function agregar() {
    if (!form.nombre || !form.sueldo) return;
    setTrabajadores(p=>[...p,{...form,sueldo:parseInt(form.sueldo)||0}]);
    setForm({ nombre:'',rut:'',cargo:'',sueldo:'',afp:'Habitat',salud:'Fonasa' });
    setMostrarForm(false);
  }

  const selData = sel !== null ? trabajadores[sel] : null;
  const selCalc = selData ? calcular(selData) : null;

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div>
          <h1 style={s.titulo}>Remuneraciones</h1>
          <p style={s.sub}>Liquidaciones {mes} · {trabajadores.length} trabajadores</p>
        </div>
        <button style={s.btnAdd} onClick={()=>setMostrarForm(v=>!v)}>
          {mostrarForm?'✕ Cancelar':'+ Agregar trabajador'}
        </button>
      </div>

      <div style={s.kpiGrid}>
        <div style={s.kpi}><p style={s.kpiLabel}>Total planilla bruta</p><p style={s.kpiValor}>{clp(totalPlanilla)}</p></div>
        <div style={s.kpi}><p style={s.kpiLabel}>Costo total empleador</p><p style={{...s.kpiValor,color:'#FF4D6A'}}>{clp(totalCostoEmp)}</p><p style={s.kpiSub}>Inc. SIS + cesantía empleador</p></div>
        <div style={s.kpi}><p style={s.kpiLabel}>Total líquido a pagar</p><p style={{...s.kpiValor,color:'#00C896'}}>{clp(totalLiquido)}</p></div>
      </div>

      <div style={s.tipBox}>
        <span style={s.tipIcon}>★</span>
        <div>
          <p style={s.tipText}><strong>Optimización:</strong> La planilla de remuneraciones es gasto tributario para la empresa. Considera gratificación legal (25% de remuneraciones o 4.75 IMM), ya que es deducible. El pago de AFP y salud reduce la base del trabajador pero no la de la empresa.</p>
        </div>
      </div>

      {mostrarForm && (
        <div style={s.formCard}>
          <p style={s.formTitle}>Nuevo trabajador</p>
          <div style={s.formGrid}>
            <div style={s.campo}><label style={s.label}>Nombre</label><input style={s.input} value={form.nombre} onChange={e=>setForm(p=>({...p,nombre:e.target.value}))} placeholder="Nombre completo"/></div>
            <div style={s.campo}><label style={s.label}>RUT</label><input style={s.input} value={form.rut} onChange={e=>setForm(p=>({...p,rut:e.target.value}))} placeholder="14.xxx.xxx-x"/></div>
            <div style={s.campo}><label style={s.label}>Cargo</label><input style={s.input} value={form.cargo} onChange={e=>setForm(p=>({...p,cargo:e.target.value}))} placeholder="Cargo"/></div>
            <div style={s.campo}><label style={s.label}>Sueldo bruto</label><input style={s.input} type="number" value={form.sueldo} onChange={e=>setForm(p=>({...p,sueldo:e.target.value}))} placeholder="0"/></div>
            <div style={s.campo}><label style={s.label}>AFP</label>
              <select style={s.input} value={form.afp} onChange={e=>setForm(p=>({...p,afp:e.target.value}))}>
                {Object.keys(AFP_TASA).map(a=><option key={a}>{a}</option>)}
              </select>
            </div>
            <div style={s.campo}><label style={s.label}>Salud</label>
              <select style={s.input} value={form.salud} onChange={e=>setForm(p=>({...p,salud:e.target.value}))}>
                <option>Fonasa</option><option>Isapre Cruz Blanca</option><option>Isapre Banmédica</option><option>Isapre Colmena</option>
              </select>
            </div>
          </div>
          <button style={s.btnGuardar} onClick={agregar}>Agregar</button>
        </div>
      )}

      <div style={s.listaGrid}>
        <div style={s.lista}>
          <p style={s.listaTitulo}>Trabajadores</p>
          {trabajadores.map((t,i)=>(
            <div key={i} style={{...s.listaItem,...(sel===i?s.listaItemActivo:{})}} onClick={()=>setSel(sel===i?null:i)}>
              <div style={s.listaAvatar}>{t.nombre.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
              <div style={s.listaInfo}>
                <p style={s.listaNombre}>{t.nombre}</p>
                <p style={s.listaCargo}>{t.cargo}</p>
              </div>
              <p style={s.listaSueldo}>{clp(t.sueldo)}</p>
            </div>
          ))}
        </div>

        {selData && selCalc && (
          <div style={s.liquidacion}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
              <p style={{...s.liquidTitle,margin:0}}>Liquidación — {selData.nombre}</p>
              <button style={s.btnPDF} onClick={()=>generarPDF(sesion,selData,selCalc)}>
                ↓ Descargar PDF
              </button>
            </div>
            <div style={s.liquidRow}><span style={s.liquidLabel}>Sueldo base</span><span style={s.liquidValor}>{clp(selData.sueldo)}</span></div>
            <div style={s.liquidSep}/>
            <div style={s.liquidRow}><span style={{...s.liquidLabel,color:'#FF4D6A'}}>(-) AFP {selData.afp}</span><span style={{...s.liquidValor,color:'#FF4D6A'}}>-{clp(selCalc.descAfp)}</span></div>
            <div style={s.liquidRow}><span style={{...s.liquidLabel,color:'#FF4D6A'}}>(-) Salud {selData.salud}</span><span style={{...s.liquidValor,color:'#FF4D6A'}}>-{clp(selCalc.descSalud)}</span></div>
            <div style={s.liquidRow}><span style={{...s.liquidLabel,color:'#FF4D6A'}}>(-) Cesantía trabajador</span><span style={{...s.liquidValor,color:'#FF4D6A'}}>-{clp(selCalc.descCes)}</span></div>
            <div style={s.liquidSep}/>
            <div style={s.liquidRow}><span style={{...s.liquidLabel,fontWeight:'700',color:'#00C896'}}>= Líquido a pagar</span><span style={{...s.liquidValor,fontWeight:'700',color:'#00C896',fontSize:'1.1rem'}}>{clp(selCalc.liquido)}</span></div>
            <div style={s.liquidSep}/>
            <div style={s.liquidRow}><span style={{...s.liquidLabel,color:'#7A8FA6'}}>Costo total empresa</span><span style={{...s.liquidValor,color:'#7A8FA6'}}>{clp(selCalc.costoEmp)}</span></div>
            <p style={s.liquidAFP}>AFP: {(AFP_TASA[selData.afp]*100).toFixed(2)}% · Salud: 7% · Cesantía: 0.6%</p>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  wrap:{maxWidth:'900px'},header:{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.5rem'},
  titulo:{fontFamily:"'Syne',sans-serif",fontWeight:'800',fontSize:'1.75rem',color:'#E8EDF2',letterSpacing:'-0.04em'},
  sub:{fontSize:'0.8rem',color:'#4A5A6A',marginTop:'0.3rem',fontFamily:"'DM Sans',sans-serif"},
  btnAdd:{padding:'0.6rem 1.2rem',backgroundColor:'#00C896',border:'none',WebkitAppearance:'none',borderRadius:'8px',color:'#0A0E14',fontFamily:"'DM Sans',sans-serif",fontWeight:'600',fontSize:'0.85rem',cursor:'pointer'},
  kpiGrid:{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem',marginBottom:'1.25rem'},
  kpi:{backgroundColor:'#111820',border:'1px solid #1E2D3D',borderRadius:'12px',padding:'1rem 1.25rem'},
  kpiLabel:{fontSize:'0.68rem',color:'#4A5A6A',textTransform:'uppercase',letterSpacing:'0.07em',fontFamily:"'DM Sans',sans-serif",fontWeight:'600',marginBottom:'0.35rem'},
  kpiValor:{fontFamily:"'Syne',sans-serif",fontWeight:'700',fontSize:'1.3rem',color:'#E8EDF2'},
  kpiSub:{fontSize:'0.7rem',color:'#4A5A6A',fontFamily:"'DM Sans',sans-serif",marginTop:'0.2rem'},
  tipBox:{display:'flex',gap:'0.7rem',backgroundColor:'rgba(245,166,35,0.07)',border:'1px solid rgba(245,166,35,0.2)',borderRadius:'10px',padding:'0.85rem 1rem',marginBottom:'1.25rem'},
  tipIcon:{color:'#F5A623',fontSize:'0.9rem',flexShrink:0,marginTop:'2px'},
  tipText:{fontSize:'0.82rem',color:'#C8B060',fontFamily:"'DM Sans',sans-serif",lineHeight:1.6},
  formCard:{backgroundColor:'#111820',border:'1px solid #1E2D3D',borderRadius:'14px',padding:'1.4rem',marginBottom:'1.25rem'},
  formTitle:{fontFamily:"'Syne',sans-serif",fontWeight:'700',fontSize:'0.95rem',color:'#E8EDF2',marginBottom:'1rem'},
  formGrid:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.9rem',marginBottom:'0.75rem'},
  campo:{display:'flex',flexDirection:'column',gap:'0.4rem'},
  label:{fontSize:'0.7rem',color:'#7A8FA6',fontFamily:"'DM Sans',sans-serif",fontWeight:'500',textTransform:'uppercase',letterSpacing:'0.05em'},
  input:{backgroundColor:'#0A0E14',border:'1px solid #1E2D3D',borderRadius:'8px',padding:'0.6rem 0.85rem',color:'#E8EDF2',fontFamily:"'DM Sans',sans-serif",fontSize:'0.875rem',outline:'none'},
  btnGuardar:{padding:'0.6rem 1.4rem',backgroundColor:'rgba(0,200,150,0.1)',border:'1px solid rgba(0,200,150,0.3)',WebkitAppearance:'none',borderRadius:'8px',color:'#00C896',fontFamily:"'DM Sans',sans-serif",fontWeight:'600',fontSize:'0.85rem',cursor:'pointer'},
  listaGrid:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'},
  lista:{backgroundColor:'#111820',border:'1px solid #1E2D3D',borderRadius:'14px',overflow:'hidden'},
  listaTitulo:{fontFamily:"'Syne',sans-serif",fontWeight:'700',fontSize:'0.88rem',color:'#E8EDF2',padding:'1rem 1.25rem',borderBottom:'1px solid #1E2D3D'},
  listaItem:{display:'flex',alignItems:'center',gap:'0.75rem',padding:'0.9rem 1.25rem',borderBottom:'1px solid #0D1520',cursor:'pointer',transition:'background 0.15s'},
  listaItemActivo:{backgroundColor:'rgba(0,200,150,0.06)',borderLeft:'2px solid #00C896'},
  listaAvatar:{width:'32px',height:'32px',borderRadius:'50%',backgroundColor:'#1A2D3D',border:'1px solid #1E2D3D',display:'flex',alignItems:'center',justifyContent:'center',color:'#7A8FA6',fontFamily:"'Syne',sans-serif",fontWeight:'700',fontSize:'0.7rem',flexShrink:0},
  listaInfo:{flex:1},
  listaNombre:{fontSize:'0.85rem',color:'#E8EDF2',fontFamily:"'DM Sans',sans-serif",fontWeight:'500'},
  listaCargo:{fontSize:'0.72rem',color:'#4A5A6A',fontFamily:"'DM Sans',sans-serif"},
  listaSueldo:{fontSize:'0.85rem',color:'#C8D8E8',fontFamily:"'Syne',sans-serif",fontWeight:'600'},
  liquidacion:{backgroundColor:'#111820',border:'1px solid #1E2D3D',borderRadius:'14px',padding:'1.4rem'},
  liquidTitle:{fontFamily:"'Syne',sans-serif",fontWeight:'700',fontSize:'0.9rem',color:'#E8EDF2',marginBottom:'1rem'},
  liquidRow:{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.4rem 0'},
  liquidLabel:{fontSize:'0.83rem',color:'#7A8FA6',fontFamily:"'DM Sans',sans-serif"},
  liquidValor:{fontSize:'0.9rem',color:'#C8D8E8',fontFamily:"'Syne',sans-serif",fontWeight:'600'},
  liquidSep:{height:'1px',backgroundColor:'#1A2535',margin:'0.5rem 0'},
  liquidAFP:{fontSize:'0.7rem',color:'#4A5A6A',fontFamily:"'DM Sans',sans-serif",marginTop:'0.75rem'},
  btnPDF:{padding:'0.45rem 1rem',backgroundColor:'rgba(0,200,150,0.12)',border:'1px solid rgba(0,200,150,0.35)',WebkitAppearance:'none',borderRadius:'8px',color:'#00C896',fontFamily:"'DM Sans',sans-serif",fontWeight:'600',fontSize:'0.8rem',cursor:'pointer'},
};
