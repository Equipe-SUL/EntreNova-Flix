import React from "react";
import logo from "../assets/logoentrenova.png";
import "../styles/About.css";

const About: React.FC = () => {
  return (
    <section className="about-section" id="about-section">
      <div className="about-container">
        {/* Topo com logo + linha */}
        <div className="about-header">
          <img src={logo} alt="Logo Entrenova" className="about-logo" />
          <div className="about-line"></div>
        </div>

        {/* Título */}
        <h2 className="about-title">Sobre nós</h2>

        {/* Cards */}
        <div className="about-cards">
          <div className="about-card">
            <div className="about-icon">💡</div>
            <h3>Inovação</h3>
            <p>
              Conteúdo em streaming que apresenta soluções criativas e eficientes
              para os principais desafios do ambiente de trabalho.
            </p>
          </div>

          <div className="about-card">
            <div className="about-icon">⭐</div>
            <h3>Qualidade</h3>
            <p>
              Acesso a materiais de alta performance, produzidos com especialistas
              para impulsionar resultados corporativos.
            </p>
          </div>

          <div className="about-card">
            <div className="about-icon">🤝</div>
            <h3>Suporte</h3>
            <p>
              Treinamentos e soluções disponíveis 24/7 para ajudar equipes a
              superar problemas no dia a dia da empresa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
