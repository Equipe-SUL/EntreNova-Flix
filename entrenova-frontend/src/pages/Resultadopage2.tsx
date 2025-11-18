import { useState, useEffect } from 'react';
import '../styles/ResultadoPage2.css'; 
import { Link, useNavigate } from "react-router-dom"; 

import diagnosticoImg from '../assets/irisNeon3.png'; 

import thumb1 from '../assets/trilha_exemplos_final.png';
import thumb2 from '../assets/trilha_exemplos_final.png';
import thumb3 from '../assets/trilha_exemplos_final.png';

// Array com as imagens para usar no "trailer"
const thumbnails = [thumb1, thumb2, thumb3];

const Resultadopage2 = () => {
  const [resultadoFinal, setResultadoFinal] = useState<any>(null);
  const navigate = useNavigate();
  
  // --- LÓGICA DO "TEASER" ---
  // Guarda o ID (index) da trilha que está expandida. Começa com null (nenhuma).
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  // --- FIM DA LÓGICA ---

  useEffect(() => {
    // Recupera os dados que salvamos no localStorage após o chatbot finalizar
    const data = localStorage.getItem('resultadoFinal');
    if (data) {
      try {
        setResultadoFinal(JSON.parse(data));
      } catch (e) {
        console.error("Falha ao analisar JSON do localStorage:", e);
        setResultadoFinal(null); // Define como nulo se o JSON for inválido
      }
    }
  }, []); // Array de dependências vazio, executa apenas uma vez

  // --- LÓGICA DO "TEASER": Função para lidar com o clique na trilha ---
  const handleTrilhaClick = (index: number) => {
    if (expandedIndex === index) {
      // Se clicou no item que já estava aberto, fecha
      setExpandedIndex(null);
    } else {
      // Se clicou em um item fechado, abre
      setExpandedIndex(index);
    }
  };
  // --- FIM DA LÓGICA ---

  if (!resultadoFinal) {
    return <div className="loading-error-container">Carregando resultado final...</div>;
  }

  // Pega os dados do localStorage
  const resumo2Texto = resultadoFinal.relatorio2?.resumo2 || 'Resumo do diagnóstico avançado não disponível.';
  const trilha = resultadoFinal.trilha || [];

  return (
    // Usa o container principal (igual ao da Página 1)
    <div className="resultado-container">
      <h1>Diagnóstico Avançado e Trilha</h1>
      
      {/* Usa o card principal (igual ao da Página 1) */}
      <div className="relatorio-card">

        {/* Seção 1: Resumo (usando o estilo 'secao-destaque') */}
        <div className="relatorio-secao">
          <h3>Resumo do Diagnóstico Avançado</h3>
          <p className="secao-destaque">
            {resumo2Texto}
          </p>
        </div>

        {/* Seção 2: Trilha Personalizada (usando o estilo 'trilhas-recomendadas') */}
        <div className="relatorio-secao">
          <h3>Sua Trilha Personalizada</h3>
          <div className="trilhas-recomendadas">
            <ul>
              {trilha.length > 0 ? (
                trilha.map((item: any, index: number) => (
                  // --- ALTERAÇÃO: Adiciona o onClick e a classe dinâmica ---
                  <li 
                    key={index}
                    onClick={() => handleTrilhaClick(index)}
                    // Adiciona a classe 'expanded' se o index for o mesmo que está no estado
                    className={expandedIndex === index ? 'expanded' : ''}
                  >
                    <span className="trilha-texto">
                      {/* Lógica para exibir o texto da trilha */}
                      {typeof item === 'object' && item.titulo ? 
                        `${item.titulo} (Modelo: ${item.modelo || 'N/A'})` 
                        : 
                        String(item)
                      }
                    </span>
                    {/* Div escondida que expande no clique */}
                    <div className="trilha-preview">
                      <img 
                        src={thumbnails[index % thumbnails.length]} // Faz um ciclo entre as 3 imagens
                        alt="Preview da trilha" 
                      />
                    </div>
                  </li>
                  // --- FIM DA ALTERAÇÃO ---
                ))
              ) : (
                <li>Nenhuma trilha foi gerada para este diagnóstico.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Reutiliza o CTA (balão de fala da Iris) com novo texto */}
      <div className="advanced-cta-box">
        <img src={diagnosticoImg} alt="Assistente Iris" className="advanced-cta-icon" />
        <div className="advanced-cta-text">
          <h3>Sua trilha está pronta!</h3>
          <p>
           Descubra os planos disponíveis e tenha acesso a <strong> conteúdos exclusivos </strong> com <strong> trilhas de aprendizado personalizadas </strong> para sua empresa. Clique no botão abaixo e escolha o ideal para você.
          </p>
        </div>
      </div>

      {/* Reutiliza o botão de ação (igual ao da Página 1) */}
      <Link to="/checkout" className="link-botao">
        <button className="next-btn">Ver Planos</button>
      </Link>

    </div>
  );
};

export default Resultadopage2;