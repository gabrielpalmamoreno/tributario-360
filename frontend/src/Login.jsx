import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [rol, setRol] = useState('cliente');
  const [rut, setRut] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const CUENTAS = {
    admin:   { pass: 'admin123', nombre: 'Admin', empresa: null },
    '76.543.210-K': { pass: 'cliente1', nombre: 'Constructora Los Álamos SpA', empresa: '76.543.210-K', regimen: '14D PyME', giro: 'Construcción' },
    '12.345.678-9': { pass: 'cliente2', nombre: 'María González Rojas',        empresa: '12.345.678-9', regimen: 'Honorarios', giro: 'Servicios profesionales' },
    '89.012.345-6': { pass: 'cliente3', nombre: 'Comercial Tres Ríos Ltda.',   empresa: '89.012.345-6', regimen: '14A General', giro: 'Comercio al por menor' },
  };

  function ingresar() {
    const key = rol === 'admin' ? 'admin' : rut.trim();
    const cuenta = CUENTAS[key];
    if (!cuenta || cuenta.pass !== pass) {
      setError('RUT o contraseña incorrectos');
      return;
    }
    onLogin({ rol, ...cuenta });
  }

  return (
    <div style={s.bg}>
      <div style={s.card}>
        <div style={s.logoRow}>
          <span style={s.logoMark}>T</span>
          <span style={s.logoText}>Tributario<span style={s.accent}>360</span></span>
        </div>
        <p style={s.sub}>Sistema contable tributario chileno</p>

        <div style={s.rolTabs}>
          {['cliente','admin'].map(r => (
            <button key={r} style={{ ...s.rolBtn, ...(rol === r ? s.rolBtnActivo : {}) }} onClick={() => { setRol(r); setError(''); }}>
              {r === 'admin' ? 'Administrador' : 'Cliente'}
            </button>
          ))}
        </div>

        {rol === 'cliente' && (
          <div style={s.campo}>
            <label style={s.label}>RUT empresa</label>
            <input style={s.input} placeholder="76.543.210-K" value={rut} onChange={e => { setRut(e.target.value); setError(''); }} />
          </div>
        )}
        <div style={s.campo}>
          <label style={s.label}>Contraseña</label>
          <input style={s.input} type="password" placeholder="••••••••" value={pass} onChange={e => { setPass(e.target.value); setError(''); }} onKeyDown={e => e.key === 'Enter' && ingresar()} />
        </div>

        {error && <p style={s.error}>{error}</p>}
        <button style={s.btnLogin} onClick={ingresar}>Ingresar →</button>

        <div style={s.demoInfo}>
          <p style={s.demoTitle}>Cuentas demo</p>
          <p style={s.demoLine}>Admin: contraseña <code style={s.code}>admin123</code></p>
          <p style={s.demoLine}>Cliente: RUT <code style={s.code}>76.543.210-K</code> / pass <code style={s.code}>cliente1</code></p>
        </div>
      </div>
    </div>
  );
}

const s = {
  bg: { minHeight: '100vh', backgroundColor: '#0A0E14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" },
  card: { backgroundColor: '#111820', border: '1px solid #1E2D3D', borderRadius: '20px', padding: '2.5rem', width: '380px', display: 'flex', flexDirection: 'column', gap: '1rem' },
  logoRow: { display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' },
  logoMark: { width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#00C896', color: '#0A0E14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne', sans-serif", fontWeight: '800', fontSize: '1.1rem', lineHeight: '36px', textAlign: 'center' },
  logoText: { fontFamily: "'Syne', sans-serif", fontWeight: '700', fontSize: '1.2rem', color: '#E8EDF2', letterSpacing: '-0.02em' },
  accent: { color: '#00C896' },
  sub: { fontSize: '0.8rem', color: '#4A5A6A', marginTop: '-0.5rem' },
  rolTabs: { display: 'flex', backgroundColor: '#0A0E14', borderRadius: '10px', padding: '3px', gap: '3px' },
  rolBtn: { flex: 1, padding: '0.5rem', borderRadius: '7px', border: 'none', WebkitAppearance: 'none', backgroundColor: 'transparent', color: '#7A8FA6', fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.15s' },
  rolBtnActivo: { backgroundColor: '#151D27', color: '#E8EDF2', fontWeight: '600' },
  campo: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.72rem', color: '#7A8FA6', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' },
  input: { backgroundColor: '#0A0E14', border: '1px solid #1E2D3D', borderRadius: '9px', padding: '0.7rem 1rem', color: '#E8EDF2', fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.15s' },
  error: { color: '#FF4D6A', fontSize: '0.8rem', backgroundColor: 'rgba(255,77,106,0.08)', border: '1px solid rgba(255,77,106,0.2)', borderRadius: '8px', padding: '0.5rem 0.8rem' },
  btnLogin: { padding: '0.75rem', backgroundColor: '#00C896', border: 'none', WebkitAppearance: 'none', borderRadius: '10px', color: '#0A0E14', fontFamily: "'Syne', sans-serif", fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', marginTop: '0.25rem' },
  demoInfo: { backgroundColor: '#0A0E14', borderRadius: '10px', padding: '0.9rem', border: '1px solid #1A2535', marginTop: '0.25rem' },
  demoTitle: { fontSize: '0.7rem', color: '#4A5A6A', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' },
  demoLine: { fontSize: '0.78rem', color: '#7A8FA6', marginTop: '0.2rem' },
  code: { backgroundColor: '#1A2535', padding: '1px 5px', borderRadius: '4px', color: '#00C896', fontSize: '0.75rem' },
};
