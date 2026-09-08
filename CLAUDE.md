# Tributario 360

Sistema contable tributario chileno multi-tenant. Panel admin + portal cliente por empresa.

## Arranque rápido

```bash
# Desde la raíz del proyecto:
bash start.sh
```

O manualmente en dos terminales:
```bash
# Terminal 1 — backend (puerto 3001)
cd backend && npm start

# Terminal 2 — frontend (puerto 5173)
cd frontend && npm run dev
```

App en: http://localhost:5173

## Requisito crítico

El backend necesita `/backend/.env` con la API key de Anthropic:
```
ANTHROPIC_API_KEY=sk-ant-...
```
Sin ese archivo el Agente Tributario IA no funciona.

## Cuentas demo

| Rol | RUT | Contraseña |
|-----|-----|------------|
| Admin | — | `admin123` |
| Cliente 1 — Constructora Los Álamos SpA (14D PyME) | `76.543.210-K` | `cliente1` |
| Cliente 2 — María González Rojas (Honorarios) | `12.345.678-9` | `cliente2` |
| Cliente 3 — Comercial Tres Ríos Ltda. (14A General) | `89.012.345-6` | `cliente3` |

## Stack

- **Backend**: Node.js + Express · puerto 3001
- **Frontend**: React 18 + Vite 5 · puerto 5173
- **IA**: Anthropic SDK → modelo `claude-sonnet-4-6`
- **Indicadores**: API pública mindicador.cl (UF, UTM, dólar, euro)
- **Fuentes**: Syne (display) + DM Sans (body) — Google Fonts
- **Tema**: oscuro `#0A0E14`, acento verde esmeralda `#00C896`

## Estructura

```
tributario-360/
├── backend/
│   ├── server.js          → API REST (GET /api/indicadores, POST /api/agente)
│   ├── sii-scraper.js     → Indicadores desde mindicador.cl
│   ├── agente.js          → Claude claude-sonnet-4-6 con system prompt tributario chileno
│   └── .env               → ANTHROPIC_API_KEY (no subir a git)
└── frontend/src/
    ├── App.jsx             → Router principal: Login → AdminApp | ClientApp
    ├── Login.jsx           → Pantalla login con tabs cliente/admin
    ├── AdminApp.jsx        → Portal administrador
    ├── ClientApp.jsx       → Portal cliente (usa sesion.empresa como ID)
    ├── components/
    │   ├── Sidebar.jsx         → Nav admin
    │   ├── Dashboard.jsx       → Dashboard admin con TaxCards
    │   ├── TaxCard.jsx         → Tarjeta con hover animado
    │   ├── AgenteIA.jsx        → Chat IA con historial persistido en localStorage por RUT
    │   ├── Indicadores.jsx     → Tabla UF/UTM/dólar/euro/IVA
    │   ├── FormularioF29.jsx   → Calculadora IVA + historial declaraciones
    │   ├── FormularioF22.jsx   → Estimador renta + tabla tramos IGC
    │   ├── Clientes.jsx        → Gestión contribuyentes
    │   └── Reportes.jsx        → KPIs + gráfico barras + calendario obligaciones
    └── client/
        ├── ClientSidebar.jsx       → Nav cliente con info empresa y régimen
        ├── EmpresaDashboard.jsx    → Panel empresa: alertas, KPIs, accesos rápidos
        ├── LibroVentas.jsx         → Registro facturas/boletas + IVA débito
        ├── LibroCompras.jsx        → Registro compras + control crédito fiscal
        ├── Remuneraciones.jsx      → Liquidaciones AFP/salud/cesantía
        ├── ActivosFijos.jsx        → Depreciación normal vs acelerada (Art. 31 N°5 bis)
        └── OptimizacionFiscal.jsx  → 10 estrategias legales + simulador de ahorro
```

## Decisiones de diseño

- Estado de sesión en `App.jsx` (`useState`), sin librería de routing — navegación por props
- Historial del agente IA en `localStorage` con clave `t360_chats_{empresa}` — separado por cliente
- Todos los datos de empresas son mock (en memoria) — sin base de datos real aún
- `WebkitAppearance: 'none'` en todos los `<button>` para evitar estilos nativos del OS en macOS
- El proxy de Vite (`/api → localhost:3001`) evita CORS en desarrollo

## Notas operativas

- `/api/indicadores` depende de la API pública `mindicador.cl`, que a veces se cae. `sii-scraper.js` cachea en memoria el último valor exitoso y responde con `desactualizado: true` si la fuente externa falla; `Indicadores.jsx` muestra un aviso en vez de una tabla vacía en ese caso. Si el asistente o los indicadores parecen "no funcionar", revisar primero los logs HTTP/deploy en Railway antes de asumir un bug propio.
- El agente IA (`backend/agente.js`) usa el modelo Anthropic `claude-sonnet-4-6` hasta 2026-08-31, actualizado a `claude-sonnet-5` en esa fecha por lentitud (~21s → ~4s). Revisar periódicamente si sigue siendo el modelo recomendado vigente.

## Próximos pasos sugeridos

- Autenticación real con JWT (backend)
- Base de datos (PostgreSQL o Supabase) para persistir libros contables
- Integración real con API del SII (certificado digital)
- Envío de F29 directamente desde el sistema
