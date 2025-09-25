// Arquivo: src/pages/ResultadoPage.tsx (Versão original e limpa)

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// instância configurada do Axios para fazer chamadas à API
import api from '../services/api';
// Importa a "forma" do nosso objeto de relatório
import { IRelatorio } from '../types/empresa.types';
import '../styles/ResultadoPage.css';

const ResultadoPage = () => {
 const { id } = useParams<{ id: string }>();
 const [relatorio, setRelatorio] = useState<IRelatorio | null>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');

 useEffect(() => {
  if (id) {
   api.get(`/relatorio/${id}`)
    .then(response => {
     // O backend agora garante que 'sugestoes' e 'emocoes_identificadas' são arrays.
     setRelatorio(response.data);
    })
    .catch(err => {
     setError('Não foi possível carregar o relatório. Verifique o ID e tente novamente.');
    })
    .finally(() => {
     setLoading(false);
    });
  }
 }, [id]);

 if (loading) {
  return <div className="loading-error-container">Carregando resultado...</div>;
 }

 if (error) {
  return <div className="loading-error-container error-message">{error}</div>;
 }

 return (
  <div className="resultado-container">
   <h1>Diagnóstico Final</h1>
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