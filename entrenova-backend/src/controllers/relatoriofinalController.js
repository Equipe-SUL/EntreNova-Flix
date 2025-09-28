import { 
  buscarConversaPorCnpj, 
  buscarRelatorioPorCnpj, 
  atualizarRelatorio, 
  buscarConteudos 
} from "../services/supabaseServices.js";
import { gerarNovoRelatorio, gerarTrilhaConteudos } from "../services/iaServices.js";

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

    // Formatar respostas do chat
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
    const respostasPreferencia = chatData
      .filter(r => r.pergunta === preferenciaPergunta)
      .map(r => r.resposta);

    let preferenciaConteudo = "texto"; // padrão
    if (respostasPreferencia.length > 0) {
      const freqMap = {};
      respostasPreferencia.forEach(p => (freqMap[p] = (freqMap[p] || 0) + 1));
      preferenciaConteudo = Object.keys(freqMap).reduce((a, b) =>
        freqMap[a] > freqMap[b] ? a : b
      );
    }
    console.log("🔹 Preferência de conteúdo:", preferenciaConteudo);

    // 4️⃣ Gerar relatório2 com IA (usando plano e preferenciaConteudo)
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
    const qtdConteudos = plano === "basico" ? 5 : 7;

    // 6️⃣ Buscar conteúdos disponíveis
    const conteudosDisponiveis = await buscarConteudos();
    console.log(`🔹 Conteúdos disponíveis: ${conteudosDisponiveis.length}`);

    // 7️⃣ Gerar trilha usando IA
    const trilha = await gerarTrilhaConteudos(
      { relatorio1, relatorio2: relatorio2IA, qtdConteudos, preferenciaConteudo },
      conteudosDisponiveis
    );
    console.log(`✅ Trilha gerada com ${trilha.length} conteúdos`);

    // 8️⃣ Transformar relatorio2 e trilha em texto legível para salvar no banco
    const textoRelatorio2 = relatorio2IA.relatorio2

    const textoTrilha = trilha.map((c, i) => `${i + 1}. ${c.titulo} - ${c.tipo}`).join("\n");

    // 9️⃣ Salvar relatório2, resumo2 e trilha no banco (relatorio1 e resumo1 permanecem intactos)
    await atualizarRelatorio(cnpj, {
  relatorio2: textoRelatorio2,
  resumo2: resumo2,
  trilha: textoTrilha,
});
console.log("✅ Relatórios salvos no banco");

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
