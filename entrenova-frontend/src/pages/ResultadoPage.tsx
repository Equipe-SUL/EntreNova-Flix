import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// instância configurada do Axios para fazer chamadas à API
import api from '../services/api';

// Importa a "forma" do nosso objeto de relatório do arquivo central de tipos NOSSA TIPAGEM <-- ass. vivian
import { IRelatorio } from '../types/empresa.types';

import '../styles/ResultadoPage.css';

const ResultadoPage = () => {

  // O hook 'useParams' pega os parâmetros da URL.
  // Como nossa rota no App.tsx é "/resultado/:id", ele nos dá o valor de "id". 
  const { id } = useParams<{ id: string }>();

  
  //  'relatorio': Para guardar os dados do relatório quando eles chegarem do backend. Começa como nulo.
  const [relatorio, setRelatorio] = useState<IRelatorio | null>(null);
  //  'loading': Um interruptor para sabermos se estamos esperando a resposta da API. Começa como verdadeiro.
  const [loading, setLoading] = useState(true);
  //  'error': Para guardar uma mensagem de erro, caso algo dê errado na busca. Começa vazio.
  const [error, setError] = useState('');


  useEffect(() => {
    // Só tentamos buscar os dados se o 'id' existir na URL
    if (id) {
      // Usamos nosso 'api' service para fazer uma requisição GET para o backend.
      // A URL final será, por exemplo, 'http://localhost:3001/api/relatorio/123'
      api.get(`/relatorio/${id}`)
        .then(response => {
          // .then() é executado se a requisição for um SUCESSO.
          // Guardamos os dados recebidos do backend na nossa memória 'relatorio'.
          setRelatorio(response.data);
        })
        .catch(err => {
          // .catch() é executado se a requisição FALHAR.
          // Guardamos uma mensagem de erro na nossa memória 'error'.
          setError('Não foi possível carregar o relatório. Verifique o ID e tente novamente.');
        })
        .finally(() => {
          // .finally() é executado SEMPRE, independentemente de sucesso ou falha.
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

  // Se não estiver carregando e não houver erro, mostramos o relatório final. AMEMM!
  return (
    <div className="resultado-container">
      <h1>Diagnóstico Final</h1>
      {/* Verificamos se a memória 'relatorio' tem dados antes de tentar exibi-los */}
      {relatorio ? (
        <div className="relatorio-card">
          <h3>Relatório ID: {relatorio.id}</h3>
          
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

          <div className="relatorio-dados-flex">
            <div>
              <strong>Tom da Análise:</strong>
              <p>{relatorio.tom_analise}</p>
            </div>
            <div>
              <strong>Emoções Identificadas:</strong>
              <p>{relatorio.emocoes_identificadas.join(', ')}</p>
            </div>
          </div>
        </div>
      ) : (
        <p>Nenhum relatório encontrado para este ID.</p>
      )}
    </div>
  );
};

export default ResultadoPage;