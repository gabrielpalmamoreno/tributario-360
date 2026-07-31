import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

const HISTORIAL = [
  { periodo: 'Abril 2026',   folio: 'F29-2026-04', estado: 'Declarado', iva: 285400, fecha: '12/05/2026' },
  { periodo: 'Marzo 2026',   folio: 'F29-2026-03', estado: 'Declarado', iva: 312700, fecha: '14/04/2026' },
  { periodo: 'Febrero 2026', folio: 'F29-2026-02', estado: 'Declarado', iva: 198300, fecha: '12/03/2026' },
  { periodo: 'Enero 2026',   folio: 'F29-2026-01', estado: 'Declarado', iva: 241000, fecha: '12/02/2026' },
];

function clp(v) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v);
}

export default function FormularioF29() {
  const hoy = new Date();
  const [ventas, setVentas] = useState('');
  const [compras, setCompras] = useState('');

  const ventasNum = parseFloat(ventas.replace(/\./g, '').replace(',', '.')) || 0;
  const comprasNum = parseFloat(compras.replace(/\./g, '').replace(',', '.')) || 0;
  const debito = Math.round(ventasNum * 0.19);
  const credito = Math.round(comprasNum * 0.19);
  const ivaAPagar = Math.max(0, debito - credito);
  const mesDeclaracion = MESES[hoy.getMonth()];
  const anio = hoy.getFullYear();
  const vencimiento = `12/${String(hoy.getMonth() + 2).padStart(2,'0')}/${anio}`;

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div>
          <h1 style={s.titulo}>Formulario F29</h1>
          <p style={s.sub}>Declaración y pago mensual de IVA · Período: {mesDeclaracion} {anio}</p>
        </div>
        <div style={s.vencimientoBox}>
          <p style={s.vencLabel}>Vencimiento</p>
          <p style={s.vencFecha}>{vencimiento}</p>
        </div>
      </div>

      {/* Calculadora */}
      <div style={s.section}>
        <p style={s.sectionTitle}>Calculadora IVA del período</p>
        <div style={s.grid2}>
          <div style={s.campo}>
            <label style={s.label}>Ventas netas del mes (CLP)</label>
            <input
              style={s.input}
              type="number"
              placeholder="Ej: 5000000"
              value={ventas}
              onChange={e => setVentas(e.target.value)}
            />
          </div>
          <div style={s.campo}>
            <label style={s.label}>Compras netas del mes (CLP)</label>
            <input
              style={s.input}
              type="number"
              placeholder="Ej: 2000000"
              value={compras}
              onChange={e => setCompras(e.target.value)}
            />
          </div>
        </div>

        <div style={s.resumenGrid}>
          <div style={s.resumenItem}>
            <p style={s.resumenLabel}>IVA Débito (19%)</p>
            <p style={s.resumenValor}>{clp(debito)}</p>
          </div>
          <div style={s.resumenItem}>
            <p style={s.resumenLabel}>IVA Crédito (19%)</p>
            <p style={{ ...s.resumenValor, color: '#4A90E2' }}>{clp(credito)}</p>
          </div>
          <div style={{ ...s.resumenItem, ...s.resumenDestacado }}>
            <p style={s.resumenLabel}>IVA a pagar</p>
            <p style={{ ...s.resumenValor, color: ivaAPagar > 0 ? '#FF4D6A' : '#00C896', fontSize: '1.5rem' }}>
              {clp(ivaAPagar)}
            </p>
          </div>
        </div>

        <div style={s.acciones}>
          <a
            href="https://misiir.sii.cl"
            target="_blank"
            rel="noopener noreferrer"
            style={s.btnPrimario}
          >
            Declarar en Mi SII <ArrowRight size={15} />
          </a>
          <a
            href="https://homer.sii.cl"
            target="_blank"
            rel="noopener noreferrer"
            style={s.btnSecundario}
          >
            Portal SII
          </a>
        </div>
      </div>

      {/* Info códigos */}
      <div style={s.section}>
        <p style={s.sectionTitle}>Códigos principales F29</p>
        <div style={s.codigosGrid}>
          {[
            { cod: '20', desc: 'Ventas y/o servicios afectos' },
            { cod: '503', desc: 'IVA débito fiscal' },
            { cod: '521', desc: 'IVA crédito fiscal' },
            { cod: '89', desc: 'IVA determinado' },
            { cod: '595', desc: 'Remanente crédito fiscal' },
            { cod: '91', desc: 'Total a pagar' },
          ].map(({ cod, desc }) => (
            <div key={cod} style={s.codigoItem}>
              <span style={s.codigoBadge}>Cód. {cod}</span>
              <span style={s.codigoDesc}>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Historial */}
      <div style={s.section}>
        <p style={s.sectionTitle}>Historial de declaraciones</p>
        <div style={s.tabla}>
          <div style={s.tablaHeader}>
            <span>Período</span><span>Folio</span><span>IVA pagado</span><span>Fecha</span><span>Estado</span>
          </div>
          {HISTORIAL.map(h => (
            <div key={h.folio} style={s.tablaFila}>
              <span style={s.tablaTexto}>{h.periodo}</span>
              <span style={{ ...s.tablaTexto, color: '#4A5A6A', fontSize: '0.78rem' }}>{h.folio}</span>
              <span style={{ ...s.tablaTexto, fontFamily: "'Montserrat', sans-serif", fontWeight: '600' }}>{clp(h.iva)}</span>
              <span style={{ ...s.tablaTexto, color: '#7A8FA6' }}>{h.fecha}</span>
              <span style={s.estadoBadge}>{h.estado}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  wrap: { maxWidth: '860px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' },
  titulo: { fontFamily: "'Montserrat', sans-serif", fontWeight: '800', fontSize: '1.75rem', color: '#E8EDF2', letterSpacing: '-0.04em' },
  sub: { fontSize: '0.8rem', color: '#4A5A6A', marginTop: '0.3rem', fontFamily: "'Montserrat', sans-serif" },
  vencimientoBox: { backgroundColor: 'rgba(255,77,106,0.08)', border: '1px solid rgba(255,77,106,0.2)', borderRadius: '10px', padding: '0.75rem 1.2rem', textAlign: 'right' },
  vencLabel: { fontSize: '0.68rem', color: '#FF4D6A', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Montserrat', sans-serif", fontWeight: '600' },
  vencFecha: { fontFamily: "'Montserrat', sans-serif", fontWeight: '700', fontSize: '1.1rem', color: '#FF4D6A', marginTop: '0.1rem' },
  section: { backgroundColor: '#111820', border: '1px solid #1E2D3D', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.25rem' },
  sectionTitle: { fontFamily: "'Montserrat', sans-serif", fontWeight: '700', fontSize: '0.95rem', color: '#E8EDF2', marginBottom: '1.1rem', letterSpacing: '-0.01em' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' },
  campo: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.75rem', color: '#7A8FA6', fontFamily: "'Montserrat', sans-serif", fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' },
  input: { backgroundColor: '#0A0E14', border: '1px solid #1E2D3D', borderRadius: '8px', padding: '0.65rem 0.9rem', color: '#E8EDF2', fontFamily: "'Montserrat', sans-serif", fontSize: '0.9rem', outline: 'none' },
  resumenGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.25rem' },
  resumenItem: { backgroundColor: '#0A0E14', borderRadius: '10px', padding: '1rem', border: '1px solid #1A2535' },
  resumenDestacado: { border: '1px solid rgba(0,200,150,0.2)' },
  resumenLabel: { fontSize: '0.72rem', color: '#4A5A6A', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: "'Montserrat', sans-serif", marginBottom: '0.4rem' },
  resumenValor: { fontFamily: "'Montserrat', sans-serif", fontWeight: '700', fontSize: '1.2rem', color: '#00C896' },
  acciones: { display: 'flex', gap: '0.75rem' },
  btnPrimario: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.4rem', backgroundColor: '#00C896', borderRadius: '8px', color: '#0A0E14', fontFamily: "'Montserrat', sans-serif", fontWeight: '600', fontSize: '0.875rem', textDecoration: 'none', transition: 'opacity 0.15s' },
  btnSecundario: { display: 'inline-block', padding: '0.65rem 1.4rem', backgroundColor: 'transparent', border: '1px solid #1E2D3D', borderRadius: '8px', color: '#7A8FA6', fontFamily: "'Montserrat', sans-serif", fontWeight: '500', fontSize: '0.875rem', textDecoration: 'none' },
  codigosGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' },
  codigoItem: { display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.6rem 0.8rem', backgroundColor: '#0A0E14', borderRadius: '8px', border: '1px solid #1A2535' },
  codigoBadge: { fontSize: '0.72rem', fontWeight: '700', color: '#00C896', backgroundColor: 'rgba(0,200,150,0.1)', padding: '2px 8px', borderRadius: '6px', fontFamily: "'Montserrat', sans-serif", whiteSpace: 'nowrap' },
  codigoDesc: { fontSize: '0.8rem', color: '#7A8FA6', fontFamily: "'Montserrat', sans-serif" },
  tabla: { backgroundColor: '#0A0E14', borderRadius: '10px', overflow: 'hidden', border: '1px solid #1A2535' },
  tablaHeader: { display: 'grid', gridTemplateColumns: '1fr 1.4fr 1fr 0.8fr 0.7fr', padding: '0.65rem 1rem', borderBottom: '1px solid #1E2D3D', fontSize: '0.68rem', fontWeight: '600', color: '#4A5A6A', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif" },
  tablaFila: { display: 'grid', gridTemplateColumns: '1fr 1.4fr 1fr 0.8fr 0.7fr', padding: '0.85rem 1rem', borderBottom: '1px solid #111820', alignItems: 'center' },
  tablaTexto: { fontSize: '0.85rem', color: '#C8D8E8', fontFamily: "'Montserrat', sans-serif" },
  estadoBadge: { fontSize: '0.68rem', fontWeight: '600', color: '#00C896', backgroundColor: 'rgba(0,200,150,0.1)', padding: '2px 8px', borderRadius: '20px', fontFamily: "'Montserrat', sans-serif", textAlign: 'center' },
};
