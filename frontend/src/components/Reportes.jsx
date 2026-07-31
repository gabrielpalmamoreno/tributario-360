import React, { useState } from 'react';

function clp(v) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v);
}

const OBLIGACIONES = [
  { formulario: 'F29',  descripcion: 'Declaración IVA junio 2026',   vencimiento: '12/07/2026', estado: 'Pendiente', monto: null },
  { formulario: 'F29',  descripcion: 'Declaración IVA mayo 2026',    vencimiento: '12/06/2026', estado: 'Próximo',   monto: null },
  { formulario: 'F22',  descripcion: 'Renta AT 2026',                vencimiento: '30/04/2026', estado: 'Declarado', monto: 1240000 },
  { formulario: 'F29',  descripcion: 'Declaración IVA abril 2026',   vencimiento: '12/05/2026', estado: 'Pagado',    monto: 285400 },
  { formulario: 'F29',  descripcion: 'Declaración IVA marzo 2026',   vencimiento: '14/04/2026', estado: 'Pagado',    monto: 312700 },
  { formulario: 'F29',  descripcion: 'Declaración IVA febrero 2026', vencimiento: '12/03/2026', estado: 'Pagado',    monto: 198300 },
  { formulario: 'F50',  descripcion: 'Retención honorarios Q1 2026', vencimiento: '15/04/2026', estado: 'Pagado',    monto: 54200 },
];

const COLOR_ESTADO = {
  'Pendiente': { bg: 'rgba(245,166,35,0.1)',   color: '#F5A623' },
  'Próximo':   { bg: 'rgba(74,144,226,0.1)',   color: '#4A90E2' },
  'Declarado': { bg: 'rgba(0,200,150,0.1)',    color: '#00C896' },
  'Pagado':    { bg: 'rgba(0,200,150,0.08)',   color: '#00C896' },
  'Atrasado':  { bg: 'rgba(255,77,106,0.1)',   color: '#FF4D6A' },
};

const IVA_MENSUAL = [
  { mes: 'Ene', monto: 241000 },
  { mes: 'Feb', monto: 198300 },
  { mes: 'Mar', monto: 312700 },
  { mes: 'Abr', monto: 285400 },
  { mes: 'May', monto: 0 },
  { mes: 'Jun', monto: 0 },
];
const maxMonto = Math.max(...IVA_MENSUAL.map(m => m.monto), 1);

