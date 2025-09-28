import { salvarDiagnosticoCompleto } from '../services/supabaseServices.js';

const salvar = async (req, res) => {
  try {
    const { dadosEmpresa, dadosQuiz, scoreLead } = req.body;
    if (!dadosEmpresa || !dadosQuiz) {
      return res.status(400).json({ erro: 'Dados da empresa e do quiz são obrigatórios.' });
    }
    const resultado = await salvarDiagnosticoCompleto(dadosEmpresa, dadosQuiz, scoreLead);
    res.status(201).json({ 
      mensagem: 'Diagnóstico salvo com sucesso!',
      reportId: resultado.reportId
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

export { salvar };