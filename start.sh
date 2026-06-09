#!/bin/bash
# Tributario 360 — arranque completo

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Verificar .env
if [ ! -f "$PROJECT_DIR/backend/.env" ]; then
  echo "⚠  Falta backend/.env con ANTHROPIC_API_KEY"
  echo "   Crea el archivo con: echo 'ANTHROPIC_API_KEY=sk-ant-...' > backend/.env"
  exit 1
fi

# Matar procesos previos en los puertos
lsof -ti :3001 | xargs kill -9 2>/dev/null
lsof -ti :5173 | xargs kill -9 2>/dev/null

echo "▶ Iniciando backend en puerto 3001..."
cd "$PROJECT_DIR/backend" && npm start &

sleep 2

echo "▶ Iniciando frontend en puerto 5173..."
cd "$PROJECT_DIR/frontend" && npm run dev &

sleep 2

echo ""
echo "✓ Tributario 360 corriendo en http://localhost:5173"
echo "  Para detener: Ctrl+C o cierra esta terminal"

wait
