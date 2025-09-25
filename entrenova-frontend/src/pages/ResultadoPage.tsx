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
  if (id) {
   api.get(`/relatorio/${id}`)
    .then(response => {
     // Crie uma cópia dos dados
     const dadosFormatados = { ...response.data };
     
     // Converte a string de sugestões para array
     if (dadosFormatados.sugestoes && typeof dadosFormatados.sugestoes === 'string') {
      dadosFormatados.sugestoes = JSON.parse(dadosFormatados.sugestoes);
     }

     // Converte a string de emoções para array
     if (dadosFormatados.emocoes_identificadas && typeof dadosFormatados.emocoes_identificadas === 'string') {
      dadosFormatados.emocoes_identificadas = JSON.parse(dadosFormatados.emocoes_identificadas);
     }

     setRelatorio(dadosFormatados);
    })
    .catch(err => {
     setError('Não foi possível carregar o relatório. Verifique o ID e tente novamente.');
    })
    .finally(() => {
     setLoading(false);
    });
  }
 }, [id]);


  
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


        </div>
      ) : (
        <p>Nenhum relatório encontrado para este ID.</p>
      )}
    </div>
  );
};

export default ResultadoPage;