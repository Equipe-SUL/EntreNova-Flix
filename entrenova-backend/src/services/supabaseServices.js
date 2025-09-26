// SupabaseServises.js (Versão Corrigida)

import supabase from '../config/supabase.js';
import { analisarRespostasComIA } from './iaServices.js';
import { perguntasLead } from '../data/quizdata.js';

/**
 * Orquestra o processo completo: salva dados na 'empresas', 'respostas', 
 * salva o registro principal na 'relatorios' (com texto consolidado) 
 * e os detalhes estruturados na 'analises_ia'.
 */
const salvarDiagnosticoCompleto = async (dadosEmpresa, dadosQuiz, scoreLead) => { 
    // Passo A: Salvar na tabela 'empresas'
    const { error: errorEmpresa } = await supabase
        .from('empresas')
        .insert([dadosEmpresa]);

    if (errorEmpresa) {
        console.error('Erro ao salvar empresa:', errorEmpresa);
        throw new new Error('Não foi possível salvar os dados da empresa. O CNPJ pode já existir.');
    }

    // Passo B: Formatar e salvar na tabela 'respostas' (Respostas de Dimensão)
      const respostasDimensao = dadosQuiz.filter(item => item.tipo === 'dimensao'); // <-- NOVA LINHA

    const respostasParaInserir = respostasDimensao.map(item => ({ // <-- ALTERAÇÃO: Usando 'respostasDimensao'
        pergunta: item.pergunta,
        resposta: item.resposta, 
        categoria: item.pergunta.split('-')[0],
        tipo_diagnostico: 'inicial', // 'inicial' é seguro, pois já filtramos
        cnpj_empresa: dadosEmpresa.cnpj
    }));

    // Inserção das Respostas de Dimensão
    const { error: errorRespostasIniciais } = await supabase
        .from('respostas')
        .insert(respostasParaInserir);

    if (errorRespostasIniciais) {
        console.error('Erro ao salvar respostas iniciais:', errorRespostasIniciais);
        // Não é fatal, mas é bom logar.
    }


    // Passo B-2: Formatar e salvar na tabela 'respostas' (Lead Scoring)
    const respostasLead = dadosQuiz.filter(item => item.tipo === 'lead');
    
    // CORREÇÃO: Variável declarada aqui para garantir escopo global no bloco B-2/C
    let respostasLeadParaInserir = []; 

    if (respostasLead.length > 0) {
        respostasLeadParaInserir = respostasLead.map(item => {
            // OBS: 'perguntasLead' deve ser importado/definido para esta linha funcionar.
            const respostaAjustada = item.resposta - 1;
            const pontos = perguntasLead.find(p => p.id === item.pergunta)?.pontos[respostaAjustada] || 0;
            
            return {
                pergunta: item.pergunta,
                resposta: item.resposta, // Mantém o valor original (1,2,3...)
                categoria: 'lead',
                tipo_diagnostico: 'lead_scoring',
                cnpj_empresa: dadosEmpresa.cnpj,
            };
        });

        // NOTA: O primeiro 'insert' duplicado foi removido daqui.
    }

    // Salvar lead (Agora, esta é a única tentativa de inserção)
    if (respostasLeadParaInserir.length > 0) {
        const { error: errorRespostasLead } = await supabase
            .from('respostas')
            .insert(respostasLeadParaInserir);

        if (errorRespostasLead) {
            console.error('Erro ao salvar respostas do lead:', errorRespostasLead);
            // Lançar um erro mais específico para o cliente
            throw new Error('Não foi possível salvar as respostas do lead scoring.');
        }
    }

    // Passo C: Chamar a IA para gerar a análise completa
    console.log('Iniciando análise com a IA...');
    const analiseIA = await analisarRespostasComIA(dadosEmpresa, dadosQuiz);

    if (!analiseIA) {
        throw new Error('Falha ao gerar a análise da IA.');
    }
    
    // --- Geração do Texto Consolidado para relatorio1 ---
    const textoConsolidadoRelatorio1 = `
        **Principal Desafio:** ${analiseIA.maiorProblema}
        
        **Sugestões Práticas:**
        ${analiseIA.sugestoes.map((s, index) => `${index + 1}. ${s}`).join('\n')}
        
        **Tom da Análise:** ${analiseIA.tom}
        
        **Emoções Identificadas:** ${analiseIA.emocoes.join(', ')}
    `.trim();
    // ---------------------------------------------------

    // Passo D-1: Salvar o registro principal na tabela 'relatorios'
    const { data: relatorioData, error: errorRelatorio } = await supabase
        .from('relatorios')
        .insert([{
            cnpj_empresa: dadosEmpresa.cnpj,
            resumo1: analiseIA.resumo,
            relatorio1: textoConsolidadoRelatorio1, // Texto completo consolidado
            lead: scoreLead.classificacao
        }])
        .select('id')
        .single();

    if (errorRelatorio) {
        console.error('Erro ao criar registro do relatório:', errorRelatorio);
        throw new Error('Falha ao gerar o registro do relatório.');
    }

    // Passo D-2: Salvar os detalhes estruturados na tabela 'analises_ia'
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

    // Passo E: Retornar o ID
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

    // A resposta do JOIN do Supabase vem com a sub-tabela em um array, pegamos o primeiro item
    const analise = data.analises_ia[0];

    // Converte a string JSON de sugestões de volta para array
    let sugestoesArray = [];
    if (analise.sugestoes && typeof analise.sugestoes === 'string') {
        sugestoesArray = JSON.parse(analise.sugestoes);
    }

    // Mapeia e consolida os dados para o formato esperado pelo frontend (IRelatorio)
    const formattedData = {
        id: data.id,
        resumo_ia: analise.resumo,
        maior_problema: analise.maior_problema,
        sugestoes: sugestoesArray,
        // *** TOM_ANALISE e EMOCOES_IDENTIFICADAS FORAM OMITIDOS DO OBJETO DE RETORNO ***
        // Isso cumpre o requisito de não enviar esses dados ao frontend.
    };

    return formattedData;
};

// Exporta as funções
export {
    salvarDiagnosticoCompleto,
    buscarRelatorioPorId
};