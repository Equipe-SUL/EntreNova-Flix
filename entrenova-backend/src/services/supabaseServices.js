import supabase from '../config/supabase.js';
import { analisarRespostasComIA } from './iaServices.js';
import { perguntasLead } from '../data/quizdata.js';
import { enviarEmailDiagnostico } from './emailServices.js';

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
 * chama a IA para o Diagnóstico Profundo e salva os resultados estruturados
 * nas tabelas 'relatorios' и 'analises_ia'.
 */
const salvarDiagnosticoCompleto = async (dadosEmpresa, dadosQuiz, scoreLead = null) => {
  // --- Validações iniciais (isso aqui continua igual!) ---
  const cnpjExistente = await verificarCnpjExistente(dadosEmpresa.cnpj);
  if (cnpjExistente) {
    throw new Error('Não foi possível salvar os dados da empresa. O CNPJ pode já existir.');
  }

  // Passo A: Salvar na tabela 'empresas' (continua igual!)
  const { error: errorEmpresa } = await supabase
    .from('empresas')
    .insert([dadosEmpresa]);

  if (errorEmpresa) {
    console.error('Erro ao salvar empresa:', errorEmpresa);
    throw new Error('Não foi possível salvar os dados da empresa.');
  }

  // Passo B: Salvar respostas do quiz (continua igual!)
  const respostasParaInserir = dadosQuiz.map(item => ({
    pergunta: item.perguntaId,
    resposta: item.respostaIndex,
    categoria: item.perguntaId.charAt(0),
    tipo_diagnostico: 'inicial',
    cnpj_empresa: dadosEmpresa.cnpj
  }));

  if (respostasParaInserir.length > 0) {
    const { error: errorRespostas } = await supabase
      .from('respostas')
      .insert(respostasParaInserir);
    if (errorRespostas) {
      console.error('Erro ao salvar respostas iniciais:', errorRespostas);
      // Decide se quer parar ou continuar mesmo se as respostas não salvarem
    }
  }

  // --- A MÁGICA COMEÇA A MUDAR AQUI! ---

  // Passo C: Chamar a NOVA IA para o Diagnóstico Profundo
  console.log('Iniciando Diagnóstico Profundo com a IA...');
  const analiseIA = await analisarRespostasComIA(dadosEmpresa, dadosQuiz);

  if (!analiseIA || analiseIA.error) {
    throw new Error(`Falha ao gerar a análise da IA: ${analiseIA.details || 'Erro desconhecido'}`);
  }

  // Passo D: Preparar os dados para salvar no Supabase (A NOVA LÓGICA!)

  // D.1: Preparando o registro principal para a tabela 'relatorios'
  const dadosRelatorio = {
    cnpj_empresa: dadosEmpresa.cnpj,
    // O novo campo 'relatorio1_narrativo' vai receber o objeto JSON completo.
    // O Supabase vai adorar isso!
    relatorio1_narrativo: analiseIA.relatorio_narrativo,
    // O novo campo 'nota_dho' recebe o número direto.
    nota_dho: analiseIA.indice_dho.nota_indicativa,
    // Podemos criar um resumo simples para o campo 'resumo1' que você já tinha.
    resumo1: analiseIA.relatorio_narrativo.D1_descoberta,
    // Adiciona a classificação do lead se ela existir.
    lead: scoreLead?.classificacao || null,
  };

  // D.2: Salvar o registro principal e pegar o ID dele
  const { data: relatorioData, error: errorRelatorio } = await supabase
    .from('relatorios')
    .insert([dadosRelatorio])
    .select('id') // A gente precisa do ID para a próxima etapa!
    .single();

  if (errorRelatorio) {
    console.error('Erro ao criar registro do relatório:', errorRelatorio);
    throw new Error('Falha ao gerar o registro do relatório.');
  }

  // D.3: Preparando os dados detalhados para a tabela 'analises_ia'
  const dadosAnaliseIA = {
    relatorio_id: relatorioData.id, // Conectamos as duas tabelas!
    // O campo 'problemas_centrais' recebe o array de problemas completo.
    problemas_centrais: analiseIA.problemas_centrais,
    // Podemos guardar a justificativa do DHO aqui também, em um campo de texto.
    // (Você precisaria criar uma coluna 'justificativa_dho' do tipo text)
    justificativa_dho: analiseIA.indice_dho.justificativa,
  };

  const { error: errorAnalise } = await supabase
    .from('analises_ia')
    .insert([dadosAnaliseIA]);

  if (errorAnalise) {
    console.error('Erro ao salvar análise detalhada da IA:', errorAnalise);
    // Mesmo que isso falhe, o relatório principal foi salvo.
    // Podemos só logar o erro e continuar.
  }

  // Passo E: Enviar e-mail (agora com dados muito mais ricos!)
  console.log('Enviando e-mail com o diagnóstico...');
  // Você pode adaptar a função de e-mail para usar os novos dados estruturados
  // e montar um e-mail muito mais bonito e informativo!
  await enviarEmailDiagnostico(dadosEmpresa, {
    resumo_ia: analiseIA.relatorio_narrativo.D1_descoberta,
    relatorioCompleto: JSON.stringify(analiseIA.relatorio_narrativo, null, 2), // Uma forma simples de mostrar tudo
    sugestoes: analiseIA.problemas_centrais.map(p => p.problema),
    lead: scoreLead?.classificacao || null,
  });


  console.log('✅ Diagnóstico completo salvo com sucesso! ID:', relatorioData.id);
  return { success: true, reportId: relatorioData.id };
};

