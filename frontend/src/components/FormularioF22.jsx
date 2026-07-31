import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

function clp(v) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v);
}

const ANIOS = [2025, 2024, 2023, 2022];

const TRAMOS = [
  { desde: 0,        hasta: 874210,  tasa: '0%',   descripcion: 'Exento' },
  { desde: 874211,   hasta: 1944910, tasa: '4%',   descripcion: '1° tramo' },
  { desde: 1944911,  hasta: 3241510, tasa: '8%',   descripcion: '2° tramo' },
  { desde: 3241511,  hasta: 4538110, tasa: '13.5%', descripcion: '3° tramo' },
  { desde: 4538111,  hasta: 5835110, tasa: '23%',  descripcion: '4° tramo' },
  { desde: 5835111,  hasta: 7779810, tasa: '30.4%', descripcion: '5° tramo' },
  { desde: 7779811,  hasta: 10395610, tasa: '35%', descripcion: '6° tramo' },
  { desde: 10395611, hasta: Infinity, tasa: '40%', descripcion: '7° tramo' },
];

export default function FormularioF22() {
  const [anio, setAnio] = useState(2025);
  const [ingresos, setIngresos] = useState('');

  const ingresosNum = parseFloat(ingresos) || 0;
  const tramo = TRAMOS.find(t => ingresosNum >= t.desde && ingresosNum <= t.hasta) ?? TRAMOS[0];
  const tasaNum = parseFloat(tramo.tasa) / 100;
  const impuesto = Math.round(ingresosNum * tasaNum);

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div>
          <h1 style={s.titulo}>Formulario F22</h1>
          <p style={s.sub}>Declaración anual de impuesto a la renta · Año Tributario {anio + 1}</p>
        </div>
        <div style={s.plazoBox}>
          <p style={s.plazoLabel}>Plazo operación renta</p>
          <p style={s.plazoFecha}>30 Abril {anio + 1}</p>
        </div>
      </div>

      {/* Selector año */}
      <div style={s.anioSelector}>
        {ANIOS.map(a => (
          <button
            key={a}
            style={{ ...s.anioBtn, ...(anio === a ? s.anioBtnActivo : {}) }}
            onClick={() => setAnio(a)}
          >
            AT {a + 1}
          </button>
        ))}
      </div>

      {/* Estimador */}
      <div style={s.section}>
        <p style={s.sectionTitle}>Estimador de impuesto global complementario</p>
        <div style={s.campoRow}>
          <div style={s.campo}>
            <label style={s.label}>Renta líquida imponible anual (CLP)</label>
            <input
              style={s.input}
              type="number"
              placeholder="Ej: 18000000"
              value={ingresos}
              onChange={e => setIngresos(e.target.value)}
            />
          </div>
          <div style={s.tramoInfo}>
            <p style={s.tramoLabel}>Tramo aplicable</p>
            <p style={s.tramoTasa}>{tramo.tasa}</p>
            <p style={s.tramoDesc}>{tramo.descripcion}</p>
          </div>
          <div style={s.impuestoInfo}>
            <p style={s.tramoLabel}>Impuesto estimado</p>
            <p style={{ ...s.tramoTasa, color: impuesto > 0 ? '#FF4D6A' : '#00C896' }}>{clp(impuesto)}</p>
          </div>
        </div>
      </div>

      {/* Tramos */}
      <div style={s.section}>
        <p style={s.sectionTitle}>Tabla de tramos — Año Tributario {anio + 1}</p>
        <div style={s.tabla}>
          <div style={s.tablaHeader}>
            <span>Tramo</span><span>Renta desde</span><span>Renta hasta</span><span>Tasa</span>
          </div>
          {TRAMOS.map((t, i) => (
            <div
              key={i}
              style={{
                ...s.tablaFila,
                ...(tramo === t && ingresosNum > 0 ? s.tablaFilaActiva : {}),
              }}
            >
              <span style={s.tablaTexto}>{t.descripcion}</span>
              <span style={s.tablaTexto}>{clp(t.desde)}</span>
              <span style={s.tablaTexto}>{t.hasta === Infinity ? 'Sin límite' : clp(t.hasta)}</span>
              <span style={{ ...s.tablaTexto, fontWeight: '700', color: '#00C896', fontFamily: "'Montserrat', sans-serif" }}>{t.tasa}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Plazos */}
      <div style={s.section}>
        <p style={s.sectionTitle}>Plazos operación renta {anio + 1}</p>
        <div style={s.plazosGrid}>
          {[
            { fecha: `01 Mar ${anio + 1}`, evento: 'Inicio operación renta', color: '#4A90E2' },
            { fecha: `30 Abr ${anio + 1}`, evento: 'Plazo para declarar y pagar', color: '#F5A623' },
            { fecha: `30 Abr ${anio + 1}`, evento: 'Plazo devoluciones (si aplica)', color: '#00C896' },
          ].map(({ fecha, evento, color }) => (
            <div key={fecha + evento} style={s.plazoItem}>
              <span style={{ ...s.plazoBadge, color, borderColor: color, backgroundColor: `${color}15` }}>{fecha}</span>
              <span style={s.plazoEvento}>{evento}</span>
            </div>
          ))}
        </div>
        <div style={s.acciones}>
          <a href="https://www.sii.cl/servicios_online/1040-.html" target="_blank" rel="noopener noreferrer" style={s.btnPrimario}>
            Declarar en SII <ArrowRight size={15} />
          </a>
          <a href="https://www.sii.cl" target="_blank" rel="noopener noreferrer" style={s.btnSecundario}>
            Ver renta precargada
          </a>
        </div>
      </div>
    </div>
  );
}

const s = {
  wrap: { maxWidth: '860px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
  titulo: { fontFamily: "'Montserrat', sans-serif", fontWeight: '800', fontSize: '1.75rem', color: '#E8EDF2', letterSpacing: '-0.04em' },
  sub: { fontSize: '0.8rem', color: '#4A5A6A', marginTop: '0.3rem', fontFamily: "'Montserrat', sans-serif" },
  plazoBox: { backgroundColor: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: '10px', padding: '0.75rem 1.2rem', textAlign: 'right' },
  plazoLabel: { fontSize: '0.68rem', color: '#F5A623', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Montserrat', sans-serif", fontWeight: '600' },
  plazoFecha: { fontFamily: "'Montserrat', sans-serif", fontWeight: '700', fontSize: '1.1rem', color: '#F5A623', marginTop: '0.1rem' },
  anioSelector: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
  anioBtn: { padding: '0.45rem 1rem', borderRadius: '8px', border: '1px solid #1E2D3D', backgroundColor: 'transparent', WebkitAppearance: 'none', color: '#7A8FA6', fontFamily: "'Montserrat', sans-serif", fontSize: '0.82rem', cursor: 'pointer' },
  anioBtnActivo: { backgroundColor: 'rgba(0,200,150,0.1)', borderColor: 'rgba(0,200,150,0.3)', color: '#00C896', fontWeight: '600' },
  section: { backgroundColor: '#111820', border: '1px solid #1E2D3D', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.25rem' },
  sectionTitle: { fontFamily: "'Montserrat', sans-serif", fontWeight: '700', fontSize: '0.95rem', color: '#E8EDF2', marginBottom: '1.1rem' },
  campoRow: { display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', alignItems: 'flex-end' },
  campo: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.72rem', color: '#7A8FA6', fontFamily: "'Montserrat', sans-serif", fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' },
  input: { backgroundColor: '#0A0E14', border: '1px solid #1E2D3D', borderRadius: '8px', padding: '0.65rem 0.9rem', color: '#E8EDF2', fontFamily: "'Montserrat', sans-serif", fontSize: '0.9rem', outline: 'none' },
  tramoInfo: { backgroundColor: '#0A0E14', border: '1px solid #1A2535', borderRadius: '10px', padding: '0.85rem 1.1rem', textAlign: 'center', minWidth: '110px' },
  impuestoInfo: { backgroundColor: '#0A0E14', border: '1px solid #1A2535', borderRadius: '10px', padding: '0.85rem 1.1rem', textAlign: 'center', minWidth: '140px' },
  tramoLabel: { fontSize: '0.65rem', color: '#4A5A6A', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: "'Montserrat', sans-serif", marginBottom: '0.3rem' },
  tramoTasa: { fontFamily: "'Montserrat', sans-serif", fontWeight: '800', fontSize: '1.4rem', color: '#00C896' },
  tramoDesc: { fontSize: '0.72rem', color: '#7A8FA6', fontFamily: "'Montserrat', sans-serif", marginTop: '0.2rem' },
  tabla: { backgroundColor: '#0A0E14', borderRadius: '10px', overflow: 'hidden', border: '1px solid #1A2535' },
  tablaHeader: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 0.6fr', padding: '0.65rem 1rem', borderBottom: '1px solid #1E2D3D', fontSize: '0.68rem', fontWeight: '600', color: '#4A5A6A', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif" },
  tablaFila: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 0.6fr', padding: '0.75rem 1rem', borderBottom: '1px solid #111820', alignItems: 'center' },
  tablaFilaActiva: { backgroundColor: 'rgba(0,200,150,0.06)', borderLeft: '2px solid #00C896' },
  tablaTexto: { fontSize: '0.83rem', color: '#C8D8E8', fontFamily: "'Montserrat', sans-serif" },
  plazosGrid: { display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' },
  plazoItem: { display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.7rem 0.9rem', backgroundColor: '#0A0E14', borderRadius: '8px', border: '1px solid #1A2535' },
  plazoBadge: { fontSize: '0.75rem', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', border: '1px solid', fontFamily: "'Montserrat', sans-serif", whiteSpace: 'nowrap' },
  plazoEvento: { fontSize: '0.85rem', color: '#C8D8E8', fontFamily: "'Montserrat', sans-serif" },
  acciones: { display: 'flex', gap: '0.75rem' },
  btnPrimario: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.4rem', backgroundColor: '#00C896', borderRadius: '8px', color: '#0A0E14', fontFamily: "'Montserrat', sans-serif", fontWeight: '600', fontSize: '0.875rem', textDecoration: 'none' },
  btnSecundario: { display: 'inline-block', padding: '0.65rem 1.4rem', backgroundColor: 'transparent', border: '1px solid #1E2D3D', borderRadius: '8px', color: '#7A8FA6', fontFamily: "'Montserrat', sans-serif", fontWeight: '500', fontSize: '0.875rem', textDecoration: 'none' },
};
