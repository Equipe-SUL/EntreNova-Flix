import React from "react";
import { Link } from "react-router-dom";
import "../styles/CallToAction.css";
import form from "../assets/contact-form.png";

const CallToAction: React.FC = () => {
  return (
    <section className="cta-section">
      <div className="cta-container">
        <img
            className="form"
            src={form}
            alt="Formulario"
            style={{ cursor: "pointer" }}
          />
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