/**
 * Busca um relatório (tabela 'relatorios') e os detalhes da análise (tabela 'analises_ia') por ID.
 * Retorna apenas os campos necessários para o frontend (omite tom e emoções).
 */
// VERSÃO DE TRANSIÇÃO - PARA LER OS DADOS DO BANCO ATUAL

const buscarRelatorioPorId = async (id) => {
  console.log(`Buscando relatório ID: ${id} (modo denso)...`);
  const { data, error } = await supabase
    .from('relatorios')
    .select('*, analises_ia(*)') // Seleciona o relatório e sua análise IA associada
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Erro ao buscar relatório:', error);
    throw new Error('Relatório não encontrado.');
  }
  if (!data.analises_ia || data.analises_ia.length === 0) {
    throw new Error('Análise detalhada da IA para este relatório não foi encontrada.');
  }

  const analise = data.analises_ia[0];

  // --- NOVA LÓGICA: ENVIAR DADOS ESTRUTURADOS ---
  // Montamos um objeto que envia a estrutura completa para o frontend.
  const formattedData = {
    id: data.id,
    lead: data.lead,
    nota_dho: data.nota_dho,
    problemas_centrais: analise.problemas_centrais, // Array completo
    relatorio_narrativo: data.relatorio1_narrativo, // Objeto completo
    indice_dho: {
      nota_indicativa: data.nota_dho,
      justificativa: analise.justificativa_dho,
    },
  };

  console.log('Dados densos formatados para o frontend:', formattedData);
  return formattedData;
};


const buscarEmpresaPorCnpj = async (cnpj) => {
  // Linha do cnpjLimpo REMOVIDA

  const { data, error } = await supabase
    .from('empresas') 
    .select('nome, cnpj, email, telefone, setor') 
    .eq('cnpj', cnpj) // Busca pelo CNPJ original
    .single(); 

  if (error || !data) {
    console.error('Erro ao buscar empresa por CNPJ:', error);
    // CORREÇÃO AQUI: Usar 'cnpj' na mensagem de erro, em vez de 'cnpjLimpo'
    throw new Error(`Empresa com CNPJ ${cnpj} não encontrada.`); 
  }

  return data; 
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
  buscarRelatorioPorCnpj,
  buscarEmpresaPorCnpj
};