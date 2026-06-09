import React, { useEffect, useState } from 'react';
import TaxCard from './TaxCard.jsx';

function formatCLP(value) {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 2 }).format(value);
}

function formatDate(isoStr) {
  if (!isoStr) return '—';
  const [y, m, d] = isoStr.split('T')[0].split('-');
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}

export default function Dashboard({ onNavigate }) {
  const [indicadores, setIndicadores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/indicadores')
      .then((r) => r.json())
      .then((data) => {
        setIndicadores(data);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudo conectar con el backend');
        setLoading(false);
      });
  }, []);

  const today = new Date().toLocaleDateString('es-CL', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Dashboard</h1>
          <p style={styles.pageDate}>{today}</p>
        </div>
        <div style={styles.statusBadge}>
          <span style={styles.statusDot} />
          <span style={styles.statusText}>SII conectado</span>
        </div>
      </div>

      {error && (
        <div style={styles.errorBanner}>
          ⚠ {error} — inicia el backend con <code>cd backend && npm start</code>
        </div>
      )}

      {/* Grid de tarjetas */}
      <div style={styles.grid}>
        <TaxCard
          title="UF del día"
          value={indicadores ? formatCLP(indicadores.uf?.valor) : null}
          subtitle={indicadores ? `Actualizado ${formatDate(indicadores.uf?.fecha)}` : null}
          tag="Vigente"
          tagColor="green"
          icon="◈"
          loading={loading}
        />
        <TaxCard
          title="UTM"
          value={indicadores ? formatCLP(indicadores.utm?.valor) : null}
          subtitle={indicadores ? `Actualizado ${formatDate(indicadores.utm?.fecha)}` : null}
          tag="Mensual"
          tagColor="blue"
          icon="◉"
          loading={loading}
        />
        <TaxCard
          title="IVA"
          value={indicadores ? `${(indicadores.iva * 100).toFixed(0)}%` : null}
          subtitle="Tasa vigente Chile"
          tag="Fijo"
          tagColor="yellow"
          icon="▣"
          loading={loading}
        />
        <TaxCard
          title="F29 — Próximo vencimiento"
          value={indicadores ? formatDate(indicadores.proximoVencimientoF29 + 'T00:00:00') : null}
          subtitle="Declaración mensual IVA"
          tag="Próximo"
          tagColor="red"
          icon="◷"
          loading={loading}
        />
        <TaxCard
          title="Dólar observado"
          value={indicadores ? formatCLP(indicadores.dolar?.valor) : null}
          subtitle={indicadores ? `Actualizado ${formatDate(indicadores.dolar?.fecha)}` : null}
          tag="BCCh"
          tagColor="blue"
          icon="$"
          loading={loading}
        />
        <TaxCard
          title="Euro"
          value={indicadores ? formatCLP(indicadores.euro?.valor) : null}
          subtitle={indicadores ? `Actualizado ${formatDate(indicadores.euro?.fecha)}` : null}
          tag="BCCh"
          tagColor="blue"
          icon="€"
          loading={loading}
        />
      </div>

      {/* Sección inferior */}
      <div style={styles.infoSection}>
        <h2 style={styles.sectionTitle}>Agente Tributario IA</h2>
        <p style={styles.sectionText}>
          Consulta al agente sobre declaraciones, plazos, formularios F29/F22, boletas de honorarios y más.
          El agente tiene acceso a la normativa tributaria chilena actualizada.
        </p>
        <button style={styles.ctaButton} onClick={() => onNavigate?.('Agente IA')}>
          Consultar al agente →
        </button>
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
  },
  pageTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: '800',
    fontSize: '1.75rem',
    color: '#E8EDF2',
    letterSpacing: '-0.04em',
  },
  pageDate: {
    fontSize: '0.82rem',
    color: '#4A5A6A',
    marginTop: '0.3rem',
    fontFamily: "'DM Sans', sans-serif",
    textTransform: 'capitalize',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.4rem 0.9rem',
    borderRadius: '20px',
    backgroundColor: 'rgba(0,200,150,0.1)',
    border: '1px solid rgba(0,200,150,0.2)',
  },
  statusDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    backgroundColor: '#00C896',
    boxShadow: '0 0 6px #00C896',
  },
  statusText: {
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#00C896',
    fontFamily: "'DM Sans', sans-serif",
  },
  errorBanner: {
    backgroundColor: 'rgba(255,77,106,0.1)',
    border: '1px solid rgba(255,77,106,0.25)',
    borderRadius: '10px',
    padding: '0.85rem 1.2rem',
    color: '#FF4D6A',
    fontSize: '0.85rem',
    marginBottom: '1.5rem',
    fontFamily: "'DM Sans', sans-serif",
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  infoSection: {
    backgroundColor: '#111820',
    border: '1px solid #1E2D3D',
    borderRadius: '16px',
    padding: '1.75rem',
    marginTop: '0.5rem',
  },
  sectionTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: '700',
    fontSize: '1.1rem',
    color: '#E8EDF2',
    marginBottom: '0.6rem',
    letterSpacing: '-0.02em',
  },
  sectionText: {
    fontSize: '0.875rem',
    color: '#7A8FA6',
    lineHeight: '1.65',
    fontFamily: "'DM Sans', sans-serif",
    maxWidth: '560px',
    marginBottom: '1.2rem',
  },
  ctaButton: {
    padding: '0.65rem 1.4rem',
    backgroundColor: 'rgba(0,200,150,0.1)',
    border: '1px solid rgba(0,200,150,0.3)',
    borderRadius: '8px',
    color: '#00C896',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: '500',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
};
