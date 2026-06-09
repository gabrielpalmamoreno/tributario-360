import React from 'react';

export default function Placeholder({ titulo, descripcion }) {
  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <h1 style={s.titulo}>{titulo}</h1>
      </div>
      <div style={s.card}>
        <span style={s.icono}>◈</span>
        <p style={s.texto}>{descripcion}</p>
        <span style={s.tag}>Próximamente</span>
      </div>
    </div>
  );
}

const s = {
  wrap: { maxWidth: '600px' },
  header: { marginBottom: '2rem' },
  titulo: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: '800',
    fontSize: '1.75rem',
    color: '#E8EDF2',
    letterSpacing: '-0.04em',
  },
  card: {
    backgroundColor: '#111820',
    border: '1px solid #1E2D3D',
    borderRadius: '14px',
    padding: '2.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    textAlign: 'center',
  },
  icono: {
    fontSize: '2rem',
    color: '#1E2D3D',
  },
  texto: {
    fontSize: '0.9rem',
    color: '#7A8FA6',
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: '1.6',
    maxWidth: '380px',
  },
  tag: {
    fontSize: '0.72rem',
    fontWeight: '600',
    padding: '4px 12px',
    borderRadius: '20px',
    backgroundColor: 'rgba(0,200,150,0.1)',
    border: '1px solid rgba(0,200,150,0.2)',
    color: '#00C896',
    fontFamily: "'DM Sans', sans-serif",
  },
};
