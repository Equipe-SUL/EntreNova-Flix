// Resultadopage2.tsx
import { useState, useEffect } from 'react';
import '../styles/ResultadoPage2.css'; 
import { Link } from "react-router-dom"; 


import diagnosticoImg from '../assets/irisNeon3.png'; 

// Importe suas imagens de thumbnail (certifique-se que os caminhos estão corretos)
import thumb1 from '../assets/Trilhaaleatoria1.jpg';
import thumb2 from '../assets/Trilhaaleatoria2.jpg'; // Se tiver outras imagens, troque aqui
import thumb3 from '../assets/Trilhaaleatoria3.jpg'; // Se tiver outras imagens, troque aqui
import thumb4 from '../assets/Trilhaaleatoria4.jpg';
import thumb5 from '../assets/Trilhaaleatoria5.jpg';
import thumb6 from '../assets/Trilhaaleatoria6.jpg';
import thumb7 from '../assets/Trilhaaleatoria7.jpg';
import thumb8 from '../assets/Trilhaaleatoria8.jpg';
import thumb9 from '../assets/Trilhaaleatoria9.jpg';
import thumb10 from '../assets/Trilhaaleatoria10.jpg';

// Array com as imagens para rotacionar nos cards
const thumbnails = [thumb1, thumb2, thumb3, thumb4, thumb5, thumb6, thumb7, thumb8, thumb9, thumb10];

const Resultadopage2 = () => {
  const [resultadoFinal, setResultadoFinal] = useState<any>(null);
  // const navigate = useNavigate(); // Não está sendo usado nesta versão, pode comentar se quiser

  useEffect(() => {
    // Recupera os dados salvos no localStorage
    const data = localStorage.getItem('resultadoFinal');
    if (data) {
      try {
        setResultadoFinal(JSON.parse(data));
      } catch (e) {
        console.error("Falha ao analisar JSON do localStorage:", e);
        setResultadoFinal(null);
      }
    }
  }, []);

  if (!resultadoFinal) {
    return <div className="loading-error-container">Carregando resultado final...</div>;
  }

  // Pega os dados do localStorage
  const resumo2Texto = resultadoFinal.relatorio2?.resumo2 || 'Resumo do diagnóstico avançado não disponível.';
  const trilha = resultadoFinal.trilha || [];

  return (
    <div className="resultado-container">
      <h1>Diagnóstico Avançado e Trilha</h1>
      
      <div className="relatorio-card">

        {/* Seção 1: Resumo */}
        <div className="relatorio-secao">
          <h3>Resumo do Diagnóstico Avançado</h3>
          <p className="secao-destaque">
            {resumo2Texto}
          </p>
        </div>

         {/* Seção 1.5: Resumo */}
        <div className="relatorio-secao">
          <h3>Pronto para melhorar sua empresa de forma prática, simples, efetiva e rápida?</h3>
          <p className="secao-destaque">
            Para executar as melhorias e surtir os resultados esperados, é fundamental seguir uma trilha de aprendizado personalizada criada especialmente para seu negócio.<br></br>
            Abaixo você terá acesso à uma trilha personalizada adaptada às necessidades específicas que você nos contou ao longo de nossas conversas.
          </p>
        </div>

        {/* Seção 2: Trilha Personalizada - ESTILO GRID */}
        <div className="relatorio-secao">
          <h3>Sua Trilha Personalizada</h3>
          
          {/* Container do Grid */}
          <div className="trilha-grid">
            {trilha.length > 0 ? (
              trilha.map((item: any, index: number) => {
                // Extrai o título e o modelo com segurança
                const titulo = typeof item === 'object' && item.titulo ? item.titulo : String(item);
                const modelo = typeof item === 'object' && item.modelo ? item.modelo : 'Conteúdo';

                return (
                  // CARD INDIVIDUAL DA TRILHA
                  <div key={index} className="trilha-card">
                    
                    {/* Parte superior do card: Imagem e Badge */}
                    <div className="trilha-card-image-container">
                      <img 
                        src={thumbnails[index % thumbnails.length]} 
                        alt={`Preview ${titulo}`} 
                        className="trilha-thumbnail"
                      />
                      {/* Badge do tipo de modelo (ex: Vídeo) */}
                      <span className="trilha-modelo-badge">
                        {modelo}
                      </span>
                      {/* Ícone de Play sobreposto (opcional, para dar mais cara de vídeo) */}
                       <div className="trilha-play-overlay">
                         <span>▶</span>
                       </div>
                    </div>

                    {/* Parte inferior do card: Título */}
                    <div className="trilha-card-content">
                      <h4>{titulo}</h4>
                    </div>

                  </div>
                );
              })
            ) : (
              <p className="problema-item">Nenhuma trilha foi gerada para este diagnóstico.</p>
            )}
          </div>
        </div>
      </div>

      {/* CTA (balão de fala da Iris) */}
      <div className="advanced-cta-box">
        <img src={diagnosticoImg} alt="Assistente Iris" className="advanced-cta-icon" />
        <div className="advanced-cta-text">
          <h3>Sua trilha está pronta!</h3>
          <p>
           Descubra os planos disponíveis e tenha acesso a <strong> conteúdos exclusivos </strong> com <strong> trilhas de aprendizado personalizadas </strong> para sua empresa. Clique no botão abaixo e escolha o ideal para você.
          </p>
        </div>
      </div>

      {/* Botão de ação */}
      <Link to="/checkout" className="link-botao">
        <button className="next-btn">Ver Planos</button>
      </Link>

    </div>
  );
};

export default Resultadopage2;