import React, { useState } from 'react';
import { X, Lightbulb } from 'lucide-react';

function clp(v){return new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(v);}

const ACTIVOS_BASE = [
  { nombre:'Camión Nissan NPR 2023', categoria:'Vehículo',   valor:28000000, vidaUtil:7, adquisicion:'2023-03-15', deprecAcel:true  },
  { nombre:'Grúa torre 5T',          categoria:'Maquinaria',  valor:45000000, vidaUtil:10,adquisicion:'2022-08-01', deprecAcel:true  },
  { nombre:'Computadores oficina (3)',categoria:'Tecnología',  valor:2100000,  vidaUtil:3, adquisicion:'2024-01-10', deprecAcel:false },
  { nombre:'Mobiliario oficina',      categoria:'Mobiliario',  valor:980000,   vidaUtil:7, adquisicion:'2023-06-20', deprecAcel:false },
];

function calcDepreciacion(a) {
  const anios = (new Date() - new Date(a.adquisicion)) / (365.25*24*3600*1000);
  const vidaReal = a.deprecAcel ? Math.ceil(a.vidaUtil/3) : a.vidaUtil;
  const anualNormal = Math.round(a.valor / a.vidaUtil);
  const anualAcel   = Math.round(a.valor / vidaReal);
  const deprecAcum  = Math.min(a.valor, Math.round(anualAcel * anios));
  const valorLibros = Math.max(0, a.valor - deprecAcum);
  const deprecMes   = Math.round(anualAcel / 12);
  return { anualNormal, anualAcel, deprecAcum, valorLibros, deprecMes, vidaReal };
}

const CATEGORIAS = ['Vehículo','Maquinaria','Tecnología','Mobiliario','Edificio','Otro'];

