import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

// instância configurada do Axios para fazer chamadas à API
import api from '../services/api';

// Importa a "forma" do nosso objeto de relatório
import { IRelatorio } from '../types/empresa.types';

import '../styles/ResultadoPage.css';

const ResultadoPage = () => {

  // O hook 'useParams' pega os parâmetros da URL.
  const { id } = useParams<{ id: string }>();


  // 'relatorio': Para guardar os dados do relatório quando eles chegarem do backend. Começa como nulo.
  const [relatorio, setRelatorio] = useState<IRelatorio | null>(null);
  // 'loading': Um interruptor para sabermos se estamos esperando a resposta da API. Começa como verdadeiro.
  const [loading, setLoading] = useState(true);
  // 'error': Para guardar uma mensagem de erro, caso algo dê errado na busca. Começa vazio.
  const [error, setError] = useState('');

  

  useEffect(() => {
    // Só tentamos buscar os dados se o 'id' existir na URL
    if (id) {
      // Usamos nosso 'api' service para fazer uma requisição GET para o backend.
      api.get(`/relatorio/${id}`)
        .then(response => {
          // O backend agora garante que os dados são formatados e limpos.
          setRelatorio(response.data);
        })
        .catch(err => {
          // .catch() é executado se a requisição FALHAR.
          setError('Não foi possível carregar o relatório. Verifique o ID e tente novamente.');
        })
        .finally(() => {
          // Desligamos o interruptor de 'loading', pois a espera acabou.
          setLoading(false);
        });
    }
  }, [id]); // O [id] no final diz ao useEffect: "só execute esta busca novamente se o ID na URL mudar".



  // Se 'loading' estiver rodando, mostramos uma mensagem de espera = " ta carregando espera ai"
  if (loading) {
    return <div className="loading-error-container">Carregando resultado...</div>;
  }

  // Se a 'error' tiver alguma mensagem, mostramos o erro.
  if (error) {
    return <div className="loading-error-container error-message">{error}</div>;
  }

  // Se não estiver carregando e não houver erro, mostramos o relatório final.
  return (
    <div className="resultado-container">
      <h1>Diagnóstico Inicial</h1>
      {/* Verificamos se a memória 'relatorio' tem dados antes de tentar exibi-los */}
      {relatorio ? (
        <div className="relatorio-card">
          <div className="relatorio-secao">
            <strong>Resumo da Análise:</strong>
            <p>{relatorio.resumo_ia}</p>
          </div>

          <div className="relatorio-secao">
            <strong>Principal Desafio Identificado:</strong>
            <p>{relatorio.maior_problema}</p>
          </div>

          <div className="relatorio-secao">
            <strong>Sugestões Práticas:</strong>
            <ul>
              {relatorio.sugestoes.map((sugestao, index) => (
                <li key={index}>{sugestao}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>Nenhum relatório encontrado para este ID.</p>
      )}

      <Link to="/chatbot">
        <button className="next-btn">Avançar</button>
      </Link>
    </div>

  );
};

export default ResultadoPage;