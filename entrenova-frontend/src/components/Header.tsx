import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import logo from '../assets/logoentrenova.png';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScrollOrNavigate = (path: string) => {
    const sectionId = path.substring(1);
    if (location.pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    setMenuOpen(false); // Fecha o menu no mobile após a navegação
  };

  return (
    // Aplicação da classe "header" no elemento <header> (Já estava correto)
    <header className="header"> 
      <img 
        className="logo" 
        src={logo} 
        alt="Logo Entrenova" 
        onClick={() => handleScrollOrNavigate('#inicio')}
        style={{ cursor: 'pointer' }}
      /> 

      <div id='divuniao'>
        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <nav>
          {/* A classe 'show' é crucial para exibir o menu no mobile */}
          <ul className={menuOpen ? 'show' : ''}> 
            {/* Removido o <strong> de "Início" para manter o padrão */}
            <li onClick={() => handleScrollOrNavigate('#inicio')}>Início</li> 
            <li onClick={() => handleScrollOrNavigate('#about-section')}>Quem somos</li>
            <li onClick={() => handleScrollOrNavigate('#footer')}>Contato</li>
            <li><Link to="/chatbot">Chatbot</Link></li>
          </ul>
        </nav>

        {/* O botão "Formulário" deve permanecer aqui para que o CSS do mobile o posicione corretamente ao lado do hambúrguer */}
        <Link to="/diagnostico">
          <button className="login-btn">Formulário</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;