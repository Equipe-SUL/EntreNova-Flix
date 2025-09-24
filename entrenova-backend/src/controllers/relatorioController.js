import { buscarRelatorioPorId } from '../services/supabaseServices.js';

const buscarPorId = async (req, res) => {
  try {
    // Pega o ID que vem na URL (ex: /api/relatorio/123 -> o id é 123)
    const id = req.params.id;
    
    // Chama a função do nosso serviço que busca os dados no Supabase
    const relatorio = await buscarRelatorioPorId(id);
    
    // Se encontrou, retorna o relatório como JSON
    res.json(relatorio);
  } catch (error) {
    // Se o serviço der um erro (ex: relatório não encontrado), retorna um erro 404
    res.status(404).json({ erro: error.message });
  }
};

export { buscarPorId };