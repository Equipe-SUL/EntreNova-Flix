import supabase from '../config/supabase.js';
import { analisarRespostasComIA } from './iaServices.js';
import { gerarNovoRelatorio } from './iaServices.js';
import { perguntasLead } from '../data/quizdata.js';

/**
 * Busca todos os conteúdos (trilhas) disponíveis na tabela 'conteudos'.
 */
const buscarConteudos = async () => {
  console.log('Buscando todos os conteúdos para recomendação...');
  const { data, error } = await supabase
    .from('conteudos')
    .select('modelo, categoria, descricao');

  if (error) {
    console.error('Erro ao buscar conteúdos:', error);
    return [];
  }

  return data;
};

/**
 * Salva o plano escolhido (básico ou premium) na tabela 'relatorios'
 */
const salvarPlanoChat = async ({ cnpj, plano }) => {
  const { error } = await supabase
    .from('relatorios')
    .update({ plano })
    .eq('cnpj_empresa', cnpj); // tem que existir um registro com esse CNPJ

  if (error) {
    throw new Error("Não foi possível salvar o plano");
  }
  return { success: true };
};

/**
 * Verifica se um CNPJ já existe na base de dados
 */
const verificarCnpjExistente = async (cnpj) => {
  const { data, error } = await supabase
    .from('empresas')
    .select('cnpj')
    .eq('cnpj', cnpj)
    .single();

  return !error && data != null;
};

/**
 * Salva resposta do chat da Iris
 */
const salvarRespostaChat = async (dados) => {
  const { pergunta, resposta, cnpj } = dados;

  const { error } = await supabase
    .from('chat_iris')
    .insert([{
      mensagem_recebida: pergunta,
      mensagem_enviada: resposta,
      cnpj_empresa: cnpj
    }]);

  if (error) {
    console.error('Erro ao salvar resposta do chat:', error);
    throw new Error('Não foi possível salvar a resposta do chat.');
  }
  return { success: true };
};

/**
 * Orquestra o processo completo: salva dados na 'empresas', 'respostas', 
 * salva o registro principal na 'relatorios' (com texto consolidado) 
 * e os detalhes estruturados na 'analises_ia'.
 */
const salvarDiagnosticoCompleto = async (dadosEmpresa, dadosQuiz, scoreLead = null) => {
  // Validação inicial do CNPJ
  const cnpjExistente = await verificarCnpjExistente(dadosEmpresa.cnpj);
  if (cnpjExistente) {
    throw new Error('Não foi possível salvar os dados da empresa. O CNPJ pode já existir.');
  }

  // Passo A: Salvar na tabela 'empresas'
  const { error: errorEmpresa } = await supabase
    .from('empresas')
    .insert([dadosEmpresa]);

  if (errorEmpresa) {
    console.error('Erro ao salvar empresa:', errorEmpresa);
    throw new Error('Não foi possível salvar os dados da empresa.');
  }

  // Passo B: Processar e salvar respostas por tipo
  
  // B.1: Respostas de Dimensão
  const respostasDimensao = dadosQuiz.filter(item => item.tipo === 'dimensao' || !item.tipo);
  const respostasParaInserir = respostasDimensao.map(item => ({
    pergunta: item.pergunta,
    resposta: item.resposta,
    categoria: item.pergunta.split('-')[0],
    tipo_diagnostico: 'inicial',
    cnpj_empresa: dadosEmpresa.cnpj
  }));

  if (respostasParaInserir.length > 0) {
    const { error: errorRespostasIniciais } = await supabase
      .from('respostas')
      .insert(respostasParaInserir);

    if (errorRespostasIniciais) {
      console.error('Erro ao salvar respostas iniciais:', errorRespostasIniciais);
    }
  }

  // B.2: Respostas de Lead Scoring (se existirem)
  const respostasLead = dadosQuiz.filter(item => item.tipo === 'lead');
  let respostasLeadParaInserir = [];

  if (respostasLead.length > 0) {
    respostasLeadParaInserir = respostasLead.map(item => {
      const respostaAjustada = item.resposta - 1;
      const pontos = perguntasLead.find(p => p.id === item.pergunta)?.pontos[respostaAjustada] || 0;
      
      return {
        pergunta: item.pergunta,
        resposta: item.resposta,
        categoria: 'lead',
        tipo_diagnostico: 'lead_scoring',
        cnpj_empresa: dadosEmpresa.cnpj,
      };
    });

    const { error: errorRespostasLead } = await supabase
      .from('respostas')
      .insert(respostasLeadParaInserir);

    if (errorRespostasLead) {
      console.error('Erro ao salvar respostas do lead:', errorRespostasLead);
    }
  }

  // Passo C: Buscar conteúdos para recomendação e chamar IA
  const conteudosDisponiveis = await buscarConteudos();
  
  console.log('Iniciando análise com a IA...');
  const analiseIA = await analisarRespostasComIA(dadosEmpresa, dadosQuiz);

  if (!analiseIA) {
    throw new Error('Falha ao gerar a análise da IA.');
  }

  // Geração do Texto Consolidado para relatorio1
  const textoConsolidadoRelatorio1 = `
    **Principal Desafio:** ${analiseIA.maiorProblema}
    
    **Sugestões Práticas:**
    ${analiseIA.sugestoes.map((s, index) => `${index + 1}. ${s}`).join('\n')}
    
    **Tom da Análise:** ${analiseIA.tom}
    
    **Emoções Identificadas:** ${analiseIA.emocoes.join(', ')}
  `.trim();

  // Passo D: Preparar dados para relatório
  const dadosRelatorio = {
    cnpj_empresa: dadosEmpresa.cnpj,
    resumo1: analiseIA.resumo,
    relatorio1: textoConsolidadoRelatorio1,
  };

  // Adicionar classificação de lead se disponível
  if (scoreLead && scoreLead.classificacao) {
    dadosRelatorio.lead = scoreLead.classificacao;
  }

  // D.1: Salvar o registro principal na tabela 'relatorios'
  const { data: relatorioData, error: errorRelatorio } = await supabase
    .from('relatorios')
    .insert([dadosRelatorio])
    .select('id')
    .single();

  if (errorRelatorio) {
    console.error('Erro ao criar registro do relatório:', errorRelatorio);
    throw new Error('Falha ao gerar o registro do relatório.');
  }

  // D.2: Salvar os detalhes estruturados na tabela 'analises_ia'
  const dadosAnaliseIA = {
    relatorio_id: relatorioData.id,
    resumo: analiseIA.resumo,
    maior_problema: analiseIA.maiorProblema,
    sugestoes: JSON.stringify(analiseIA.sugestoes),
    tom_analise: analiseIA.tom,
    emocoes: JSON.stringify(analiseIA.emocoes)
  };

  // Adicionar trilhas recomendadas se disponíveis (nao utilizado mais )
  //if (analiseIA.trilhasRecomendadas) {
  //  dadosAnaliseIA.trilhas_recomendadas = JSON.stringify(analiseIA.trilhasRecomendadas);
 // }

  const { error: errorAnalise } = await supabase
    .from('analises_ia')
    .insert([dadosAnaliseIA]);

  if (errorAnalise) {
    console.error('Erro ao salvar análise da IA:', errorAnalise);
    throw new Error('Falha ao salvar a análise detalhada da IA.');
  }

  return { success: true, reportId: relatorioData.id };
};

