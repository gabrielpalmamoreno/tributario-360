import React from 'react';
import { LayoutDashboard, Receipt, ShoppingCart, Wallet, Package, Lightbulb, Bot, LogOut } from 'lucide-react';

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: Receipt, label: 'Libro de Ventas' },
  { icon: ShoppingCart, label: 'Libro de Compras' },
  { icon: Wallet, label: 'Remuneraciones' },
  { icon: Package, label: 'Activos Fijos' },
  { icon: Lightbulb, label: 'Optimización Fiscal' },
  { icon: Bot, label: 'Agente Tributario' },
];

export default function ClientSidebar({ activeView, setActiveView, sesion, onLogout }) {
  const iniciales = sesion.nombre.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase();

  return (
    <aside style={s.sidebar}>
      <div style={s.logo}>
        <span style={s.logoMark}>T</span>
        <span style={s.logoText}>Tributario<span style={s.accent}>360</span></span>
      </div>

      <div style={s.empresaBox}>
        <p style={s.empresaLabel}>Empresa</p>
        <p style={s.empresaNombre}>{sesion.nombre}</p>
        <p style={s.empresaRut}>{sesion.empresa}</p>
        <span style={s.regimenBadge}>{sesion.regimen}</span>
      </div>

      <nav style={s.nav}>
        <p style={s.navLabel}>MÓDULOS</p>
        {NAV.map(item => (
          <button
            key={item.label}
            style={{
              ...s.navItem,
              ...(activeView === item.label ? s.navItemActivo : {}),
              ...(item.label === 'Optimización Fiscal' ? s.navItemEstrella : {}),
              ...(activeView === item.label && item.label === 'Optimización Fiscal' ? s.navItemEstrellaActivo : {}),
            }}
            onClick={() => setActiveView(item.label)}
          >
            <span style={s.navIcon}><item.icon size={15} /></span>
            <span>{item.label}</span>
            {activeView === item.label && <span style={s.navDot} />}
          </button>
        ))}
      </nav>

      <div style={s.footer}>
        <div style={s.avatar}>{iniciales}</div>
        <div style={s.footerInfo}>
          <p style={s.footerNombre}>{sesion.nombre.split(' ')[0]}</p>
          <p style={s.footerRol}>Cliente</p>
        </div>
        <button style={s.logoutBtn} onClick={onLogout} title="Cerrar sesión"><LogOut size={16} /></button>
      </div>
    </aside>
  );
}

const s = {
  sidebar: { width: '240px', minWidth: '240px', height: '100vh', backgroundColor: '#0D1520', borderRight: '1px solid #1A2535', display: 'flex', flexDirection: 'column', padding: '1.5rem 0' },
  logo: { display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0 1.25rem', marginBottom: '1.25rem' },
  logoMark: { width: '30px', height: '30px', borderRadius: '8px', backgroundColor: '#00C896', color: '#0A0E14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Montserrat', sans-serif", fontWeight: '800', fontSize: '0.9rem', flexShrink: 0, lineHeight: '30px', textAlign: 'center' },
  logoText: { fontFamily: "'Montserrat', sans-serif", fontWeight: '700', fontSize: '1rem', color: '#E8EDF2', letterSpacing: '-0.02em' },
  accent: { color: '#00C896' },
  empresaBox: { margin: '0 0.75rem 1.25rem', backgroundColor: '#111820', border: '1px solid #1E2D3D', borderRadius: '10px', padding: '0.85rem 0.9rem' },
  empresaLabel: { fontSize: '0.62rem', color: '#4A5A6A', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Montserrat', sans-serif", marginBottom: '0.3rem' },
  empresaNombre: { fontSize: '0.8rem', color: '#E8EDF2', fontFamily: "'Montserrat', sans-serif", fontWeight: '600', lineHeight: 1.3, marginBottom: '0.2rem' },
  empresaRut: { fontSize: '0.72rem', color: '#4A5A6A', fontFamily: "'Montserrat', sans-serif", marginBottom: '0.5rem' },
  regimenBadge: { fontSize: '0.65rem', fontWeight: '600', padding: '2px 8px', borderRadius: '20px', backgroundColor: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.2)', color: '#00C896', fontFamily: "'Montserrat', sans-serif" },
  nav: { flex: 1, padding: '0 0.75rem', display: 'flex', flexDirection: 'column', gap: '2px' },
  navLabel: { fontSize: '0.62rem', fontWeight: '600', color: '#4A5A6A', letterSpacing: '0.1em', padding: '0 0.5rem', marginBottom: '0.4rem', fontFamily: "'Montserrat', sans-serif" },
  navItem: { display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', WebkitAppearance: 'none', color: '#7A8FA6', fontFamily: "'Montserrat', sans-serif", fontSize: '0.875rem', fontWeight: '400', cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all 0.15s', position: 'relative' },
  navItemActivo: { backgroundColor: 'rgba(0,200,150,0.1)', color: '#00C896', fontWeight: '500' },
  navItemEstrella: { color: '#F5A623' },
  navItemEstrellaActivo: { backgroundColor: 'rgba(245,166,35,0.1)', color: '#F5A623' },
  navIcon: { display: 'flex', alignItems: 'center', opacity: 0.8 },
  navDot: { width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#00C896', marginLeft: 'auto' },
  footer: { display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '1rem 1.25rem', borderTop: '1px solid #1A2535', marginTop: 'auto' },
  avatar: { width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#1A2D3D', border: '1.5px solid #00C896', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00C896', fontFamily: "'Montserrat', sans-serif", fontWeight: '700', fontSize: '0.75rem', flexShrink: 0 },
  footerInfo: { flex: 1, minWidth: 0 },
  footerNombre: { fontSize: '0.82rem', fontWeight: '500', color: '#E8EDF2', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  footerRol: { fontSize: '0.68rem', color: '#4A5A6A' },
  logoutBtn: { background: 'none', border: 'none', WebkitAppearance: 'none', color: '#4A5A6A', cursor: 'pointer', padding: '4px', borderRadius: '6px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
};