export default function Reportes() {
  const [filtro, setFiltro] = useState('Todos');
  const filtros = ['Todos', 'Pendiente', 'Próximo', 'Pagado', 'Declarado'];

  const ivaTotalPagado = IVA_MENSUAL.reduce((a, m) => a + m.monto, 0);
  const declaracionesPagadas = OBLIGACIONES.filter(o => o.estado === 'Pagado' || o.estado === 'Declarado').length;
  const pendientes = OBLIGACIONES.filter(o => o.estado === 'Pendiente' || o.estado === 'Próximo').length;

  const filtradas = filtro === 'Todos' ? OBLIGACIONES : OBLIGACIONES.filter(o => o.estado === filtro);

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <h1 style={s.titulo}>Reportes</h1>
        <p style={s.sub}>Resumen tributario 2026</p>
      </div>

      {/* Resumen */}
      <div style={s.kpiGrid}>
        <div style={s.kpi}>
          <p style={s.kpiLabel}>IVA pagado 2026</p>
          <p style={s.kpiValor}>{clp(ivaTotalPagado)}</p>
          <p style={s.kpiSub}>Enero — Abril</p>
        </div>
        <div style={s.kpi}>
          <p style={s.kpiLabel}>Declaraciones al día</p>
          <p style={{ ...s.kpiValor, color: '#00C896' }}>{declaracionesPagadas}</p>
          <p style={s.kpiSub}>De {OBLIGACIONES.length} totales</p>
        </div>
        <div style={s.kpi}>
          <p style={s.kpiLabel}>Obligaciones pendientes</p>
          <p style={{ ...s.kpiValor, color: pendientes > 0 ? '#F5A623' : '#00C896' }}>{pendientes}</p>
          <p style={s.kpiSub}>F29 mayo + junio</p>
        </div>
        <div style={s.kpi}>
          <p style={s.kpiLabel}>Próximo vencimiento</p>
          <p style={{ ...s.kpiValor, fontSize: '1.1rem', color: '#4A90E2' }}>12/06/2026</p>
          <p style={s.kpiSub}>F29 mayo 2026</p>
        </div>
      </div>

      {/* Gráfico IVA */}
      <div style={s.section}>
        <p style={s.sectionTitle}>IVA pagado por mes — 2026</p>
        <div style={s.barChart}>
          {IVA_MENSUAL.map(({ mes, monto }) => (
            <div key={mes} style={s.barCol}>
              <p style={s.barValor}>{monto > 0 ? clp(monto) : '—'}</p>
              <div style={s.barTrack}>
                <div style={{
                  ...s.barFill,
                  height: monto > 0 ? `${Math.round((monto / maxMonto) * 100)}%` : '3px',
                  backgroundColor: monto > 0 ? '#00C896' : '#1E2D3D',
                }} />
              </div>
              <p style={s.barLabel}>{mes}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Calendario de obligaciones */}
      <div style={s.section}>
        <div style={s.tableTop}>
          <p style={s.sectionTitle}>Calendario de obligaciones</p>
          <div style={s.filtros}>
            {filtros.map(f => (
              <button
                key={f}
                style={{ ...s.filtroBtn, ...(filtro === f ? s.filtroBtnActivo : {}) }}
                onClick={() => setFiltro(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div style={s.tabla}>
          <div style={s.tablaHeader}>
            <span>Formulario</span><span>Descripción</span><span>Vencimiento</span><span>Monto</span><span>Estado</span>
          </div>
          {filtradas.map((o, i) => {
            const est = COLOR_ESTADO[o.estado] ?? COLOR_ESTADO['Pendiente'];
            return (
              <div key={i} style={s.tablaFila}>
                <span style={s.formularioBadge}>{o.formulario}</span>
                <span style={s.tablaTexto}>{o.descripcion}</span>
                <span style={{ ...s.tablaTexto, color: '#7A8FA6' }}>{o.vencimiento}</span>
                <span style={{ ...s.tablaTexto, fontFamily: "'Montserrat', sans-serif", fontWeight: '600', color: o.monto ? '#E8EDF2' : '#4A5A6A' }}>
                  {o.monto ? clp(o.monto) : '—'}
                </span>
                <span style={{ ...s.estadoBadge, backgroundColor: est.bg, color: est.color }}>{o.estado}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const s = {
  wrap: { maxWidth: '920px' },
  header: { marginBottom: '1.75rem' },
  titulo: { fontFamily: "'Montserrat', sans-serif", fontWeight: '800', fontSize: '1.75rem', color: '#E8EDF2', letterSpacing: '-0.04em' },
  sub: { fontSize: '0.8rem', color: '#4A5A6A', marginTop: '0.3rem', fontFamily: "'Montserrat', sans-serif" },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' },
  kpi: { backgroundColor: '#111820', border: '1px solid #1E2D3D', borderRadius: '12px', padding: '1.2rem 1.4rem' },
  kpiLabel: { fontSize: '0.68rem', color: '#4A5A6A', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Montserrat', sans-serif", fontWeight: '600', marginBottom: '0.4rem' },
  kpiValor: { fontFamily: "'Montserrat', sans-serif", fontWeight: '800', fontSize: '1.3rem', color: '#E8EDF2', letterSpacing: '-0.03em' },
  kpiSub: { fontSize: '0.72rem', color: '#4A5A6A', fontFamily: "'Montserrat', sans-serif", marginTop: '0.2rem' },
  section: { backgroundColor: '#111820', border: '1px solid #1E2D3D', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.25rem' },
  sectionTitle: { fontFamily: "'Montserrat', sans-serif", fontWeight: '700', fontSize: '0.95rem', color: '#E8EDF2', marginBottom: '1.1rem' },
  barChart: { display: 'flex', gap: '0.75rem', alignItems: 'flex-end', height: '160px' },
  barCol: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' },
  barValor: { fontSize: '0.62rem', color: '#7A8FA6', fontFamily: "'Montserrat', sans-serif", marginBottom: '0.3rem', textAlign: 'center', whiteSpace: 'nowrap' },
  barTrack: { flex: 1, width: '100%', backgroundColor: '#0A0E14', borderRadius: '6px', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', borderRadius: '6px', transition: 'height 0.4s ease' },
  barLabel: { fontSize: '0.72rem', color: '#7A8FA6', fontFamily: "'Montserrat', sans-serif", marginTop: '0.4rem' },
  tableTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  filtros: { display: 'flex', gap: '0.4rem' },
  filtroBtn: { padding: '0.3rem 0.8rem', borderRadius: '20px', border: '1px solid #1E2D3D', backgroundColor: 'transparent', WebkitAppearance: 'none', color: '#7A8FA6', fontFamily: "'Montserrat', sans-serif", fontSize: '0.75rem', cursor: 'pointer' },
  filtroBtnActivo: { backgroundColor: 'rgba(0,200,150,0.1)', borderColor: 'rgba(0,200,150,0.3)', color: '#00C896' },
  tabla: { backgroundColor: '#0A0E14', borderRadius: '10px', overflow: 'hidden', border: '1px solid #1A2535' },
  tablaHeader: { display: 'grid', gridTemplateColumns: '0.7fr 2fr 1fr 1fr 0.8fr', padding: '0.65rem 1rem', borderBottom: '1px solid #1E2D3D', fontSize: '0.65rem', fontWeight: '600', color: '#4A5A6A', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif" },
  tablaFila: { display: 'grid', gridTemplateColumns: '0.7fr 2fr 1fr 1fr 0.8fr', padding: '0.85rem 1rem', borderBottom: '1px solid #111820', alignItems: 'center' },
  tablaTexto: { fontSize: '0.85rem', color: '#C8D8E8', fontFamily: "'Montserrat', sans-serif" },
  formularioBadge: { fontSize: '0.7rem', fontWeight: '700', color: '#4A90E2', backgroundColor: 'rgba(74,144,226,0.1)', padding: '2px 8px', borderRadius: '6px', fontFamily: "'Montserrat', sans-serif', textAlign: 'center'" },
  estadoBadge: { fontSize: '0.68rem', fontWeight: '600', padding: '3px 9px', borderRadius: '20px', fontFamily: "'Montserrat', sans-serif", textAlign: 'center' },
};
