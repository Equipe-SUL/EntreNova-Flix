import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// Configuração do cliente OpenAI
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * @param {object} dadosEmpresa
 * @param {Array<object>} dadosQuiz
 * @returns {Promise<object|null>}
 */
export async function analisarRespostasComIA(dadosEmpresa, dadosQuiz) {
  if (!dadosQuiz || dadosQuiz.length === 0) {
    console.error("Nenhuma resposta foi fornecida para a análise.");
    return null;
  }

  let feedbackFormatado = '';
  dadosQuiz.forEach(item => {
    feedbackFormatado += `\n- ${item.pergunta}: ${item.resposta}`;
  });

  const prompt = `
    Analise o seguinte feedback de um cliente de forma detalhada e estruturada.
    O cliente representa a empresa: ${dadosEmpresa.nome}.
    
    O feedback é baseado em respostas de questionário sobre gestão empresarial:
    ${feedbackFormatado}
    
    Quero que na resposta nao imprima d1, e1, nada desse tipo, só a resposta.
    
    Com base na sua análise, execute as seguintes tarefas:
    1. Identifique o maior problema da empresa (descreva em 20 palavras ou menos).
    2. Liste 3 sugestões práticas de melhoria.
    3. Classifique o tom do feedback (positivo, negativo ou neutro).
    4. Liste até 3 emoções que o cliente pode estar sentindo.
    5. Forneça um resumo claro e conciso do feedback (até 40 palavras).
    6. Gere um "relatorioCompleto", detalhado e estruturado, expandindo todas as informações acima.
    
    Formate a resposta EXATAMENTE em JSON com a seguinte estrutura, sem nenhum texto adicional antes ou depois do JSON:
    {
      "maiorProblema": "string",
      "sugestoes": ["string", "string", "string"],
      "tom": "positivo|negativo|neutro",
      "emocoes": ["string", "string", "string"],
      "resumo": "string",
      "relatorioCompleto": "string"
    }
  `;

  try {
    const result = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 600, // aumentando para suportar relatorioCompleto
    });

    console.log("Tokens prompt:", result.usage.prompt_tokens);
    console.log("Tokens resposta:", result.usage.completion_tokens);
    console.log("Tokens total:", result.usage.total_tokens);

    const text = result.choices[0].message.content;
    const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Erro ao gerar conteúdo com a IA:", error);
    return {
      maiorProblema: "Não foi possível analisar as respostas",
      sugestoes: ["Verificar a conexão com a IA", "Revisar as respostas fornecidas", "Tentar novamente mais tarde"],
      tom: "neutro",
      emocoes: ["neutro"],
      resumo: "Análise não disponível no momento",
      relatorioCompleto: "Relatório completo não disponível no momento"
    };
  }
}


  try {
    const result = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });

    console.log("Tokens prompt:", result.usage.prompt_tokens);
    console.log("Tokens resposta:", result.usage.completion_tokens);
    console.log("Tokens total:", result.usage.total_tokens);

    const text = result.choices[0].message.content;
    const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Erro ao gerar conteúdo com a IA:", error);
    return {
      maiorProblema: "Não foi possível analisar as respostas",
      sugestoes: ["Verificar a conexão com a IA", "Revisar as respostas fornecidas", "Tentar novamente mais tarde"],
      tom: "neutro",
      emocoes: ["neutro"],
      resumo: "Análise não disponível no momento"
    };
  }

/**
 * Gera novo relatório 2 e resumo 2 diretamente baseado nas respostas do chatbot.
 */
