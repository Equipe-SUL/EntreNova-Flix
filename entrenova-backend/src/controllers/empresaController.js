// controllers/empresaController.js
import { verificarCnpjExistente, salvarRespostaChat, buscarEmpresaPorCnpj } from '../services/supabaseServices.js';

/**
 * Valida se o CNPJ informado já existe na base.
 * Retorna { valido: true } se o CNPJ não existir ainda (ou seja, pode cadastrar).
 */
export const validarCnpj = async (req, res) => {
  try {
    const { cnpj } = req.body;

    if (!cnpj) {
      return res.status(400).json({ erro: 'CNPJ é obrigatório.' });
    }

    // Usa o serviço do Supabase
    const existe = await verificarCnpjExistente(cnpj);

    // Retorna true se CNPJ não existe (pode cadastrar)
    res.status(200).json({ valido: !existe });

  } catch (error) {
    console.error("Erro ao validar CNPJ:", error);
    res.status(500).json({ erro: 'Erro interno ao validar CNPJ.' });
  }
};

/**
 * Salva uma resposta do questionário para a empresa.
 */
export const salvarResposta = async (req, res) => {
  try {
    const { cnpj, pergunta, resposta } = req.body;

    if (!cnpj || !pergunta || !resposta) {
      console.log("--> VALIDAÇÃO FALHOU: Dados insuficientes.");
      return res.status(400).json({ erro: 'Dados insuficientes para salvar a resposta.' });
    }

    console.log("--> Dados validados. Tentando salvar no banco...");
    await salvarRespostaChat({ cnpj, pergunta, resposta });

    console.log("--> SUCESSO: Resposta salva no banco.");
    res.status(201).json({ mensagem: 'Resposta da empresa salva com sucesso!' });

  } catch (error) {
    console.error("!!!!!! ERRO CAPTURADO NO CATCH DO CONTROLLER !!!!!!");
    console.error(error); 
    res.status(500).json({ erro: error.message });
  }
};


export const getEmpresa = async (req, res) => {
  try {
    // Pega o CNPJ do parâmetro da URL (ex: /api/empresa/12345)
    const { cnpj } = req.params; 

    if (!cnpj) {
      return res.status(400).json({ erro: 'CNPJ é obrigatório na URL.' });
    }

    // Chama o serviço que busca no Supabase
    const empresaData = await buscarEmpresaPorCnpj(cnpj);

    // Retorna os dados da empresa como JSON
    res.status(200).json(empresaData);

  } catch (error) {
    // Se o serviço der erro (ex: não encontrar), retorna 404
    console.error("Erro no controller getEmpresa:", error.message);
    res.status(404).json({ erro: error.message });
  }
};
