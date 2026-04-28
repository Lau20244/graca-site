const Anthropic = require("@anthropic-ai/sdk");
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const SYSTEM = "Voce e GRACA, guia espiritual criada por Kellen Aquino. Fale em portugues com calor e poesia. Ajude a pessoa a descobrir seu proposito e missao.";
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "{}" };
  try {
    const { mensagens } = JSON.parse(event.body);
    const r = await client.messages.create({ model: "claude-opus-4-5", max_tokens: 1024, system: SYSTEM, messages: mensagens.slice(-20) });
    const texto = r.content.filter(b => b.type === "text").map(b => b.text).join("\n");
    return { statusCode: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ resposta: texto }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ erro: "Erro interno." }) };
  }
};
