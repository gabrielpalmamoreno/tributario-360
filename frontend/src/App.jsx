import React, { useState } from 'react';
import Login from './Login.jsx';
import AdminApp from './AdminApp.jsx';
import ClientApp from './ClientApp.jsx';

export default function App() {
  const [sesion, setSesion] = useState(null);

  if (!sesion) return <Login onLogin={setSesion} />;
  if (sesion.rol === 'admin') return <AdminApp onLogout={() => setSesion(null)} />;
  return <ClientApp sesion={sesion} onLogout={() => setSesion(null)} />;
}
