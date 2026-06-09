import React, { useState } from 'react';

const CLIENTES_MOCK = [
  { rut: '76.543.210-K', nombre: 'Constructora Los Álamos SpA', giro: 'Construcción', regimen: 'Renta efectiva', estado: 'Al día', vencimiento: '12/06/2026' },
  { rut: '12.345.678-9', nombre: 'María González Rojas', giro: 'Servicios profesionales', regimen: 'Honorarios', estado: 'Al día', vencimiento: '12/06/2026' },
  { rut: '89.012.345-6', nombre: 'Comercial Tres Ríos Ltda.', giro: 'Comercio al por menor', regimen: 'Renta efectiva', estado: 'Pendiente', vencimiento: '12/06/2026' },
  { rut: '45.678.901-2', nombre: 'Inversiones El Roble SA', giro: 'Actividades financieras', regimen: 'Renta efectiva', estado: 'Al día', vencimiento: '12/06/2026' },
  { rut: '23.456.789-0', nombre: 'Pedro Soto Muñoz', giro: 'Transporte de carga', regimen: 'Renta presunta', estado: 'Al día', vencimiento: '12/06/2026' },
  { rut: '67.890.123-4', nombre: 'Clínica Dental Norte SPA', giro: 'Salud — odontología', regimen: 'Renta efectiva', estado: 'Atrasado', vencimiento: '12/05/2026' },
];

const ESTADOCOLOR = {
  'Al día':    { bg: 'rgba(0,200,150,0.1)',   color: '#00C896' },
  'Pendiente': { bg: 'rgba(245,166,35,0.1)',  color: '#F5A623' },
  'Atrasado':  { bg: 'rgba(255,77,106,0.1)', color: '#FF4D6A' },
};

