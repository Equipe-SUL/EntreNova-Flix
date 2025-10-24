import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import { IRelatorio } from '../types/empresa.types';
import '../styles/ResultadoPage.css';
import diagnosticoImg from '../assets/irisNeon3.png';

const ResultadoPage = () => {
  const { id } = useParams<{ id: string }>();
  const [relatorio, setRelatorio] = useState<IRelatorio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      api.get(`/relatorio/${id}`)
        .then(response => {
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
    return <div className="loading-error-container">Carregando diagnóstico denso...</div>;
  }

  if (error) {
    return <div className="loading-error-container error-message">{error}</div>;
  }

  return (
    <div className="resultado-container">
      <h1>Diagnóstico Empresarial Completo</h1>

      {relatorio ? (
        <div className="relatorio-card">

          {/* SEÇÃO 1: Descoberta e Resumo */}
          <div className="relatorio-secao">
            <h3>Primeira Descoberta (D1)</h3>
            <p className="secao-destaque">{relatorio.relatorio_narrativo.D1_descoberta}</p>
          </div>

          {/* SEÇÃO 2: Problemas Centrais e Análise */}
          <div className="relatorio-secao">
            <h3>Problemas Centrais e Análise Consultiva (D3)</h3>
            {relatorio.problemas_centrais.map((item, index) => (
              <div key={index} className="problema-item">
                <strong>{item.problema} <span className={`classificacao ${item.classificacao.toLowerCase()}`}>({item.classificacao} - Score: {item.score})</span></strong>
                <p><strong>Soft Skills em Falta:</strong> {item.soft_skills_mapeadas.map(s => s.skill).join(', ')}</p>
                <p className="analise-consultiva">
                  <strong>Análise:</strong> {relatorio.relatorio_narrativo.D3_analise_consultiva.find(a => a.problema === item.problema)?.analise}
                </p>
              </div>
            ))}
          </div>

          {/* SEÇÃO 3: Cenários Futuros */}
          <div className="relatorio-secao">
            <h3>Cenários Futuros (D5)</h3>
            <div className="cenarios-container">
              <div className="cenario-item evolucao">
                <strong>Cenário de Evolução:</strong>
                <p>{relatorio.relatorio_narrativo.D5_cenarios_futuros.evolucao}</p>
              </div>
              <div className="cenario-item deterioracao">
                <strong>Cenário de Deterioração:</strong>
                <p>{relatorio.relatorio_narrativo.D5_cenarios_futuros.deterioracao}</p>
              </div>
            </div>
          </div>

          {/* SEÇÃO 4: Pontos Fortes e Próximos Passos */}
          <div className="relatorio-secao-flex">
            <div className="relatorio-metade">
              <h3>Pontos Fortes</h3>
              <ul>
                {relatorio.relatorio_narrativo.pontos_fortes.map((ponto, index) => (
                  <li key={index}>{ponto}</li>
                ))}
              </ul>
            </div>
            <div className="relatorio-metade">
              <h3>Direcionamento Estratégico (GROW - D6)</h3>
              <p><strong>Meta Principal (Goal):</strong> {relatorio.relatorio_narrativo.D6_direcionamento_grow.goal}</p>
              <p><strong>Opções Sugeridas (Options):</strong></p>
              <ul>
                {relatorio.relatorio_narrativo.D6_direcionamento_grow.options.map((opt, index) => (
                  <li key={index}>{opt}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* SEÇÃO 5: Índice DHO e Trilhas */}
          <div className="relatorio-secao">
            <h3>Índice DHO e Recomendações (D7)</h3>
            <div className="indice-dho">
              <strong>Nota Indicativa de DHO:</strong>
              <span className="nota-dho">{relatorio.indice_dho.nota_indicativa.toFixed(1)} / 5.0</span>
              <p className="justificativa-dho">{relatorio.indice_dho.justificativa}</p>
            </div>
            <div className="trilhas-recomendadas">
              <strong>Trilhas de Fundação Recomendadas:</strong>
              <ul>
                {relatorio.relatorio_narrativo.D7_design_desenvolvimento.trilhas_fundacao.map((trilha, index) => (
                  <li key={index}>{trilha}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      ) : (
        <p>Nenhum relatório encontrado para este ID.</p>
      )}

      {/* --- balaozinho da iris --- */}
      <div className="advanced-cta-box">
        <img src={diagnosticoImg} alt="Análise de Dados" className="advanced-cta-icon" />
        <div className="advanced-cta-text">
<h3>Sua análise inicial está pronta. Vamos aprofundar?</h3>

          <p>

            O próximo passo é conversar com a <strong>Iris</strong>, nossa <strong>assistente virtual</strong>.

            Em 10 minutos, ela irá cruzar estes dados com os desafios reais da sua equipe para gerar seu <strong>Diagnóstico Avançado</strong> gratuito.

          </p>

        </div>

      </div>

      {/* --- FIM DO balaozinho da iris --- */}


      {/* ===================== INÍCIO DA CORREÇÃO ===================== */}
      <Link to="/chatbot" className="link-botao">
      {/* ====================== FIM DA CORREÇÃO ======================= */}
        <button className="next-btn">Ir para Diagnostico Avançado</button>
      </Link>
    </div>
  );
};

export default ResultadoPage;