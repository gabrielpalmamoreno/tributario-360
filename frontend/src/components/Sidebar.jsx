import React, { useState } from 'react';

const navItems = [
  { icon: '▦', label: 'Dashboard', active: true },
  { icon: '◈', label: 'Indicadores' },
  { icon: '◻', label: 'Formulario F29' },
  { icon: '◻', label: 'Formulario F22' },
  { icon: '◈', label: 'Agente IA' },
  { icon: '◻', label: 'Clientes' },
  { icon: '◻', label: 'Reportes' },
];

export default function Sidebar({ activeView, setActiveView, onLogout, rol }) {
  const active = activeView;

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <span style={styles.logoMark}>T</span>
        <span style={styles.logoText}>Tributario<span style={styles.logoAccent}>360</span></span>
      </div>

      <nav style={styles.nav}>
        <p style={styles.navLabel}>MENÚ</p>
        {navItems.map((item) => (
          <button
            key={item.label}
            style={{
              ...styles.navItem,
              ...(active === item.label ? styles.navItemActive : {}),
            }}
            onClick={() => setActiveView(item.label)}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
            {active === item.label && <span style={styles.navDot} />}
          </button>
        ))}
      </nav>

      <div style={styles.sidebarFooter}>
        <div style={styles.userAvatar}>G</div>
        <div style={{ flex: 1 }}>
          <p style={styles.userName}>Gabriel</p>
          <p style={styles.userRole}>{rol === 'admin' ? 'Admin' : 'Usuario'}</p>
        </div>
        {onLogout && (
          <button style={styles.logoutBtn} onClick={onLogout} title="Cerrar sesión">⏻</button>
        )}
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '240px',
    minWidth: '240px',
    height: '100vh',
    backgroundColor: '#0D1520',
    borderRight: '1px solid #1A2535',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem 0',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0 1.25rem',
    marginBottom: '2rem',
  },
  logoMark: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: '#00C896',
    color: '#0A0E14',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Syne', sans-serif",
    fontWeight: '800',
    fontSize: '1rem',
    flexShrink: 0,
    lineHeight: '32px',
    textAlign: 'center',
  },
  logoText: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: '700',
    fontSize: '1.05rem',
    color: '#E8EDF2',
    letterSpacing: '-0.02em',
  },
  logoAccent: {
    color: '#00C896',
  },
  nav: {
    flex: 1,
    padding: '0 0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  navLabel: {
    fontSize: '0.65rem',
    fontWeight: '600',
    color: '#4A5A6A',
    letterSpacing: '0.1em',
    padding: '0 0.5rem',
    marginBottom: '0.5rem',
    marginTop: '0.25rem',
    fontFamily: "'DM Sans', sans-serif",
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    padding: '0.6rem 0.75rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    WebkitAppearance: 'none',
    appearance: 'none',
    color: '#7A8FA6',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.875rem',
    fontWeight: '400',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    transition: 'all 0.15s ease',
    position: 'relative',
  },
  navItemActive: {
    backgroundColor: 'rgba(0, 200, 150, 0.1)',
    color: '#00C896',
    fontWeight: '500',
  },
  navIcon: {
    fontSize: '0.8rem',
    opacity: 0.7,
  },
  navDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    backgroundColor: '#00C896',
    marginLeft: 'auto',
  },
  sidebarFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 1.25rem',
    borderTop: '1px solid #1A2535',
    marginTop: 'auto',
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#1A2D3D',
    border: '1.5px solid #00C896',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#00C896',
    fontFamily: "'Syne', sans-serif",
    fontWeight: '700',
    fontSize: '0.85rem',
    flexShrink: 0,
  },
  userName: {
    fontSize: '0.85rem',
    fontWeight: '500',
    color: '#E8EDF2',
    lineHeight: 1.2,
  },
  userRole: {
    fontSize: '0.72rem',
    color: '#4A5A6A',
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    WebkitAppearance: 'none',
    color: '#4A5A6A',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '4px',
    borderRadius: '6px',
    flexShrink: 0,
  },
};