/**
 * Busca um relatório (tabela 'relatorios') e os detalhes da análise (tabela 'analises_ia') por ID.
 * Retorna apenas os campos necessários para o frontend (omite tom e emoções).
 */
const buscarRelatorioPorId = async (id) => {
  const { data, error } = await supabase
    .from('relatorios')
    .select('*, analises_ia(*)')
    .eq('id', id)
    .single();

  if (error || !data || !data.analises_ia || data.analises_ia.length === 0) {
    throw new Error('Relatório não encontrado ou análise detalhada ausente.');
  }

  const analise = data.analises_ia[0];

  // Converte a string JSON de sugestões de volta para array
  let sugestoesArray = [];
  if (analise.sugestoes && typeof analise.sugestoes === 'string') {
    sugestoesArray = JSON.parse(analise.sugestoes);
  }

  // Converte as trilhas JSON para array
  let trilhasArray = [];
  if (analise.trilhas_recomendadas && typeof analise.trilhas_recomendadas === 'string') {
    trilhasArray = JSON.parse(analise.trilhas_recomendadas);
  }

  // Mapeia e consolida os dados para o formato esperado pelo frontend
  const formattedData = {
    id: data.id,
    resumo_ia: analise.resumo,
    maior_problema: analise.maior_problema,
    sugestoes: sugestoesArray,
    trilhasRecomendadas: trilhasArray
  };

  // Adicionar lead se disponível
  if (data.lead) {
    formattedData.lead = data.lead;
  }

  return formattedData;
};

const atualizarRelatorio = async (cnpj, dados) => {
  const { error } = await supabase
    .from('relatorios')
    .update(dados)
    .eq('cnpj_empresa', cnpj);

  if (error) {
    console.error("Erro ao atualizar relatório:", error);
    throw new Error("Falha ao salvar relatório no banco de dados.");
  }

  return { success: true };
};


const buscarConversaPorCnpj = async (cnpj) => {
  const { data, error } = await supabase
    .from('chat_iris')
    .select('*')
    .eq('cnpj_empresa', cnpj);
  if (error) throw new Error('Erro ao buscar conversa');
  return data;
};

const buscarRelatorioPorCnpj = async (cnpj) => {
  const { data, error } = await supabase
    .from('relatorios')
    .select('*')
    .eq('cnpj_empresa', cnpj)
    .single();
  if (error) throw new Error('Erro ao buscar relatório');
  return data;
};


// Exporta todas as funções
export {
  salvarDiagnosticoCompleto,
  buscarRelatorioPorId,
  verificarCnpjExistente,
  salvarRespostaChat,
  buscarConteudos,
  salvarPlanoChat,
  atualizarRelatorio,
  buscarConversaPorCnpj,
  buscarRelatorioPorCnpj
};