export async function gerarNovoRelatorio(dadosEmpresa, dadosQuiz, plano, preferenciaConteudo) {
  const respostasFormatadas = dadosQuiz
    .map((q, i) => `${i + 1}. Pergunta: ${q.pergunta}\n   Resposta: ${q.resposta}`)
    .join("\n\n");

  const prompt = `
    Você é um especialista em análise de feedbacks de clientes.
    Baseado nas respostas do cliente da empresa ${dadosEmpresa.nome}, gere:
    1. Um Relatório 2: texto resumido, mas completo, consolidando todas as respostas do quiz.
    2. Um Resumo 2: versão ainda mais curta do relatório, destacando os pontos principais.

    Respostas do cliente:
    ${respostasFormatadas}

    Formate a saída EXATAMENTE como JSON:
    {
      "relatorio2": "texto completo consolidado",
      "resumo2": "resumo curto do relatório"
    }
  `;

  try {
    const result = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 350,
    });

    const text = result.choices[0].message.content;
    const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const relatorioIA = JSON.parse(jsonText);

    return {
      relatorio2: relatorioIA.relatorio2,
      resumo2: relatorioIA.resumo2,
      plano,
      preferenciaConteudo
    };

  } catch (error) {
    console.error("Erro ao gerar novo relatório com IA:", error);
    return {
      relatorio2: respostasFormatadas,
      resumo2: "Resumo não disponível",
      plano,
      preferenciaConteudo
    };
  }
}

/**
 * Gera trilha de conteúdos baseada nos relatórios e nos conteúdos disponíveis.
 */
export async function gerarTrilhaConteudos(dadosRelatorios, conteudosDisponiveis) {
  const { relatorio1, relatorio2, qtdConteudos, preferenciaConteudo } = dadosRelatorios;

  if (!conteudosDisponiveis || conteudosDisponiveis.length === 0) {
    console.error("Nenhum conteúdo disponível para gerar trilha.");
    return [];
  }

  if (!preferenciaConteudo) {
    throw new Error("Preferência de conteúdo não definida");
  }

  const preferidos = conteudosDisponiveis.filter(
    c => c.modelo && c.modelo.toLowerCase() === preferenciaConteudo.toLowerCase()
  );

  const qtdPreferidos = Math.min(Math.max(2, preferidos.length), 3);
  const selecionadosPreferidos = preferidos.slice(0, qtdPreferidos);

  const restantes = qtdConteudos - selecionadosPreferidos.length;
  const selecionadosDiversos = [];

  let disponiveisParaAleatorio = conteudosDisponiveis.filter(
    c => !selecionadosPreferidos.includes(c)
  );

  while (selecionadosDiversos.length < restantes && disponiveisParaAleatorio.length > 0) {
    const index = Math.floor(Math.random() * disponiveisParaAleatorio.length);
    const aleatorio = disponiveisParaAleatorio.splice(index, 1)[0];

    const totalPreferidosSelecionados = [...selecionadosPreferidos, ...selecionadosDiversos]
      .filter(c => c.modelo && c.modelo.toLowerCase() === preferenciaConteudo.toLowerCase())
      .length;

    if (aleatorio.modelo.toLowerCase() === preferenciaConteudo.toLowerCase() && totalPreferidosSelecionados >= 3) {
      continue;
    }

    selecionadosDiversos.push(aleatorio);
  }

  let trilhaFinal = [...selecionadosPreferidos, ...selecionadosDiversos];
  trilhaFinal = trilhaFinal.sort(() => 0.5 - Math.random());

  const trilhaFinalFormatada = trilhaFinal.map(c => ({
    titulo: c.descricao,
    modelo: c.modelo
  }));

  const prompt = `
    Você é um especialista em desenvolvimento de pessoas e treinamento corporativo.
    Baseado nos seguintes relatórios:
    - Relatório 1: ${JSON.stringify(relatorio1)}
    - Relatório 2: ${JSON.stringify(relatorio2)}

    Crie uma trilha de aprendizagem com ${qtdConteudos} conteúdos,
    priorizando o formato preferido pelo usuário: ${preferenciaConteudo}.
    **Use apenas os títulos e modelos já fornecidos nos conteúdosDisponiveis.**
    Formate a resposta EXATAMENTE em JSON como:
    [
      { "titulo": "string", "modelo": "vídeo|podcast|curso|artigo" },
      ...
    ]
  `;

  try {
    const result = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });

    const text = result.choices[0].message.content;
    const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const trilhaIA = JSON.parse(jsonText);

    if (trilhaIA.length === qtdConteudos) {
      return trilhaIA.map((item, i) => ({
        titulo: trilhaFinalFormatada[i].titulo,
        modelo: trilhaFinalFormatada[i].modelo
      }));
    }

    return trilhaFinalFormatada;

  } catch (error) {
    console.error("Erro ao gerar trilha de conteúdos com a IA:", error);
    return trilhaFinalFormatada;
  }
}
