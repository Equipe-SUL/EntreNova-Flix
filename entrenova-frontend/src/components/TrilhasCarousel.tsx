import React, { useRef } from 'react';
// Se quiser usar as imagens reais, importe-as aqui. 
// Vou usar placeholder colorido para funcionar direto.

const mockTrilhas = [
  { id: 1, titulo: "Liderança Ágil 2.0", tipo: "Vídeo", duracao: "45 min", cor: "#4a148c" },
  { id: 2, titulo: "Comunicação Não Violenta", tipo: "Curso", duracao: "2h 10m", cor: "#0d47a1" },
  { id: 3, titulo: "Gestão de Tempo e Prioridades", tipo: "Podcast", duracao: "20 min", cor: "#1b5e20" },
  { id: 4, titulo: "Onboarding: Cultura da Empresa", tipo: "Vídeo", duracao: "15 min", cor: "#b71c1c" },
  { id: 5, titulo: "Segurança da Informação", tipo: "Quiz", duracao: "10 min", cor: "#f57f17" },
  { id: 6, titulo: "Feedback Efetivo", tipo: "Workshop", duracao: "1h 30m", cor: "#006064" },
  { id: 7, titulo: "Vendas Consultivas", tipo: "Vídeo", duracao: "50 min", cor: "#311b92" },
];

const TrilhasCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300; // Quantidade de pixels para rolar
      if (direction === 'left') {
        current.scrollLeft -= scrollAmount;
      } else {
        current.scrollLeft += scrollAmount;
      }
    }
  };

  return (
    <div className="carousel-container">
      {/* Botão Esquerda */}
      <button className="carousel-btn left" onClick={() => scroll('left')}>
        ‹
      </button>

      {/* Área de Scroll */}
      <div className="carousel-scroll-area" ref={scrollRef}>
        {mockTrilhas.map((trilha) => (
          <div key={trilha.id} className="track-card">
            {/* Imagem (Placeholder com cor por enquanto) */}
            <div className="track-image-box" style={{background: `linear-gradient(45deg, #111, ${trilha.cor})`}}>
              {/* Se tiver imagem real: <img src={...} alt="..." /> */}
              <span className="track-badge">{trilha.tipo}</span>
            </div>
            
            <div className="track-info">
              <h4>{trilha.titulo}</h4>
              <p>{trilha.duracao}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Botão Direita */}
      <button className="carousel-btn right" onClick={() => scroll('right')}>
        ›
      </button>
    </div>
  );
};

export default TrilhasCarousel;