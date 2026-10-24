const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Eres un asistente tributario experto en el sistema impositivo chileno.
Conoces a fondo el SII (Servicio de Impuestos Internos), formularios F29, F22, IVA, renta,
boletas de honorarios, facturación electrónica y todos los procesos tributarios de Chile.
Responde siempre en español, de manera clara, precisa y profesional.
Cuando corresponda, menciona plazos, fechas y formularios específicos.
Cuando el usuario adjunte un documento, boleta, factura, cartola o captura de pantalla,
analízalo en detalle antes de responder y basa tu respuesta en lo que efectivamente
observas en el archivo (montos, fechas, folios, conceptos). Si algo no se lee con
claridad, dilo explícitamente en vez de asumir.
Formatea tus respuestas en Markdown (títulos con ##, negritas, listas, tablas) cuando
ayude a la claridad — el cliente que te lee renderiza Markdown correctamente.
No uses emojis ni íconos pictográficos en ninguna parte de tu respuesta, bajo ninguna
circunstancia. Si necesitas destacar una advertencia o recomendación, hazlo con texto
("Importante:", "Recomendación:") o con Markdown (negrita, blockquote), nunca con emoji.`;

const TIPOS_IMAGEN = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

function construirContenido(pregunta, archivo) {
  if (!archivo) return pregunta;

  const bloques = [];
  const tipo = archivo.tipo || 'application/octet-stream';

  if (TIPOS_IMAGEN.includes(tipo)) {
    bloques.push({ type: 'image', source: { type: 'base64', media_type: tipo, data: archivo.datos } });
  } else if (tipo === 'application/pdf') {
    bloques.push({ type: 'document', source: { type: 'base64', media_type: tipo, data: archivo.datos } });
  } else {
    let texto;
    try {
      texto = Buffer.from(archivo.datos, 'base64').toString('utf-8');
    } catch {
      texto = '(no se pudo leer el contenido del archivo)';
    }
    bloques.push({ type: 'text', text: `Archivo adjunto "${archivo.nombre}":\n\n${texto}` });
  }

  bloques.push({
    type: 'text',
    text: pregunta || `Analiza el archivo adjunto (${archivo.nombre}) y dame tu diagnóstico y recomendaciones.`,
  });

  return bloques;
}

async function consultarAgente(pregunta, archivo) {
  const message = await client.messages.create({
    model: 'claude-sonnet-5',
    max_tokens: 1536,
    system: SYSTEM_PROMPT,
    messages: [
      { role: 'user', content: construirContenido(pregunta, archivo) }
    ],
  });
  const texto = message.content.filter(b => b.type === 'text').map(b => b.text).join('\n').trim();
  if (!texto) throw new Error(`Respuesta sin texto (stop_reason: ${message.stop_reason})`);
  return texto;
}

module.exports = { consultarAgente };