export default function ActivosFijos({ sesion }) {
  const [activos, setActivos] = useState(ACTIVOS_BASE);
  const [mostrar, setMostrar] = useState(false);
  const [form, setForm] = useState({ nombre:'', categoria:'Maquinaria', valor:'', vidaUtil:'5', adquisicion:new Date().toISOString().split('T')[0], deprecAcel:true });

  const totalValor     = activos.reduce((a,x)=>a+x.valor,0);
  const totalDeprecAcum= activos.reduce((a,x)=>a+calcDepreciacion(x).deprecAcum,0);
  const totalLibros    = activos.reduce((a,x)=>a+calcDepreciacion(x).valorLibros,0);
  const deprecMensual  = activos.reduce((a,x)=>a+calcDepreciacion(x).deprecMes,0);

  function agregar() {
    if (!form.nombre || !form.valor) return;
    setActivos(p=>[...p,{...form,valor:parseInt(form.valor)||0,vidaUtil:parseInt(form.vidaUtil)||5}]);
    setMostrar(false);
  }

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div>
          <h1 style={s.titulo}>Activos Fijos</h1>
          <p style={s.sub}>Registro y depreciación · {activos.length} activos</p>
        </div>
        <button style={s.btnAdd} onClick={()=>setMostrar(v=>!v)}>
          {mostrar?<><X size={14}/> Cancelar</>:'+ Nuevo activo'}
        </button>
      </div>

      <div style={s.kpiGrid}>
        <div style={s.kpi}><p style={s.kpiLabel}>Valor total adquisición</p><p style={s.kpiValor}>{clp(totalValor)}</p></div>
        <div style={s.kpi}><p style={s.kpiLabel}>Depreciación acumulada</p><p style={{...s.kpiValor,color:'#FF4D6A'}}>{clp(totalDeprecAcum)}</p></div>
        <div style={s.kpi}><p style={s.kpiLabel}>Valor libros actual</p><p style={{...s.kpiValor,color:'#00C896'}}>{clp(totalLibros)}</p></div>
        <div style={s.kpi}><p style={s.kpiLabel}>Depreciación mensual</p><p style={{...s.kpiValor,color:'#F5A623'}}>{clp(deprecMensual)}</p><p style={s.kpiSub}>Gasto del período</p></div>
      </div>

      <div style={s.tipBox}>
        <span style={s.tipIcon}><Lightbulb size={16}/></span>
        <p style={s.tipText}><strong>Depreciación acelerada (Art. 31 N°5 bis LIR):</strong> Los contribuyentes de 1ª categoría pueden depreciar activos nuevos en 1/3 del tiempo normal. Esto adelanta el gasto tributario y reduce la base imponible en los primeros años. Ideal para activos de alto valor adquiridos antes del 31/12.</p>
      </div>

      {mostrar && (
        <div style={s.formCard}>
          <p style={s.formTitle}>Registrar activo fijo</p>
          <div style={s.formGrid}>
            <div style={s.campo}><label style={s.label}>Nombre del activo</label><input style={s.input} value={form.nombre} onChange={e=>setForm(p=>({...p,nombre:e.target.value}))} placeholder="Ej: Grúa horquilla"/></div>
            <div style={s.campo}><label style={s.label}>Categoría</label>
              <select style={s.input} value={form.categoria} onChange={e=>setForm(p=>({...p,categoria:e.target.value}))}>
                {CATEGORIAS.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={s.campo}><label style={s.label}>Valor adquisición (CLP)</label><input style={s.input} type="number" value={form.valor} onChange={e=>setForm(p=>({...p,valor:e.target.value}))} placeholder="0"/></div>
            <div style={s.campo}><label style={s.label}>Vida útil normal (años)</label><input style={s.input} type="number" value={form.vidaUtil} onChange={e=>setForm(p=>({...p,vidaUtil:e.target.value}))} placeholder="5"/></div>
            <div style={s.campo}><label style={s.label}>Fecha adquisición</label><input style={s.input} type="date" value={form.adquisicion} onChange={e=>setForm(p=>({...p,adquisicion:e.target.value}))}/></div>
            <div style={s.campo}>
              <label style={s.label}>Depreciación acelerada</label>
              <label style={s.checkLabel}>
                <input type="checkbox" checked={form.deprecAcel} onChange={e=>setForm(p=>({...p,deprecAcel:e.target.checked}))} style={{marginRight:'0.5rem'}}/>
                Aplicar 1/3 vida útil (recomendado)
              </label>
            </div>
          </div>
          <button style={s.btnGuardar} onClick={agregar}>Registrar activo</button>
        </div>
      )}

      <div style={s.tabla}>
        <div style={s.tablaHead}>
          <span>Activo</span><span>Categoría</span><span>Valor orig.</span><span>Depr. anual</span><span>Valor libros</span><span>Método</span>
        </div>
        {activos.map((a,i)=>{
          const d = calcDepreciacion(a);
          return (
            <div key={i} style={s.tablaFila}>
              <div>
                <p style={{...s.celda,color:'#E8EDF2',fontWeight:'500'}}>{a.nombre}</p>
                <p style={{...s.celda,color:'#4A5A6A',fontSize:'0.72rem'}}>{a.adquisicion}</p>
              </div>
              <span style={s.catBadge}>{a.categoria}</span>
              <span style={s.celda}>{clp(a.valor)}</span>
              <span style={{...s.celda,color:'#F5A623'}}>{clp(d.anualAcel)}</span>
              <span style={{...s.celda,color:'#00C896',fontFamily:"'Montserrat',sans-serif",fontWeight:'600'}}>{clp(d.valorLibros)}</span>
              <span style={{...s.metodoBadge,backgroundColor:a.deprecAcel?'rgba(0,200,150,0.1)':'rgba(74,144,226,0.1)',color:a.deprecAcel?'#00C896':'#4A90E2'}}>
                {a.deprecAcel?`Acelerada (${d.vidaReal}a)`:'Normal'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const s = {
  wrap:{maxWidth:'900px'},header:{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.5rem'},
  titulo:{fontFamily:"'Montserrat',sans-serif",fontWeight:'800',fontSize:'1.75rem',color:'#E8EDF2',letterSpacing:'-0.04em'},
  sub:{fontSize:'0.8rem',color:'#4A5A6A',marginTop:'0.3rem',fontFamily:"'Montserrat',sans-serif"},
  btnAdd:{padding:'0.6rem 1.2rem',backgroundColor:'#00C896',border:'none',WebkitAppearance:'none',borderRadius:'8px',color:'#0A0E14',fontFamily:"'Montserrat',sans-serif",fontWeight:'600',fontSize:'0.85rem',cursor:'pointer',display:'inline-flex',alignItems:'center',gap:'0.35rem'},
  kpiGrid:{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'0.85rem',marginBottom:'1.25rem'},
  kpi:{backgroundColor:'#111820',border:'1px solid #1E2D3D',borderRadius:'12px',padding:'1rem 1.1rem'},
  kpiLabel:{fontSize:'0.65rem',color:'#4A5A6A',textTransform:'uppercase',letterSpacing:'0.07em',fontFamily:"'Montserrat',sans-serif",fontWeight:'600',marginBottom:'0.35rem'},
  kpiValor:{fontFamily:"'Montserrat',sans-serif",fontWeight:'700',fontSize:'1.15rem',color:'#E8EDF2'},
  kpiSub:{fontSize:'0.68rem',color:'#4A5A6A',fontFamily:"'Montserrat',sans-serif",marginTop:'0.15rem'},
  tipBox:{display:'flex',gap:'0.7rem',backgroundColor:'rgba(245,166,35,0.07)',border:'1px solid rgba(245,166,35,0.2)',borderRadius:'10px',padding:'0.85rem 1rem',marginBottom:'1.25rem'},
  tipIcon:{color:'#F5A623',fontSize:'0.9rem',flexShrink:0,marginTop:'2px'},
  tipText:{fontSize:'0.82rem',color:'#C8B060',fontFamily:"'Montserrat',sans-serif",lineHeight:1.6},
  formCard:{backgroundColor:'#111820',border:'1px solid #1E2D3D',borderRadius:'14px',padding:'1.4rem',marginBottom:'1.25rem'},
  formTitle:{fontFamily:"'Montserrat',sans-serif",fontWeight:'700',fontSize:'0.95rem',color:'#E8EDF2',marginBottom:'1rem'},
  formGrid:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.9rem',marginBottom:'0.75rem'},
  campo:{display:'flex',flexDirection:'column',gap:'0.4rem'},
  label:{fontSize:'0.7rem',color:'#7A8FA6',fontFamily:"'Montserrat',sans-serif",fontWeight:'500',textTransform:'uppercase',letterSpacing:'0.05em'},
  input:{backgroundColor:'#0A0E14',border:'1px solid #1E2D3D',borderRadius:'8px',padding:'0.6rem 0.85rem',color:'#E8EDF2',fontFamily:"'Montserrat',sans-serif",fontSize:'0.875rem',outline:'none'},
  checkLabel:{fontSize:'0.82rem',color:'#7A8FA6',fontFamily:"'Montserrat',sans-serif",cursor:'pointer',display:'flex',alignItems:'center',paddingTop:'0.3rem'},
  btnGuardar:{padding:'0.6rem 1.4rem',backgroundColor:'rgba(0,200,150,0.1)',border:'1px solid rgba(0,200,150,0.3)',WebkitAppearance:'none',borderRadius:'8px',color:'#00C896',fontFamily:"'Montserrat',sans-serif",fontWeight:'600',fontSize:'0.85rem',cursor:'pointer'},
  tabla:{backgroundColor:'#111820',border:'1px solid #1E2D3D',borderRadius:'14px',overflow:'hidden'},
  tablaHead:{display:'grid',gridTemplateColumns:'2fr 0.9fr 1fr 1fr 1fr 1fr',padding:'0.65rem 1.1rem',borderBottom:'1px solid #1E2D3D',fontSize:'0.65rem',fontWeight:'600',color:'#4A5A6A',letterSpacing:'0.08em',textTransform:'uppercase',fontFamily:"'Montserrat',sans-serif"},
  tablaFila:{display:'grid',gridTemplateColumns:'2fr 0.9fr 1fr 1fr 1fr 1fr',padding:'0.85rem 1.1rem',borderBottom:'1px solid #0D1520',alignItems:'center'},
  celda:{fontSize:'0.83rem',color:'#C8D8E8',fontFamily:"'Montserrat',sans-serif"},
  catBadge:{fontSize:'0.68rem',fontWeight:'600',padding:'2px 8px',borderRadius:'6px',backgroundColor:'rgba(74,144,226,0.1)',color:'#4A90E2',fontFamily:"'Montserrat',sans-serif"},
  metodoBadge:{fontSize:'0.68rem',fontWeight:'600',padding:'2px 8px',borderRadius:'6px',fontFamily:"'Montserrat',sans-serif"},
};
