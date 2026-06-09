import React, { useState } from 'react';
import ClientSidebar from './client/ClientSidebar.jsx';
import EmpresaDashboard from './client/EmpresaDashboard.jsx';
import LibroVentas from './client/LibroVentas.jsx';
import LibroCompras from './client/LibroCompras.jsx';
import Remuneraciones from './client/Remuneraciones.jsx';
import ActivosFijos from './client/ActivosFijos.jsx';
import OptimizacionFiscal from './client/OptimizacionFiscal.jsx';
import AgenteIA from './components/AgenteIA.jsx';

export default function ClientApp({ sesion, onLogout }) {
  const [activeView, setActiveView] = useState('Dashboard');

  const views = {
    'Dashboard':           <EmpresaDashboard sesion={sesion} onNavigate={setActiveView} />,
    'Libro de Ventas':     <LibroVentas sesion={sesion} />,
    'Libro de Compras':    <LibroCompras sesion={sesion} />,
    'Remuneraciones':      <Remuneraciones sesion={sesion} />,
    'Activos Fijos':       <ActivosFijos sesion={sesion} />,
    'Optimización Fiscal': <OptimizacionFiscal sesion={sesion} />,
    'Agente Tributario':   <AgenteIA sesion={sesion} />,
  };

  return (
    <div className="app-shell">
      <ClientSidebar activeView={activeView} setActiveView={setActiveView} sesion={sesion} onLogout={onLogout} />
      <main className="main-content">{views[activeView] ?? views['Dashboard']}</main>
    </div>
  );
}