export default function Clientes() {
  const [busqueda, setBusqueda] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nuevo, setNuevo] = useState({ rut: '', nombre: '', giro: '', regimen: 'Renta efectiva' });
  const [clientes, setClientes] = useState(CLIENTES_MOCK);

  const filtrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.rut.includes(busqueda) ||
    c.giro.toLowerCase().includes(busqueda.toLowerCase())
  );

  function agregarCliente() {
    if (!nuevo.rut || !nuevo.nombre) return;
    setClientes(prev => [...prev, { ...nuevo, estado: 'Al día', vencimiento: '12/07/2026' }]);
    setNuevo({ rut: '', nombre: '', giro: '', regimen: 'Renta efectiva' });
    setMostrarForm(false);
  }

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div>
          <h1 style={s.titulo}>Clientes</h1>
          <p style={s.sub}>{clientes.length} contribuyentes registrados</p>
        </div>
        <button style={s.btnAgregar} onClick={() => setMostrarForm(v => !v)}>
          {mostrarForm ? '✕ Cancelar' : '+ Nuevo cliente'}
        </button>
      </div>

      {/* Formulario nuevo cliente */}
      {mostrarForm && (
        <div style={s.formCard}>
          <p style={s.sectionTitle}>Agregar cliente</p>
          <div style={s.formGrid}>
            <div style={s.campo}>
              <label style={s.label}>RUT</label>
              <input style={s.input} placeholder="76.543.210-K" value={nuevo.rut} onChange={e => setNuevo(p => ({ ...p, rut: e.target.value }))} />
            </div>
            <div style={s.campo}>
              <label style={s.label}>Razón social</label>
              <input style={s.input} placeholder="Nombre o empresa" value={nuevo.nombre} onChange={e => setNuevo(p => ({ ...p, nombre: e.target.value }))} />
            </div>
            <div style={s.campo}>
              <label style={s.label}>Giro</label>
              <input style={s.input} placeholder="Ej: Comercio al por menor" value={nuevo.giro} onChange={e => setNuevo(p => ({ ...p, giro: e.target.value }))} />
            </div>
            <div style={s.campo}>
              <label style={s.label}>Régimen tributario</label>
              <select style={s.input} value={nuevo.regimen} onChange={e => setNuevo(p => ({ ...p, regimen: e.target.value }))}>
                <option>Renta efectiva</option>
                <option>Renta presunta</option>
                <option>Honorarios</option>
                <option>14 D (PyME)</option>
              </select>
            </div>
          </div>
          <button style={s.btnGuardar} onClick={agregarCliente}>Guardar cliente</button>
        </div>
      )}

      {/* Buscador */}
      <div style={s.buscadorWrap}>
        <span style={s.searchIcon}>⌕</span>
        <input
          style={s.buscador}
          placeholder="Buscar por nombre, RUT o giro..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <div style={s.tabla}>
        <div style={s.tablaHeader}>
          <span>RUT</span><span>Nombre / Empresa</span><span>Giro</span><span>Régimen</span><span>Próx. F29</span><span>Estado</span>
        </div>
        {filtrados.length === 0 ? (
          <div style={s.vacio}>No se encontraron clientes.</div>
        ) : filtrados.map(c => {
          const est = ESTADOCOLOR[c.estado] ?? ESTADOCOLOR['Al día'];
          return (
            <div key={c.rut} style={s.tablaFila}>
              <span style={{ ...s.tablaTexto, fontFamily: "'Syne', sans-serif", fontWeight: '600', fontSize: '0.82rem' }}>{c.rut}</span>
              <span style={{ ...s.tablaTexto, color: '#E8EDF2', fontWeight: '500' }}>{c.nombre}</span>
              <span style={{ ...s.tablaTexto, color: '#7A8FA6' }}>{c.giro}</span>
              <span style={{ ...s.tablaTexto, color: '#4A5A6A', fontSize: '0.78rem' }}>{c.regimen}</span>
              <span style={s.tablaTexto}>{c.vencimiento}</span>
              <span style={{ ...s.estadoBadge, backgroundColor: est.bg, color: est.color }}>{c.estado}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const s = {
  wrap: { maxWidth: '960px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
  titulo: { fontFamily: "'Syne', sans-serif", fontWeight: '800', fontSize: '1.75rem', color: '#E8EDF2', letterSpacing: '-0.04em' },
  sub: { fontSize: '0.8rem', color: '#4A5A6A', marginTop: '0.3rem', fontFamily: "'DM Sans', sans-serif" },
  btnAgregar: { padding: '0.6rem 1.2rem', backgroundColor: '#00C896', border: 'none', WebkitAppearance: 'none', borderRadius: '8px', color: '#0A0E14', fontFamily: "'DM Sans', sans-serif", fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' },
  formCard: { backgroundColor: '#111820', border: '1px solid #1E2D3D', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.25rem' },
  sectionTitle: { fontFamily: "'Syne', sans-serif", fontWeight: '700', fontSize: '0.95rem', color: '#E8EDF2', marginBottom: '1rem' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem', marginBottom: '1rem' },
  campo: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.72rem', color: '#7A8FA6', fontFamily: "'DM Sans', sans-serif", fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' },
  input: { backgroundColor: '#0A0E14', border: '1px solid #1E2D3D', borderRadius: '8px', padding: '0.65rem 0.9rem', color: '#E8EDF2', fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', outline: 'none' },
  btnGuardar: { padding: '0.6rem 1.4rem', backgroundColor: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.3)', WebkitAppearance: 'none', borderRadius: '8px', color: '#00C896', fontFamily: "'DM Sans', sans-serif", fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' },
  buscadorWrap: { position: 'relative', marginBottom: '1rem' },
  searchIcon: { position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#4A5A6A', fontSize: '1.1rem', pointerEvents: 'none' },
  buscador: { width: '100%', backgroundColor: '#111820', border: '1px solid #1E2D3D', borderRadius: '10px', padding: '0.75rem 1rem 0.75rem 2.4rem', color: '#E8EDF2', fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', outline: 'none' },
  tabla: { backgroundColor: '#111820', border: '1px solid #1E2D3D', borderRadius: '14px', overflow: 'hidden' },
  tablaHeader: { display: 'grid', gridTemplateColumns: '1fr 1.8fr 1.4fr 1.1fr 0.8fr 0.7fr', padding: '0.65rem 1.25rem', borderBottom: '1px solid #1E2D3D', fontSize: '0.65rem', fontWeight: '600', color: '#4A5A6A', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" },
  tablaFila: { display: 'grid', gridTemplateColumns: '1fr 1.8fr 1.4fr 1.1fr 0.8fr 0.7fr', padding: '1rem 1.25rem', borderBottom: '1px solid #0D1520', alignItems: 'center' },
  tablaTexto: { fontSize: '0.85rem', color: '#C8D8E8', fontFamily: "'DM Sans', sans-serif" },
  estadoBadge: { fontSize: '0.68rem', fontWeight: '600', padding: '3px 9px', borderRadius: '20px', fontFamily: "'DM Sans', sans-serif", textAlign: 'center' },
  vacio: { padding: '2rem', textAlign: 'center', color: '#4A5A6A', fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem' },
};
