import React, { useState } from 'react';

function clp(v){return new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(v);}

const ESTRATEGIAS = [
  {
    id:1, titulo:'Depreciación acelerada de activos',
    ley:'Art. 31 N°5 bis LIR', ahorro:'Alto', categoria:'Activos',
    desc:'Deprecia activos nuevos en 1/3 del tiempo normal (Ley N°21.210). Un activo de $30M con vida útil 9 años se deprecia en 3 años → gasto anual $10M vs $3.3M normal. Ahorro impuesto 1ª categoría: hasta $1.75M/año.',
    pasos:['Adquirir activos nuevos antes del 31/12','Aplicar opción de depreciación acelerada en F22','Registrar en libro de activos fijos con método acelerado'],
    ahorroCLP: 1750000,
  },
  {
    id:2, titulo:'Régimen 14D PyME — tasa reducida 25%',
    ley:'Art. 14D LIR (Ley 21.210)', ahorro:'Muy alto', categoria:'Régimen',
    desc:'Empresas con ingresos anuales < UF 75.000 (~$3.040M) pueden acogerse al régimen PyME con tasa del 25% vs 27% del régimen general. Además, las utilidades retiradas se integran al Global Complementario con crédito del 25%, reduciendo la doble tributación.',
    pasos:['Verificar que ingresos < UF 75.000 anuales','Comunicar opción al SII antes del 30/04','Llevar contabilidad simplificada permitida'],
    ahorroCLP: 2000000,
  },
  {
    id:3, titulo:'Crédito tributario SENCE — capacitación',
    ley:'Ley 19.518 SENCE', ahorro:'Medio', categoria:'Laboral',
    desc:'Las empresas pueden descontar directamente del impuesto de 1ª categoría hasta el 1% de la planilla bruta anual en gastos de capacitación. Con planilla de $38.4M anuales, el crédito máximo es $384.000 de descuento directo al impuesto (no a la base).',
    pasos:['Contratar capacitaciones vía OTEC acreditada ante SENCE','Presentar liquidaciones de gastos ante SENCE','Descontar en línea 39 del F22'],
    ahorroCLP: 384000,
  },
  {
    id:4, titulo:'Donaciones con crédito tributario',
    ley:'Ley 19.885 / Ley Deporte / Ley Cultura', ahorro:'Medio', categoria:'Donaciones',
    desc:'Donaciones a instituciones acogidas a Ley 19.885 permiten crédito del 50% del monto donado contra el impuesto, con tope del 2% de la RLI. Una donación de $2M genera un crédito de $1M directamente contra el impuesto. Las donaciones a deporte y cultura tienen beneficios similares.',
    pasos:['Identificar institución con Certificado de Donataria','Hacer donación antes del 31/12','Registrar en código 785 del F22'],
    ahorroCLP: 1000000,
  },
  {
    id:5, titulo:'Diferir ingresos y anticipar gastos a fin de año',
    ley:'Principio devengado — Art. 29 LIR', ahorro:'Alto', categoria:'Planificación',
    desc:'Facturar servicios en enero en lugar de diciembre difiere el ingreso al año tributario siguiente (AT siguiente). Simultáneamente, adelantar compras de materiales, servicios y activos a diciembre aumenta el gasto del período. Efecto: reduce la base imponible del año en curso.',
    pasos:['Revisar contratos con clientes: ¿puede facturarse en enero?','Adelantar órdenes de compra a diciembre','Pagar remuneraciones de diciembre antes del 31/12'],
    ahorroCLP: 1500000,
  },
  {
    id:6, titulo:'Leasing en lugar de compra directa',
    ley:'Circular SII N°43/2003', ahorro:'Medio', categoria:'Activos',
    desc:'Con leasing financiero, el canon completo es gasto tributario (incluyendo la parte de capital). Con compra directa, solo se deduce la depreciación. Para un activo de $20M en leasing a 3 años, el gasto anual es ~$7.3M vs $2M-$3M por depreciación. Mayor deducción en los primeros años.',
    pasos:['Evaluar leasing vs compra para activos mayores a $5M','Negociar con banco o empresa de leasing','Registrar canon mensual como gasto en contabilidad'],
    ahorroCLP: 1200000,
  },
  {
    id:7, titulo:'Pérdidas tributarias — carry-forward ilimitado',
    ley:'Art. 31 N°3 LIR', ahorro:'Variable', categoria:'Planificación',
    desc:'Chile permite arrastrar pérdidas tributarias indefinidamente sin límite de años. Si la empresa tuvo pérdidas en años anteriores, estas se imputan contra las utilidades actuales antes de calcular el impuesto. No se pierden y no tienen plazo de vencimiento.',
    pasos:['Verificar registro histórico de pérdidas en AT anteriores','Imputar pérdidas en línea 6 del F22','Guardar documentación de respaldo de las pérdidas'],
    ahorroCLP: 0,
  },
  {
    id:8, titulo:'Honorarios a socios / dueños',
    ley:'Art. 31 N°6 LIR', ahorro:'Alto', categoria:'Estructura',
    desc:'Los honorarios pagados a socios o dueños que prestan servicios reales a la empresa son gasto deducible (con límite razonable según mercado). Reduce la base imponible de la empresa. El socio tributa por el honorario en su Global Complementario pero puede beneficiarse de tramo 0% o 4% si sus ingresos totales son bajos.',
    pasos:['Formalizar contrato de prestación de servicios entre socio y empresa','Emitir boletas de honorarios electrónicas al SII','Monto debe ser de mercado para el cargo'],
    ahorroCLP: 1800000,
  },
  {
    id:9, titulo:'Gastos rechazados — evitar impuesto 40%',
    ley:'Art. 21 LIR', ahorro:'Preventivo', categoria:'Cumplimiento',
    desc:'Los gastos que el SII rechaza quedan afectos a una tasa única del 40% (impuesto del artículo 21). Evitar gastos personales del dueño cargados a la empresa (restaurant, viajes personales, automóviles de uso personal) es crítico. La tasa del 40% supera cualquier beneficio.',
    pasos:['Separar gastos personales de los del negocio','Usar tarjeta empresarial solo para gastos del giro','Documentar el propósito comercial de cada gasto'],
    ahorroCLP: 0,
  },
  {
    id:10, titulo:'Reliquidación IGC — retención excesiva en honorarios',
    ley:'Art. 65 N°4 LIR', ahorro:'Medio', categoria:'Personal',
    desc:'Personas naturales con múltiples fuentes de honorarios tienen retención del 13.75% en cada boleta. Al reliquidar en el F22, si la renta total cae en tramo 0% o 4%, se recupera el exceso retenido. Para rentas anuales < $10.5M la tasa real es 0-4%, recuperando hasta el 10% retenido en exceso.',
    pasos:['Calcular renta anual total de todas las fuentes','Presentar F22 con todas las boletas del año','Declarar en operación renta para recibir devolución'],
    ahorroCLP: 800000,
  },
];

