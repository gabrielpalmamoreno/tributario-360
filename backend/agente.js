const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Eres un asistente tributario experto en el sistema impositivo chileno.
Conoces a fondo el SII (Servicio de Impuestos Internos), formularios F29, F22, IVA, renta,
boletas de honorarios, facturación electrónica y todos los procesos tributarios de Chile.
Responde siempre en español, de manera clara, precisa y profesional.
Cuando corresponda, menciona plazos, fechas y formularios específicos.`;

async function consultarAgente(pregunta) {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      { role: 'user', content: pregunta }
    ],
  });
  return message.content[0].text;
}

module.exports = { consultarAgente };
