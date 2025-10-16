import React from "react";
import { Link } from "react-router-dom";
import "../styles/CallToAction.css";


const CallToAction: React.FC = () => {
  return (
    <section className="cta-section">
      <div className="cta-container">
    
        <svg
          className="cta-icon"
          width="96"
          height="96"
          viewBox="0 0 96 96"
          role="img"
          aria-label="Diagnóstico empresarial"
        >
          <rect
            x="24"
            y="22"
            width="48"
            height="60"
            rx="8"
            ry="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <rect
            x="36"
            y="14"
            width="24"
            height="12"
            rx="6"
            ry="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M36 56 L44 64 L60 44"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
  
          <circle cx="70" cy="20" r="2.8" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M70 15 L70 12 M70 28 L70 31 M65 20 L62 20 M78 20 L81 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <h2>Quer descobrir soluções para sua empresa?</h2>
        <p id="pcta">
          Responda nosso diagnóstico rápido e receba recomendações
          personalizadas para melhorar seus processos e resultados.
        </p>
        <Link to="/diagnostico">
          <button className="cta-button">Responder Formulário</button>
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
