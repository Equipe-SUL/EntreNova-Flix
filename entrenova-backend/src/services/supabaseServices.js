import supabase from '../config/supabase.js';
import { analisarRespostasComIA } from './iaServices.js';

/**
 * Orquestra o processo completo de salvar um diagnóstico:
 * 1. Salva os dados da empresa.
 * 2. Salva as respostas do questionário.
 * 3. Chama a IA para análise.
 * 4. Salva o relatório gerado pela IA.
 * 5. Retorna o ID do novo relatório.
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
    resposta: item.resposta, // Salvando o NÚMERO da resposta (1-4)
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

  // Passo D: Salvar o relatório completo mapeando para as colunas CORRETAS do seu SQL
  const { data: relatorioData, error: errorRelatorio } = await supabase
    .from('relatorios')
    .insert([{
      cnpj_empresa: dadosEmpresa.cnpj,
      resumo1: analiseIA.resumo,
      relatorio1: analiseIA.maiorProblema,
      trilha: JSON.stringify(analiseIA.sugestoes) // Mapeamos as sugestões para a coluna 'trilha'
    }])
    .select('id')
    .single();

  if (errorRelatorio) {
    console.error('Erro ao criar relatório:', errorRelatorio);
    throw new Error('Falha ao gerar o registro do relatório.');
  }
  
  // Passo E: Retornar o ID do relatório criado para o frontend
  return { success: true, reportId: relatorioData.id };
};


/**
 * Busca um relatório específico no banco de dados pelo seu ID.
 * @param {string} id - O ID do relatório a ser buscado.
 * @returns {Promise<object>} - O objeto com os dados do relatório.
 */
const buscarRelatorioPorId = async (id) => {
    const { data, error } = await supabase
      .from('relatorios')
      .select('*')
      .eq('id', id)
      .single();
  
    if (error) {
      throw new Error('Relatório não encontrado.');
    }
    return data;
};

// Exporta as funções para serem usadas pelos controllers
export {
  salvarDiagnosticoCompleto,
  buscarRelatorioPorId
};