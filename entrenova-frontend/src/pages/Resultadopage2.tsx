import { useState, useEffect } from 'react';
import '../styles/ResultadoPage.css';

const Resultadopage2 = () => {
  const [resultadoFinal, setResultadoFinal] = useState<any>(null);

  useEffect(() => {
    // Recupera os dados que salvamos no localStorage após o chatbot finalizar
    const data = localStorage.getItem('resultadoFinal');
    if (data) {
      setResultadoFinal(JSON.parse(data));
    }
  }, []);

  if (!resultadoFinal) {
    return <div className="loading-error-container">Carregando resultado final...</div>;
  }

  const resumo2Texto = resultadoFinal.relatorio2?.resumo2 || '';
  const trilha = resultadoFinal.trilha || [];

  return (
    <div className="resultado-container">
      <h1>Resumo e Trilha</h1>
      
      <div className="relatorio-card">
        <div className="relatorio-secao">
          <strong>Resumo 2:</strong>
          <p>{resumo2Texto}</p>
        </div>

        <div className="relatorio-secao">
          <strong>Trilha Personalizada:</strong>
          <ul>
            {trilha.map((item: any, index: number) => (
              <li key={index}>
                {item.titulo} - {item.tipo} {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer">🔗</a>}
              </li>
            ))}
          </ul>
        </div>
      </div>

            <div className="contato-pagamento">
        <p>
          Para acertar o pagamento da sua trilha e receber os conteúdos, por favor, entre em contato com a Entrenova pelo e-mail{' '}
          <strong>entrenovaflix@gmail.com</strong>. Informe o CNPJ da sua empresa, e você receberá um retorno caso haja interesse real pela trilha.
        </p>
      </div>

    </div>
  );
};

export default Resultadopage2;
