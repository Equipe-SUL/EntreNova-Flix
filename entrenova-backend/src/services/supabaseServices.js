import supabase from '../config/supabase.js';
import { analisarRespostasComIA } from './iaServices.js';

/**
 * Orquestra o processo completo de salvar um diagnóstico:
 * 1. Salva os dados da empresa.
 * 2. Salva as respostas do questionário.
 * 3. Chama a IA para análise.
 * 4. Salva o relatório principal.
 * 5. Salva os detalhes da análise em uma tabela separada.
 * 6. Retorna o ID do novo relatório.
 */
const salvarDiagnosticoCompleto = async (dadosEmpresa, dadosQuiz) => {
  // Passo A: Salvar na tabela 'empresas'
  const { error: errorEmpresa } = await supabase
    .from('empresas')
    .insert([dadosEmpresa]);

  if (errorEmpresa) {
    console.error('Erro ao salvar empresa:', errorEmpresa);
    throw new Error('Não foi possível salvar os dados da empresa. O CNPJ pode já existir.');
  }

  // Passo B: Formatar e salvar na tabela 'respostas'
  const respostasParaInserir = dadosQuiz.map(item => ({
    pergunta: item.pergunta,
    resposta: item.resposta, 
    categoria: item.pergunta.split('-')[0],
    tipo_diagnostico: 'inicial',
    cnpj_empresa: dadosEmpresa.cnpj
  }));
  
  const { error: errorRespostas } = await supabase
    .from('respostas')
    .insert(respostasParaInserir);

  if (errorRespostas) {
    console.error('Erro ao salvar respostas:', errorRespostas);
    throw new Error('Não foi possível salvar as respostas do quiz.');
  }

  // Passo C: Chamar a IA para gerar a análise completa
  console.log('Iniciando análise com a IA...');
  const analiseIA = await analisarRespostasComIA(dadosEmpresa, dadosQuiz);

  if (!analiseIA) {
    throw new Error('Falha ao gerar a análise da IA.');
  }
  console.log('Análise da IA recebida:', analiseIA);

  // Passo D: Salvar o registro principal do relatório e obter o ID
  const { data: relatorioData, error: errorRelatorio } = await supabase
    .from('relatorios')
    .insert([{
      cnpj_empresa: dadosEmpresa.cnpj
    }])
    .select('id')
    .single();

  if (errorRelatorio) {
    console.error('Erro ao criar registro do relatório:', errorRelatorio);
    throw new Error('Falha ao gerar o registro do relatório.');
  }

  // Passo E: Salvar os detalhes da análise na nova tabela 'analises_ia'
  const { error: errorAnalise } = await supabase
    .from('analises_ia')
    .insert([{
      relatorio_id: relatorioData.id, 
      resumo: analiseIA.resumo,
      maior_problema: analiseIA.maiorProblema,
      sugestoes: JSON.stringify(analiseIA.sugestoes),
      tom_analise: analiseIA.tom,
      emocoes: JSON.stringify(analiseIA.emocoes)
    }]);

  if (errorAnalise) {
    console.error('Erro ao salvar análise da IA:', errorAnalise);
    throw new Error('Falha ao salvar a análise detalhada da IA.');
  }

  // Passo F: Retornar o ID do relatório criado para o frontend
  return { success: true, reportId: relatorioData.id };
};


/**
 * Busca um relatório e os detalhes da análise por ID.
 * Usamos JOIN para buscar dados de ambas as tabelas.
 */
const buscarRelatorioPorId = async (id) => {
  const { data, error } = await supabase
    .from('relatorios')
    .select('id, cnpj_empresa, analises_ia(*)') // Seleciona colunas de ambas as tabelas
    .eq('id', id)
    .single();

  if (error || !data || !data.analises_ia || data.analises_ia.length === 0) {
    throw new Error('Relatório não encontrado ou análise ausente.');
  }

  const analise = data.analises_ia[0]; // A resposta do JOIN vem como um array de um único item

  // Converte as strings JSON de volta para arrays
  let sugestoesArray = [];
  if (analise.sugestoes && typeof analise.sugestoes === 'string') {
    sugestoesArray = JSON.parse(analise.sugestoes);
  }

  let emocoesArray = [];
  if (analise.emocoes && typeof analise.emocoes === 'string') {
    emocoesArray = JSON.parse(analise.emocoes);
  }

  // Formata o objeto final no padrão esperado pelo frontend (IRelatorio)
  const formattedData = {
    id: data.id,
    resumo_ia: analise.resumo,
    maior_problema: analise.maior_problema,
    sugestoes: sugestoesArray,
    tom_analise: analise.tom_analise,
    emocoes_identificadas: emocoesArray,
  };

  return formattedData;
};

// Exporta as funções para serem usadas pelos controllers
export {
  salvarDiagnosticoCompleto,
  buscarRelatorioPorId
};