const CATEGORIAS_FILTRO = ['Todas','Activos','Régimen','Laboral','Donaciones','Planificación','Estructura','Cumplimiento','Personal'];
const AHORRO_COLOR = { 'Muy alto':'#00C896', 'Alto':'#4A90E2', 'Medio':'#F5A623', 'Variable':'#7A8FA6', 'Preventivo':'#FF4D6A' };

export default function OptimizacionFiscal({ sesion }) {
  const [catFiltro, setCatFiltro] = useState('Todas');
  const [expandido, setExpandido] = useState(null);
  const [rentaAnual, setRentaAnual] = useState('');
  const [regime, setRegime] = useState(sesion?.regimen ?? '14D PyME');

  const filtradas = catFiltro === 'Todas' ? ESTRATEGIAS : ESTRATEGIAS.filter(e=>e.categoria===catFiltro);
  const ahorroTotal = ESTRATEGIAS.filter(e=>e.ahorroCLP>0).reduce((a,e)=>a+e.ahorroCLP,0);

  const renta = parseInt(rentaAnual)||0;
  const impSinOpt  = renta > 0 ? Math.round(renta * (regime.includes('14D')?0.25:0.27)) : null;
  const impConOpt  = renta > 0 ? Math.round(Math.max(0,(renta - ahorroTotal*0.4)) * (regime.includes('14D')?0.25:0.27)) : null;
  const ahorroSim  = impSinOpt && impConOpt ? impSinOpt - impConOpt : null;

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div>
          <h1 style={s.titulo}>Optimización Fiscal</h1>
          <p style={s.sub}>Estrategias legales para reducir la carga tributaria · Chile 2026</p>
        </div>
        <div style={s.ahorroTotal}>
          <p style={s.ahorroLabel}>Ahorro potencial estimado</p>
          <p style={s.ahorroValor}>{clp(ahorroTotal)}</p>
          <p style={s.ahorroSub}>Aplicando todas las estrategias</p>
        </div>
      </div>

      <div style={s.disclaimer}>
        <span>⚖</span>
        <p style={s.disclaimerText}>Todas las estrategias están dentro del marco legal chileno vigente. La optimización fiscal aprovecha incentivos, vacíos y opciones expresamente contemplados en la Ley de Renta (LIR), Código Tributario y normativa SII. No constituye evasión tributaria.</p>
      </div>

      {/* Simulador */}
      <div style={s.simulador}>
        <p style={s.simTitle}>Simulador de ahorro</p>
        <div style={s.simGrid}>
          <div style={s.campo}>
            <label style={s.label}>Renta líquida imponible anual estimada</label>
            <input style={s.input} type="number" placeholder="Ej: 50000000" value={rentaAnual} onChange={e=>setRentaAnual(e.target.value)}/>
          </div>
          <div style={s.campo}>
            <label style={s.label}>Régimen tributario</label>
            <select style={s.input} value={regime} onChange={e=>setRegime(e.target.value)}>
              <option>14D PyME (25%)</option>
              <option>14A General (27%)</option>
            </select>
          </div>
          {impSinOpt && (
            <>
              <div style={s.simResultado}>
                <p style={s.simResultLabel}>Sin optimizar</p>
                <p style={{...s.simResultValor,color:'#FF4D6A'}}>{clp(impSinOpt)}</p>
              </div>
              <div style={s.simResultado}>
                <p style={s.simResultLabel}>Con estrategias</p>
                <p style={{...s.simResultValor,color:'#00C896'}}>{clp(impConOpt)}</p>
              </div>
              <div style={{...s.simResultado,...s.simResultadoDestacado}}>
                <p style={s.simResultLabel}>Ahorro estimado</p>
                <p style={{...s.simResultValor,color:'#F5A623',fontSize:'1.4rem'}}>{clp(ahorroSim)}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div style={s.filtrosRow}>
        {CATEGORIAS_FILTRO.map(c=>(
          <button key={c} style={{...s.filtroBtn,...(catFiltro===c?s.filtroBtnActivo:{})}} onClick={()=>setCatFiltro(c)}>{c}</button>
        ))}
      </div>

      {/* Estrategias */}
      <div style={s.estrategiasList}>
        {filtradas.map(e=>(
          <div key={e.id} style={s.estrategiaCard}>
            <div style={s.estrategiaHeader} onClick={()=>setExpandido(expandido===e.id?null:e.id)}>
              <div style={s.estrategiaLeft}>
                <span style={{...s.ahorroTag,backgroundColor:`${AHORRO_COLOR[e.ahorro]}18`,color:AHORRO_COLOR[e.ahorro],borderColor:`${AHORRO_COLOR[e.ahorro]}40`}}>
                  {e.ahorro}
                </span>
                <span style={s.catTag}>{e.categoria}</span>
                <p style={s.estrategiaTitulo}>{e.titulo}</p>
                <p style={s.estrategiaLey}>{e.ley}</p>
              </div>
              <div style={s.estrategiaRight}>
                {e.ahorroCLP > 0 && <p style={s.estrategiaAhorro}>~ {clp(e.ahorroCLP)}</p>}
                <span style={s.expandIcon}>{expandido===e.id?'▲':'▼'}</span>
              </div>
            </div>

            {expandido===e.id && (
              <div style={s.estrategiaBody}>
                <p style={s.estrategiaDesc}>{e.desc}</p>
                <div style={s.pasosWrap}>
                  <p style={s.pasosTitle}>Cómo aplicarlo:</p>
                  {e.pasos.map((p,i)=>(
                    <div key={i} style={s.pasoItem}>
                      <span style={s.pasoNum}>{i+1}</span>
                      <span style={s.pasoText}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  wrap:{maxWidth:'860px'},
  header:{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.25rem'},
  titulo:{fontFamily:"'Syne',sans-serif",fontWeight:'800',fontSize:'1.75rem',color:'#E8EDF2',letterSpacing:'-0.04em'},
  sub:{fontSize:'0.8rem',color:'#4A5A6A',marginTop:'0.3rem',fontFamily:"'DM Sans',sans-serif"},
  ahorroTotal:{backgroundColor:'rgba(0,200,150,0.08)',border:'1px solid rgba(0,200,150,0.2)',borderRadius:'12px',padding:'0.9rem 1.2rem',textAlign:'right'},
  ahorroLabel:{fontSize:'0.65rem',color:'#00C896',textTransform:'uppercase',letterSpacing:'0.08em',fontFamily:"'DM Sans',sans-serif",fontWeight:'600'},
  ahorroValor:{fontFamily:"'Syne',sans-serif",fontWeight:'800',fontSize:'1.4rem',color:'#00C896',letterSpacing:'-0.03em'},
  ahorroSub:{fontSize:'0.68rem',color:'#4A8A70',fontFamily:"'DM Sans',sans-serif",marginTop:'0.1rem'},
  disclaimer:{display:'flex',gap:'0.7rem',backgroundColor:'rgba(74,144,226,0.06)',border:'1px solid rgba(74,144,226,0.15)',borderRadius:'10px',padding:'0.85rem 1rem',marginBottom:'1.25rem',alignItems:'flex-start'},
  disclaimerText:{fontSize:'0.78rem',color:'#7AABF0',fontFamily:"'DM Sans',sans-serif",lineHeight:1.6},
  simulador:{backgroundColor:'#111820',border:'1px solid #1E2D3D',borderRadius:'14px',padding:'1.4rem',marginBottom:'1.25rem'},
  simTitle:{fontFamily:"'Syne',sans-serif",fontWeight:'700',fontSize:'0.95rem',color:'#E8EDF2',marginBottom:'1rem'},
  simGrid:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'0.85rem',alignItems:'flex-end'},
  campo:{display:'flex',flexDirection:'column',gap:'0.4rem'},
  label:{fontSize:'0.68rem',color:'#7A8FA6',fontFamily:"'DM Sans',sans-serif",fontWeight:'500',textTransform:'uppercase',letterSpacing:'0.05em'},
  input:{backgroundColor:'#0A0E14',border:'1px solid #1E2D3D',borderRadius:'8px',padding:'0.6rem 0.85rem',color:'#E8EDF2',fontFamily:"'DM Sans',sans-serif",fontSize:'0.875rem',outline:'none'},
  simResultado:{backgroundColor:'#0A0E14',border:'1px solid #1A2535',borderRadius:'10px',padding:'0.8rem 1rem'},
  simResultadoDestacado:{border:'1px solid rgba(245,166,35,0.3)'},
  simResultLabel:{fontSize:'0.65rem',color:'#4A5A6A',textTransform:'uppercase',letterSpacing:'0.07em',fontFamily:"'DM Sans',sans-serif",marginBottom:'0.3rem'},
  simResultValor:{fontFamily:"'Syne',sans-serif",fontWeight:'700',fontSize:'1.1rem',color:'#E8EDF2'},
  filtrosRow:{display:'flex',flexWrap:'wrap',gap:'0.4rem',marginBottom:'1.25rem'},
  filtroBtn:{padding:'0.35rem 0.85rem',borderRadius:'20px',border:'1px solid #1E2D3D',backgroundColor:'transparent',WebkitAppearance:'none',color:'#7A8FA6',fontFamily:"'DM Sans',sans-serif",fontSize:'0.78rem',cursor:'pointer'},
  filtroBtnActivo:{backgroundColor:'rgba(0,200,150,0.1)',borderColor:'rgba(0,200,150,0.3)',color:'#00C896'},
  estrategiasList:{display:'flex',flexDirection:'column',gap:'0.6rem'},
  estrategiaCard:{backgroundColor:'#111820',border:'1px solid #1E2D3D',borderRadius:'12px',overflow:'hidden'},
  estrategiaHeader:{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1.1rem 1.3rem',cursor:'pointer'},
  estrategiaLeft:{flex:1},
  estrategiaRight:{display:'flex',alignItems:'center',gap:'1rem',flexShrink:0,marginLeft:'1rem'},
  ahorroTag:{fontSize:'0.65rem',fontWeight:'700',padding:'2px 8px',borderRadius:'20px',border:'1px solid',fontFamily:"'DM Sans',sans-serif",marginRight:'0.5rem'},
  catTag:{fontSize:'0.65rem',color:'#4A5A6A',backgroundColor:'#1A2535',padding:'2px 8px',borderRadius:'20px',fontFamily:"'DM Sans',sans-serif",marginRight:'0.6rem'},
  estrategiaTitulo:{fontSize:'0.9rem',fontWeight:'600',color:'#E8EDF2',fontFamily:"'DM Sans',sans-serif",marginTop:'0.4rem'},
  estrategiaLey:{fontSize:'0.72rem',color:'#4A5A6A',fontFamily:"'DM Sans',sans-serif",marginTop:'0.15rem'},
  estrategiaAhorro:{fontSize:'0.82rem',fontWeight:'600',color:'#00C896',fontFamily:"'Syne',sans-serif"},
  expandIcon:{fontSize:'0.7rem',color:'#4A5A6A'},
  estrategiaBody:{padding:'0 1.3rem 1.2rem',borderTop:'1px solid #1A2535',paddingTop:'1rem'},
  estrategiaDesc:{fontSize:'0.84rem',color:'#C8D8E8',fontFamily:"'DM Sans',sans-serif",lineHeight:1.7,marginBottom:'1rem'},
  pasosWrap:{backgroundColor:'#0A0E14',borderRadius:'10px',padding:'0.9rem 1rem',border:'1px solid #1A2535'},
  pasosTitle:{fontSize:'0.7rem',color:'#4A5A6A',textTransform:'uppercase',letterSpacing:'0.07em',fontFamily:"'DM Sans',sans-serif",fontWeight:'600',marginBottom:'0.6rem'},
  pasoItem:{display:'flex',gap:'0.6rem',alignItems:'flex-start',marginBottom:'0.45rem'},
  pasoNum:{width:'18px',height:'18px',borderRadius:'50%',backgroundColor:'rgba(0,200,150,0.15)',color:'#00C896',fontSize:'0.65rem',fontWeight:'700',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:'1px'},
  pasoText:{fontSize:'0.82rem',color:'#7A8FA6',fontFamily:"'DM Sans',sans-serif",lineHeight:1.5},
};
