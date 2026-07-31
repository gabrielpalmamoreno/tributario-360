import React, { useEffect, useState } from 'react';

function fmt(val, tipo) {
  if (val === null || val === undefined) return '—';
  if (tipo === 'clp') return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 2 }).format(val);
  if (tipo === 'pct') return `${(val * 100).toFixed(0)}%`;
  return val;
}

function fmtFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
}

const FILAS = [
  { key: 'uf',    label: 'Unidad de Fomento (UF)',  tipo: 'clp', desc: 'Unidad reajustable usada en contratos y arriendos.' },
  { key: 'utm',   label: 'UTM',                     tipo: 'clp', desc: 'Unidad Tributaria Mensual. Base para multas y cálculos.' },
  { key: 'dolar', label: 'Dólar observado',          tipo: 'clp', desc: 'Tipo de cambio publicado por el Banco Central.' },
  { key: 'euro',  label: 'Euro',                     tipo: 'clp', desc: 'Tipo de cambio EUR/CLP del Banco Central.' },
  { key: 'iva',   label: 'IVA vigente',              tipo: 'pct', desc: 'Tasa general del Impuesto al Valor Agregado en Chile.' },
];

export default function Indicadores() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/indicadores')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={s.header}>
        <h1 style={s.titulo}>Indicadores Económicos</h1>
        <p style={s.sub}>Fuente: Banco Central de Chile · mindicador.cl</p>
      </div>

      <div style={s.tabla}>
        <div style={s.theader}>
          <span>Indicador</span>
          <span>Valor</span>
          <span>Última actualización</span>
        </div>
        {FILAS.map((fila) => {
          const item = data?.[fila.key];
          const valor = fila.key === 'iva' ? data?.iva : item?.valor;
          const fecha = fila.key === 'iva' ? null : item?.fecha;
          return (
            <div key={fila.key} style={s.fila}>
              <div>
                <p style={s.filaLabel}>{fila.label}</p>
                <p style={s.filaDesc}>{fila.desc}</p>
              </div>
              <p style={s.filaValor}>
                {loading ? <span style={s.skel} /> : fmt(valor, fila.tipo)}
              </p>
              <p style={s.filaFecha}>
                {loading ? <span style={s.skel} /> : (fecha ? fmtFecha(fecha) : 'Permanente')}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const s = {
  header: { marginBottom: '2rem' },
  titulo: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '800',
    fontSize: '1.75rem',
    color: '#E8EDF2',
    letterSpacing: '-0.04em',
  },
  sub: {
    fontSize: '0.8rem',
    color: '#4A5A6A',
    marginTop: '0.3rem',
    fontFamily: "'Montserrat', sans-serif",
  },
  tabla: {
    backgroundColor: '#111820',
    border: '1px solid #1E2D3D',
    borderRadius: '14px',
    overflow: 'hidden',
  },
  theader: {
    display: 'grid',
    gridTemplateColumns: '1fr 160px 180px',
    padding: '0.75rem 1.5rem',
    borderBottom: '1px solid #1E2D3D',
    fontSize: '0.7rem',
    fontWeight: '600',
    color: '#4A5A6A',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontFamily: "'Montserrat', sans-serif",
  },
  fila: {
    display: 'grid',
    gridTemplateColumns: '1fr 160px 180px',
    padding: '1.1rem 1.5rem',
    borderBottom: '1px solid #1A2535',
    alignItems: 'center',
    transition: 'background 0.15s',
  },
  filaLabel: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#E8EDF2',
    fontFamily: "'Montserrat', sans-serif",
  },
  filaDesc: {
    fontSize: '0.75rem',
    color: '#4A5A6A',
    marginTop: '0.2rem',
    fontFamily: "'Montserrat', sans-serif",
  },
  filaValor: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '700',
    fontSize: '1.05rem',
    color: '#00C896',
    letterSpacing: '-0.02em',
  },
  filaFecha: {
    fontSize: '0.8rem',
    color: '#7A8FA6',
    fontFamily: "'Montserrat', sans-serif",
  },
  skel: {
    display: 'inline-block',
    width: '80px',
    height: '14px',
    backgroundColor: '#1E2D3D',
    borderRadius: '4px',
  },
};
