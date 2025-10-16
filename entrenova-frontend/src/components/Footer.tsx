import React from "react";
import "../styles/Footer.css";
import logo from "../assets/logo_branco_entrenova.png";
import instagram from "../assets/instagram.png";
import linkedin from "../assets/linkedin.png";

const Footer: React.FC = () => {
  return (
    <footer className="footer" id="footer">
      <div className="footer-container">
        {/* Coluna 1 - Empresa */}
        <div className="footer-col">
          <img
            className="footer-logo"
            src={logo}
            alt="Logo Entrenova"
            style={{ cursor: "pointer" }}
          />
          <p>
            Transformando o futuro através de soluções digitais inovadoras
            e tecnologia de ponta para impulsionar seu negócio.
          </p>
          <div className="social-links">
            <a href="https://br.linkedin.com/company/entrenovaconteudos"><img
            className="redes"
            src={linkedin}
            alt="Link Linkedin"
            style={{ cursor: "pointer" }}
          /></a>
            <a href="https://www.instagram.com/entre.nova/"><img
            className="redes"
            src={instagram}
            alt="Link Instagram"
            style={{ cursor: "pointer" }}
          /></a>
          </div>
        </div>

        {/* Coluna 2 - Navegação */}
        <div className="footer-col">
          <h3>Navegação</h3>
          <ul>
            <li><a href="/">Início</a></li>
            <li><a href="#about-section">Sobre</a></li>
            <li><a href="/diagnostico">Formulário</a></li>
          </ul>
        </div>

        {/* Coluna 3 - Legal */}
        <div className="footer-col">
          <h3>Legal</h3>
          <ul>
            <li><a href="#">Política de Privacidade</a></li>
            <li><a href="#">Termos de Uso</a></li>
          </ul>
        </div>
      </div>

      {/* Linha inferior */}
      <div className="footer-bottom">
        <p>© 2025 Empresa Digital. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;