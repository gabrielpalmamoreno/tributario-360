require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { getIndicadores } = require('./sii-scraper');
const { consultarAgente } = require('./agente');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/indicadores', async (req, res) => {
  try {
    const data = await getIndicadores();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo indicadores', details: error.message });
  }
});

app.post('/api/agente', async (req, res) => {
  try {
    const { pregunta } = req.body;
    if (!pregunta) return res.status(400).json({ error: 'Falta el campo pregunta' });
    const respuesta = await consultarAgente(pregunta);
    res.json({ respuesta });
  } catch (error) {
    res.status(500).json({ error: 'Error en el agente', details: error.message });
  }
});

const distPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Tributario 360 corriendo en http://localhost:${PORT}`);
});
