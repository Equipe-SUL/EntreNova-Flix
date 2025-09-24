import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBhE1iWZDZa-T23RUyTSxJwLQRVK7NHCGc";

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Estrutura das perguntas do questionário do formulário
const perguntasPorDimensao = {
  pessoas: [
    // ... suas perguntas aqui
  ]
};

// A função agora é exportada e recebe as respostas como parâmetro
export async function analisarRespostasComIA(respostasDoCliente) {
  // ADICIONE ESTA VERIFICAÇÃO!
  if (!respostasDoCliente || Object.keys(respostasDoCliente).length === 0) {
    console.error("Nenhuma resposta foi fornecida para a análise.");
    return null;
  }

  // Código do feedback e prompt que você já tem
  let feedbackFormatado = '';
  for (const dimensao in perguntasPorDimensao) {
    
    feedbackFormatado += `\n\n--- Dimensão: ${dimensao.toUpperCase()} ---\n`;
    perguntasPorDimensao[dimensao].forEach(pergunta => {

      const resposta = respostasDoCliente[pergunta.id] || 'Não respondido';
      feedbackFormatado += `\n${pergunta.texto}: ${resposta}`;
    });
  }

  const prompt = `Analise o seguinte feedback de um cliente de forma detalhada e estruturada.
  O cliente se chama: .

  O feedback é baseado em respostas de questionário sobre gestão empresarial:
  ${feedbackFormatado}

  Por favor, forneça uma análise que inclua:
  1. O maior problema da empresa: descreva em 20 palavras ou menos;
  2. Sugestões de melhorias: liste 3 sugestões práticas;
  3. Tom do feedback: classifique como positivo, negativo ou neutro;
  4. Possíveis emoções do cliente: liste até 3 emoções que o cliente pode estar sentindo.
  5. Resumo do feedback: forneça um resumo claro e conciso de até 40 palavras.

  Formate a resposta em JSON com a seguinte estrutura:
  {
    "maiorProblema": "string",
    "sugestoes": ["string", "string", "string"],
    "tom": "positivo|negativo|neutro",
    "emocoes": ["string", "string", "string"],
    "resumo": "string"
  }`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text); // Retorna o JSON parseado
  } catch (error) {
    console.error("Erro ao gerar conteúdo com a IA:", error);
    return null; // Retorna null em caso de erro
  }
}