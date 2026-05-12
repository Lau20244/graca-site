const Anthropic = require("@anthropic-ai/sdk");
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "{}" };
  try {
    const { mensagens, system } = JSON.parse(event.body);
    const PROMPT = system || "Voce e GRACA, guia de proposito da Kellen Aquino. Fale de forma direta e humana. NUNCA use expressoes como querida alma, meu bem. NUNCA use asteriscos. No FINAL escreva ###OPCOES### seguido de 3 opcoes separadas por |.";
    const r = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: PROMPT,
      messages: mensagens
    });
    const texto = r.content.filter(b => b.type === "text").map(b => b.text).join("\n");
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ resposta: texto })
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ erro: e.message }) };
  }
};
