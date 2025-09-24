import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * @param {object} dadosEmpresa - Objeto com os dados da empresa (nome, cnpj, etc).
 * @param {Array<object>} dadosQuiz - Array com as respostas do quiz (ex: [{pergunta: 'p1', resposta: 'Sim'}]).
 * @returns {Promise<object|null>} - O objeto JSON com a análise da IA, ou null em caso de erro.
 */
export async function analisarRespostasComIA(dadosEmpresa, dadosQuiz) {
  if (!dadosQuiz || dadosQuiz.length === 0) {
    console.error("Nenhuma resposta foi fornecida para a análise.");
    return null;
  }

  // Formata o feedback a partir dos dados recebidos
  let feedbackFormatado = '';
  dadosQuiz.forEach(item => {
    feedbackFormatado += `\n- ${item.pergunta}: ${item.resposta}`;
  });

  const prompt = `
    Analise o seguinte feedback de um cliente de forma detalhada e estruturada.
    O cliente representa a empresa: ${dadosEmpresa.nome}.
    
    O feedback é baseado em respostas de questionário sobre gestão empresarial:
    ${feedbackFormatado}
    
    Por favor, forneça uma análise que inclua: 
    1. O maior problema da empresa: descreva em 20 palavras ou menos;
    2. Sugestões de melhorias: liste 3 sugestões práticas;
    3. Tom do feedback: classifique como positivo, negativo ou neutro;
    4. Possíveis emoções do cliente: liste até 3 emoções que o cliente pode estar sentindo.
    5. Resumo do feedback: forneça um resumo claro e conciso de até 40 palavras.
    
    Formate a resposta EXATAMENTE em JSON com a seguinte estrutura, sem nenhum texto adicional antes ou depois do JSON:
    {
      "maiorProblema": "string",
      "sugestoes": ["string", "string", "string"],
      "tom": "positivo|negativo|neutro",
      "emocoes": ["string", "string", "string"],
      "resumo": "string"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Limpa o texto para garantir que ele é um JSON válido
    const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(jsonText); // Retorna o JSON parseado
  } catch (error) {
    console.error("Erro ao gerar conteúdo com a IA:", error);
    return null; // Retorna null em caso de erro
  }
}