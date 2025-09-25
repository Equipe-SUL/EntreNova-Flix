// Arquivo: src/services/SupabaseServices.js (Alterado para consolidar dados na tabela 'relatorios')

import supabase from '../config/supabase.js';
import { analisarRespostasComIA } from './iaServices.js';

/**
 * Orquestra o processo completo de salvar um diagnóstico, consolidando 
 * todos os dados da IA em resumo1 e relatorio1 da tabela 'relatorios'.
 */
const salvarDiagnosticoCompleto = async (dadosEmpresa, dadosQuiz) => {
  // ... (Passos A e B: Salvar empresa e respostas - SEM MUDANÇAS) ...
  
  // Passo C: Chamar a IA para gerar a análise completa
  console.log('Iniciando análise com a IA...');
  const analiseIA = await analisarRespostasComIA(dadosEmpresa, dadosQuiz);

  if (!analiseIA) {
    throw new Error('Falha ao gerar a análise da IA.');
  }

  // --- CONSOLIDAÇÃO DOS DADOS DA IA ---
  // A coluna 'relatorio1' armazenará os dados estruturados da IA em JSON
  const relatorioConsolidado = {
    maior_problema: analiseIA.maiorProblema,
    sugestoes: analiseIA.sugestoes,
    tom_analise: analiseIA.tom,
    emocoes_identificadas: analiseIA.emocoes,
  };
  
  // Passo D: Salvar na tabela 'relatorios'
  const { data: relatorioData, error: errorRelatorio } = await supabase
    .from('relatorios')
    .insert([{
      cnpj_empresa: dadosEmpresa.cnpj,
      // resumo1 recebe o resumo da IA
      resumo1: analiseIA.resumo,
      // relatorio1 recebe todos os outros dados em formato JSON (string)
      relatorio1: JSON.stringify(relatorioConsolidado),
      // trilha, resumo2, relatorio2 permanecem nulos ou vazios
    }])
    .select('id')
    .single();

  if (errorRelatorio) {
    console.error('Erro ao criar relatório:', errorRelatorio);
    throw new Error('Falha ao gerar o registro do relatório.');
  }
  
  // Passo E: Retornar o ID
  return { success: true, reportId: relatorioData.id };
};


/**
 * Busca o relatório e desestrutura os dados consolidados do relatorio1.
 */
const buscarRelatorioPorId = async (id) => {
    const { data, error } = await supabase
      .from('relatorios')
      .select('*')
      .eq('id', id)
      .single();
  
    if (error || !data || !data.relatorio1) {
      throw new Error('Relatório não encontrado ou dados ausentes.');
    }

    // Descompacta o JSON da coluna relatorio1
    const dadosConsolidados = JSON.parse(data.relatorio1);
    
    // Formata o objeto final no padrão esperado pelo frontend (IRelatorio)
    const formattedData = {
      id: data.id,
      resumo_ia: data.resumo1,
      maior_problema: dadosConsolidados.maior_problema,
      // Sugestões e Emoções já vêm como arrays do JSON.parse(relatorio1)
      sugestoes: dadosConsolidados.sugestoes || [], 
      tom_analise: dadosConsolidados.tom_analise,
      emocoes_identificadas: dadosConsolidados.emocoes_identificadas || [],
    };
    
    return formattedData;
};

// Exporta as funções para serem usadas pelos controllers
export {
  salvarDiagnosticoCompleto,
  buscarRelatorioPorId
};