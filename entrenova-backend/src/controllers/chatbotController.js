import { verificarCnpjExistente, salvarRespostaChat, salvarPlanoChat } from '../services/supabaseServices.js';

export const salvarPlano = async (req, res) => {
  try {
    const { cnpj, plano } = req.body;

    if (!cnpj || !plano) {
      return res.status(400).json({ erro: 'CNPJ e plano são obrigatórios.' });
    }

    await salvarPlanoChat({ cnpj, plano });
    res.status(201).json({ mensagem: 'Plano salvo com sucesso!' });

  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

export const validarCnpj = async (req, res) => {
  try {
    const { cnpj } = req.body;
    if (!cnpj) {
      return res.status(400).json({ erro: 'CNPJ é obrigatório.' });
    }
    
    const existe = await verificarCnpjExistente(cnpj);
    
    res.status(200).json({ valido: existe });

  } catch (error) {
    console.error("Erro ao validar CNPJ:", error);
    res.status(500).json({ erro: 'Erro interno ao validar CNPJ.' });
  }
};

// Função para o endpoint /salvar-resposta (com logs de depuração)
export const salvarResposta = async (req, res) => {
  try {
    const { cnpj, pergunta, resposta } = req.body;

    if (!cnpj || !pergunta || !resposta) {
      console.log("--> VALIDAÇÃO FALHOU: Dados insuficientes.");
      return res.status(400).json({ erro: 'Dados insuficientes para salvar a resposta.' });
    }

    console.log("--> Dados validados. Tentando salvar no banco...");
    await salvarRespostaChat({
      cnpj,
      pergunta,
      resposta
    });

    console.log("--> SUCESSO: Resposta salva no banco.");
    res.status(201).json({ mensagem: 'Resposta salva com sucesso!' });

  } catch (error) {
    console.error("!!!!!! ERRO CAPTURADO NO CATCH DO CONTROLLER !!!!!!");
    console.error(error); 
    res.status(500).json({ erro: error.message });
  }
};
