// O NOVO E MELHORADO iaServices.js (COM GEMINI)

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

// 1. CONFIGURAÇÃO INICIAL - Igual à sua original!
// -----------------------------------------------------------------
dotenv.config();

// Garantindo que a chave da API está sendo carregada
if (!process.env.GEMINI_API_KEY) {
  throw new Error("A variável de ambiente GEMINI_API_KEY não está definida.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Usando um modelo mais recente e eficiente do Gemini!
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// =================================================================

// 2. FUNÇÃO 1: ANALISAR RESPOSTAS (RELATÓRIO 1) - Sua função original, mas com o prompt do GPT adaptado.
/**
 * Analisa as respostas do formulário inicial e gera o primeiro diagnóstico.
 */
export async function analisarRespostasComIA(dadosEmpresa, dadosQuiz) {
  console.log("🚀 Iniciando Diagnóstico Profundo com Gemini...");

  // Mapeamos as respostas para um formato mais legível para a IA
  const feedbackFormatado = dadosQuiz.map(item => {
    // Se a pergunta for aberta (não tiver opções), a resposta é o próprio texto.
    const respostaTexto = Array.isArray(item.opcoes) && item.respostaIndex != null
      ? item.opcoes[item.respostaIndex] // Se for de múltipla escolha, pega o texto da opção
      : item.resposta; // Se for aberta, usa o texto direto

    return `- Pergunta: "${item.pergunta}"\n  - Resposta: "${respostaTexto}"\n  - Nota (se aplicável): ${item.respostaIndex ?? 'N/A'}`;
  }).join('\n');


  const prompt = `
    Você é um consultor sênior de Desenvolvimento Humano e Organizacional (DHO) da EntreNova, especialista em traduzir respostas de questionários em diagnósticos estratégicos. Sua análise deve ser profunda, técnica e seguir a metodologia "Diagnóstico Profundo".

    A empresa analisada é a ${dadosEmpresa.nome}.
    Abaixo estão as respostas coletadas de um responsável-chave:
    ---
    ${feedbackFormatado}
    ---

    Siga RIGOROSAMENTE as seguintes etapas e formate a saída EXCLUSIVAMENTE como um objeto JSON válido, sem nenhum texto ou marcador adicional.

    **ETAPA 1: Identificação e Pontuação de Problemas Centrais**
    1.  Leia todas as respostas e identifique de 3 a 5 problemas centrais que a empresa enfrenta. Um problema central é validado por "recorrência semântica", ou seja, a mesma ideia aparecendo pelo menos 3 vezes de formas diferentes nas respostas.
    2.  Para cada problema identificado, atribua um 'score' de 1.0 a 5.0, calculando-o com base na seguinte fórmula ponderada (use sua expertise para estimar os valores de 1 a 5 para cada critério com base nas respostas):
        - 'impacto' (Gravidade do problema para a estratégia, peso 0.5)
        - 'frequencia' (Quantas vezes o tema aparece, peso 0.3)
        - 'alcance' (Quantas pessoas ou áreas afeta, peso 0.2)
    3.  Classifique cada problema com base no score: 'Critico' (4.5-5.0), 'Relevante' (3.5-4.4), 'Operacional' (2.5-3.4), 'Monitorável' (1.0-2.4).

    **ETAPA 2: Mapeamento de Soft Skills Deficitárias**
    1.  Para cada problema central identificado na ETAPA 1, mapeie de 1 a 2 'soft_skills' deficitárias diretamente relacionadas.
    2.  Use a lista oficial de soft skills fornecida abaixo. Para cada skill, especifique seu 'codigo' ("Universal", "Oculto" ou "Evolutivo") e a 'meta' principal associada.
        - **Lista de Soft Skills para consulta:**
          - Accountability (Oculto, Liderança & Accountability)
          - Autogestão (Oculto, Liderança & Accountability)
          - Comunicação eficaz (Universal, Comunicação & Alinhamento)
          - Colaboração e trabalho em equipe (Universal, Engajamento & Pertencimento)
          - Pensamento sistêmico (Oculto, Inovação & Adaptabilidade)
          - Liderança (Universal, Liderança & Accountability)
          - Resiliência (Universal, Inovação & Adaptabilidade)
          - E assim por diante... (você pode incluir a lista completa do documento aqui para a IA ter como referência direta)

    **ETAPA 3: Geração dos Relatórios Narrativos (D1-D7)**
    1.  **D1_descoberta**: Escreva um parágrafo (máximo 60 palavras) sobre o contexto da empresa, confrontando como ela se vê com os dados que você analisou.
    2.  **D3_analise_consultiva**: Para cada problema central, escreva uma breve análise (máximo 40 palavras) explicando a causa raiz, como no exemplo do "Relatório Master Shot".
    3.  **D5_cenarios_futuros**: Descreva em um parágrafo o cenário de 'evolucao' (se os problemas forem tratados) e em outro o cenário de 'deterioracao' (se nada for feito).
    4.  **pontos_fortes**: Liste 3 pontos fortes que a empresa já possui e que podem ser usados como alavanca.
    5.  **D6_direcionamento_grow**: Converta os problemas em metas (Goal) e sugira opções (Options) para resolvê-los.
    6.  **D7_design_desenvolvimento**: Com base nas soft skills mapeadas, sugira 2 trilhas de desenvolvimento no nível "Fundação".

    **ETAPA 4: Cálculo do Índice DHO Indicativo**
    1.  Com base na gravidade geral dos problemas e nas práticas de DHO mencionadas (ou ausentes) nas respostas, calcule uma 'nota_dho_indicativa' de 1.0 a 5.0.
    2.  Escreva uma 'justificativa_dho' completa explicando o porquê da nota.

    **ESTRUTURA JSON DE SAÍDA OBRIGATÓRIA:**
    {
      "problemas_centrais": [
        {
          "problema": "string",
          "score": "number",
          "classificacao": "string",
          "soft_skills_mapeadas": [
            {
              "skill": "string",
              "codigo": "string",
              "meta": "string"
            }
          ]
        }
      ],
      "relatorio_narrativo": {
        "D1_descoberta": "string",
        "D3_analise_consultiva": [
          {
            "problema": "string",
            "analise": "string"
          }
        ],
        "D5_cenarios_futuros": {
          "evolucao": "string",
          "deterioracao": "string"
        },
        "pontos_fortes": ["string", "string", "string"],
        "D6_direcionamento_grow": {
          "goal": "string",
          "options": ["string", "string"]
        },
        "D7_design_desenvolvimento": {
          "trilhas_fundacao": ["string", "string"]
        }
      },
      "indice_dho": {
        "nota_indicativa": "number",
        "justificativa": "string"
      }
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();


    const match = text.match(/```(?:json)?([\s\S]*?)```/);

    let jsonText;

    if (match && match[1]) {
      // 1. Encontrou o JSON dentro dos marcadores
      jsonText = match[1].trim();
    } else {
      // 2. Não encontrou marcadores. Tenta encontrar o JSON "solto"
      const jsonStartIndex = text.indexOf('{');
      const jsonEndIndex = text.lastIndexOf('}');

      if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
        // Pega o texto entre o primeiro { e o último }
        jsonText = text.substring(jsonStartIndex, jsonEndIndex + 1).trim();
      } else {
        // 3. Não encontrou nem marcadores nem um objeto JSON básico.
        console.error("❌ Resposta da IA não continha um JSON válido:", text);
        throw new Error("A resposta da IA não estava no formato JSON esperado.");
      }
    }
    // --- FIM DA LÓGICA DE EXTRAÇÃO ---


    // =================================================================
    //                *** ADICIONE ESTA LINHA DE CORREÇÃO ***
    // =================================================================
    // Remove vírgulas sobrando (trailing commas) antes de '}' ou ']'
    const sanitizedJsonText = jsonText
      .replace(/,\s*([}\]])/g, '$1');
    // =================================================================

    console.log("✅ Diagnóstico Profundo gerado com sucesso!");

    // =================================================================
    //          *** ALTERE 'jsonText' PARA 'sanitizedJsonText' ***
    // =================================================================
    // Esta linha (agora 170 no seu arquivo) deve usar o texto limpo
    return JSON.parse(sanitizedJsonText);

  } catch (error) {
    // Se o JSON.parse() ainda falhar, o erro será pego aqui
    console.error("❌ Erro no Gemini ao gerar Diagnóstico Profundo:", error);
    return {
      error: "Não foi possível gerar a análise completa.",
      details: error.message
    };
  }
}






// =================================================================

// 3. FUNÇÃO 2: GERAR NOVO RELATÓRIO (RELATÓRIO 2) -
/**
 * Gera um novo relatório (Relatório 2) baseado nas respostas do chatbot.
 */
export async function gerarNovoRelatorio(dadosEmpresa, dadosQuizChatbot) {
  console.log("🚀 Iniciando análise com Gemini para o Relatório 2...");

  // Formatando as respostas do chatbot para a IA entender
  const respostasFormatadas = dadosQuizChatbot
    .map((q, i) => `${i + 1}. Pergunta: ${q.pergunta}\n   Resposta: ${q.resposta}`)
    .join("\n\n");

  const prompt = `
        Você é um consultor de negócios analisando uma conversa com um cliente da empresa "${dadosEmpresa.nome}".
        A conversa foi a seguinte:
        ${respostasFormatadas}

        Sua tarefa é:
        1.  **relatorio2**: Crie um relatório textual que consolide e interprete as respostas do cliente, identificando os desafios e expectativas.
        2.  **resumo2**: Crie um resumo executivo muito curto (máximo 30 palavras) desse relatório.

        Formate a resposta EXCLUSIVAMENTE como um objeto JSON, sem nenhum texto ou marcador adicional. A estrutura deve ser:
        {
        "relatorio2": "string",
        "resumo2": "string"
        }
    `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    console.log("✅ Análise do Relatório 2 recebida do Gemini!");
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("❌ Erro na chamada do Gemini para o Relatório 2:", error);
    return {
      relatorio2: "Não foi possível gerar o relatório a partir da conversa.",
      resumo2: "Resumo indisponível."
    };
  }
}