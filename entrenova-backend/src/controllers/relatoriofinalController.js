import { buscarConversaPorCnpj, buscarRelatorioPorCnpj, atualizarRelatorio, buscarConteudos } from "../services/supabaseServices.js";
import { gerarNovoRelatorio } from "../services/iaServices.js";
import { enviarEmailRelatorio2 } from "../services/emailServices.js";



/**
 * Controller para gerar e salvar relatório 2, resumo2 e trilha
 */
export const gerarRelatorioTotal = async (req, res) => {
  try {
    const { cnpj } = req.body;
    if (!cnpj) return res.status(400).json({ error: "CNPJ obrigatório" });

    console.log("🔹 Iniciando geração de relatório para CNPJ:", cnpj);

    // 1️⃣ Buscar conversas/respostas do chat
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
    const relatorioDB = await buscarRelatorioPorCnpj(cnpj);
    const relatorio1 = relatorioDB?.relatorio1 || "";
    const plano = relatorioDB?.plano || "basico";
    console.log("🔹 Relatório 1 e plano encontrados:", plano);

    // 3️⃣ Determinar preferência de conteúdo
    const preferenciaPergunta = "Por fim, ao gerar as trilhas, qual tipo de conteúdo você prefere ver na maioria delas? (Ex: Vídeos, Podcasts, Cursos Curtos)";
    const respostaPreferenciaObj = chatData.find(c => {
      if (!c.mensagem_recebida) return false;
      const original = c.mensagem_recebida.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
      const alvo = preferenciaPergunta.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
      return original === alvo;
    });

    if (!respostaPreferenciaObj || !respostaPreferenciaObj.mensagem_enviada) {
      throw new Error("❌ Resposta de preferência de conteúdo não encontrada no chat!");
    }

    let resposta = respostaPreferenciaObj.mensagem_enviada
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .trim().toLowerCase()
      .replace(/s$/, "");

    const tiposConteudoValidos = ["video", "quiz", "curso curto", "podcast", "palestra", "artigo"];
    if (!tiposConteudoValidos.includes(resposta)) {
      throw new Error(`❌ Resposta de preferência de conteúdo inválida: "${respostaPreferenciaObj.mensagem_enviada}"`);
    }

    const preferenciaConteudo = resposta;
    console.log("🔹 Preferência de conteúdo:", preferenciaConteudo);

    // 4️⃣ Gerar relatório2 com IA
    const relatorio2IA = await gerarNovoRelatorio(
      { nome: "Empresa " + cnpj, cnpj },
      dadosQuizFormatado,
      plano,
      preferenciaConteudo
    );
    if (!relatorio2IA) throw new Error("Falha ao gerar relatorio2");
    console.log("✅ Relatório 2 gerado com IA");
    const resumo2 = relatorio2IA.resumo2;

    // 5️⃣ Determinar quantidade de conteúdos da trilha
    const qtdConteudos = 3;
    //const qtdConteudos = (plano?.toLowerCase() === "básico") ? 5 : 7;

    // 6️⃣ Buscar conteúdos disponíveis
    const conteudosDisponiveis = await buscarConteudos();
    console.log(`🔹 Conteúdos disponíveis: ${conteudosDisponiveis.length}`);

    // 7️⃣ Gerar trilha usando apenas dados do banco
    let trilha = [];
if (conteudosDisponiveis.length > 0) {
  // Prioriza preferidos
  const preferidos = conteudosDisponiveis.filter(c => c.modelo?.toLowerCase() === preferenciaConteudo.toLowerCase());
  const qtdPreferidos = Math.min(Math.max(2, preferidos.length), 3);
  const selecionadosPreferidos = preferidos.slice(0, qtdPreferidos);

  const restantes = qtdConteudos - selecionadosPreferidos.length;
  const restantesDisponiveis = conteudosDisponiveis.filter(c => !selecionadosPreferidos.includes(c));
  const selecionadosDiversos = [];
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
