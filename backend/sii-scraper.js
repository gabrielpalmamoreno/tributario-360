const axios = require('axios');
const cheerio = require('cheerio');

async function getIndicadores() {
  try {
    const { data } = await axios.get('https://mindicador.cl/api', { timeout: 8000 });
    return {
      uf: {
        valor: data.uf?.valor ?? null,
        fecha: data.uf?.fecha ?? null,
      },
      utm: {
        valor: data.utm?.valor ?? null,
        fecha: data.utm?.fecha ?? null,
      },
      dolar: {
        valor: data.dolar?.valor ?? null,
        fecha: data.dolar?.fecha ?? null,
      },
      euro: {
        valor: data.euro?.valor ?? null,
        fecha: data.euro?.fecha ?? null,
      },
      iva: 0.19,
      proximoVencimientoF29: calcularVencimientoF29(),
    };
  } catch (error) {
    throw new Error(`No se pudo obtener indicadores: ${error.message}`);
  }
}

function calcularVencimientoF29() {
  const hoy = new Date();
  const mes = hoy.getMonth();
  const anio = hoy.getFullYear();
  // F29 vence el día 12 del mes siguiente
  const vencimiento = new Date(anio, mes + 1, 12);
  return vencimiento.toISOString().split('T')[0];
}

module.exports = { getIndicadores };
