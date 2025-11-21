import { buscarConversaPorCnpj, buscarRelatorioPorCnpj, atualizarRelatorio, buscarConteudos } from "../services/supabaseServices.js";
import { gerarNovoRelatorio } from "../services/iaServices.js";
import { enviarEmailRelatorio2 } from "../services/emailServices.js";

// Mapeamento para simplificar a preferência de conteúdo (Frontend deve enviar o número)
const MAPA_PREFERENCIA = {
  "1": "video",
  "2": "podcast",
  "3": "curso curto",
  "4": "artigo",
  // '5' será tratado como nenhuma preferência específica (trilha diversa)
};

/**
 * Controller para gerar e salvar relatório 2, resumo2 e trilha
 */
export const gerarRelatorioTotal = async (req, res) => {
  try {
    const { cnpj } = req.body;
    if (!cnpj) return res.status(400).json({ error: "CNPJ obrigatório" });

    console.log("🔹 Iniciando geração de relatório para CNPJ:", cnpj);

    // 1️⃣ Buscar conversas/respostas do chat
    //
    const chatData = await buscarConversaPorCnpj(cnpj); 
    if (!chatData || chatData.length === 0) {
      console.warn("❌ Nenhuma conversa encontrada para este CNPJ:", cnpj);
      throw new Error("Dados da conversa não encontrados");
    }
    console.log(`✅ Conversas encontradas: ${chatData.length} registros`);

    const dadosQuizFormatado = chatData.map(c => ({
      pergunta: c.mensagem_recebida,
      resposta: c.mensagem_enviada
    }));

    // 2️⃣ Buscar dados existentes do relatório 1 e plano
    //
    const relatorioDB = await buscarRelatorioPorCnpj(cnpj);
    const relatorio1 = relatorioDB?.relatorio1 || "";
    const plano = relatorioDB?.plano || "basico";
    console.log("🔹 Relatório 1 e plano encontrados:", plano);

    // 3️⃣ Determinar preferência de conteúdo - SIMPLIFICADO PARA ENTRADA NUMÉRICA
    // Assume-se que a ÚLTIMA mensagem salva pelo usuário no chatData é a resposta de preferência.
    const respostaPreferenciaObj = chatData[chatData.length - 1]; 

    if (!respostaPreferenciaObj || !respostaPreferenciaObj.mensagem_enviada) {
      throw new Error("❌ Resposta de preferência de conteúdo não encontrada no chat!");
    }

    let respostaNumerica = respostaPreferenciaObj.mensagem_enviada.trim();
    let preferenciaConteudo = null; // Inicializa como null para trilha diversa

    if (MAPA_PREFERENCIA[respostaNumerica]) {
        // Se for 1, 2, 3 ou 4
        preferenciaConteudo = MAPA_PREFERENCIA[respostaNumerica];
        console.log("🔹 Preferência de conteúdo (via número):", preferenciaConteudo);
    } else if (respostaNumerica === "5" || respostaNumerica.toLowerCase() === "outro") {
        // Se for 5 ou "outro", mantém preferenciaConteudo como null (trilha diversa)
        console.log("🔹 Preferência de conteúdo: Nenhuma específica (Trilha Diversa).");
    } else {
        // Se for um valor inválido, lança erro
        throw new Error(`❌ Resposta de preferência de conteúdo inválida. Esperado um número de 1 a 5. Recebido: "${respostaNumerica}"`);
    }

    // 5️⃣ Determinar quantidade de conteúdos da trilha (7 para BÁSICO, 10 para PREMIUM)
    let qtdConteudos = 13;
    const planoLower = plano?.toLowerCase();
   
    console.log(`🔹 Quantidade total fixa de conteúdos para qualquer plano : ${qtdConteudos}`);

    // 4️⃣ Gerar relatório2 com IA
    //
    const relatorio2IA = await gerarNovoRelatorio(
      { nome: "Empresa " + cnpj, cnpj },
      dadosQuizFormatado,
      plano,
      relatorio1, // Passando o relatório 1 como contexto
      preferenciaConteudo // Passa o conteúdo ou null
    );
    if (!relatorio2IA) throw new Error("Falha ao gerar relatorio2");
    console.log("✅ Relatório 2 gerado com IA");
    const resumo2 = relatorio2IA.resumo2;


    // 6️⃣ Buscar conteúdos disponíveis
    //
    const conteudosDisponiveis = await buscarConteudos();
    console.log(`🔹 Conteúdos disponíveis: ${conteudosDisponiveis.length}`);

    // 7️⃣ Gerar trilha usando apenas dados do banco (Lógica: 75% DE PREFERÊNCIA)
    let trilha = [];
if (conteudosDisponiveis.length > 0) {
  let selecionadosPreferidos = [];
  
  // Condição para priorizar preferidos SÓ se houver preferênciaConteudo definida
  if (preferenciaConteudo) {
      // Cálculo: 75% da quantidade total de conteúdos (arredonda para baixo)
      const qtdPreferidosDesejada = Math.floor(qtdConteudos * 0.75); 
      
      // Prioriza preferidos, se houver uma preferência definida
      const preferidos = conteudosDisponiveis.filter(c => c.modelo?.toLowerCase() === preferenciaConteudo.toLowerCase());
      
      // A quantidade final de preferidos é o mínimo entre o desejado (75%) e o disponível no banco
      const qtdPreferidos = Math.min(qtdPreferidosDesejada, preferidos.length);
      
      selecionadosPreferidos = preferidos.slice(0, qtdPreferidos);
      console.log(`🔹 Selecionados preferidos (${preferenciaConteudo}): ${selecionadosPreferidos.length} (75% de ${qtdConteudos} é ${qtdPreferidosDesejada})`);
  }

  const restantes = qtdConteudos - selecionadosPreferidos.length;
  // Filtra os restantes disponíveis excluindo os já selecionados
  const restantesDisponiveis = conteudosDisponiveis.filter(c => !selecionadosPreferidos.includes(c));
  const selecionadosDiversos = [];
  
  // Seleciona conteúdos diversos (aleatórios) para preencher a trilha
  while (selecionadosDiversos.length < restantes && restantesDisponiveis.length > 0) {
    const index = Math.floor(Math.random() * restantesDisponiveis.length);
    selecionadosDiversos.push(restantesDisponiveis.splice(index, 1)[0]);
  }

  trilha = [...selecionadosPreferidos, ...selecionadosDiversos].sort(() => 0.5 - Math.random());

  // Garantir que só venha título e modelo do banco
  trilha = trilha.map(c => ({
  titulo: c.descricao,
  modelo: c.modelo
}));
}

    console.log(`✅ Trilha gerada com ${trilha.length} conteúdos`);

    // 8️⃣ Transformar relatorio2 e trilha em texto legível para salvar no banco
    const textoRelatorio2 = relatorio2IA.relatorio2;
    const textoTrilha = trilha.map((c, i) => `${i + 1}. ${c.titulo} - Modelo: ${c.modelo}`).join("\n");

    // 9️⃣ Salvar relatório2, resumo2 e trilha no banco
    //
    await atualizarRelatorio(cnpj, {
      relatorio2: textoRelatorio2,
      resumo2: resumo2,
      trilha: textoTrilha,
    });
    console.log("✅ Relatórios salvos no banco");

    await enviarEmailRelatorio2(
      { nome: "Empresa " + cnpj, cnpj }, 
      textoRelatorio2, 
      resumo2, 
      chatData.map(c => ({ remetente: "Cliente", mensagem: c.mensagem_recebida }))
        .concat(chatData.map(c => ({ remetente: "Iris", mensagem: c.mensagem_enviada }))),
      trilha
    );

    // 🔟 Retornar dados para frontend
    //
    res.json({
      relatorio2: relatorio2IA,
      resumo2,
      trilha,
    });

  } catch (error) {
    console.error("❌ Erro ao gerar relatório total:", error);
    res.status(500).json({ error: error.message });
  }
};