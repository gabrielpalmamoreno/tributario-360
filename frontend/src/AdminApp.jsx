import React, { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './components/Dashboard.jsx';
import AgenteIA from './components/AgenteIA.jsx';
import Indicadores from './components/Indicadores.jsx';
import FormularioF29 from './components/FormularioF29.jsx';
import FormularioF22 from './components/FormularioF22.jsx';
import Clientes from './components/Clientes.jsx';
import Reportes from './components/Reportes.jsx';

export default function AdminApp({ onLogout }) {
  const [activeView, setActiveView] = useState('Dashboard');

  const views = {
    'Dashboard':      <Dashboard onNavigate={setActiveView} />,
    'Indicadores':    <Indicadores />,
    'Formulario F29': <FormularioF29 />,
    'Formulario F22': <FormularioF22 />,
    'Agente IA':      <AgenteIA sesion={{ empresa: 'admin', nombre: 'Administrador' }} />,
    'Clientes':       <Clientes />,
    'Reportes':       <Reportes />,
  };

  return (
    <div className="app-shell">
      <Sidebar activeView={activeView} setActiveView={setActiveView} onLogout={onLogout} rol="admin" />
      <main className="main-content">{views[activeView] ?? views['Dashboard']}</main>
    </div>
  );
}
