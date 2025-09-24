import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import logo from '../assets/logoentrenova.png';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
  };

  return (
    <header className="header">
      <img 
        className="logo" 
        src={logo} 
        alt="Logo Entrenova" 
        onClick={() => handleScrollOrNavigate('#inicio')}
        style={{ cursor: 'pointer' }}
      /> 
      <div id='divuniao'>
        <nav>
          <ul>
            <li onClick={() => handleScrollOrNavigate('#inicio')} style={{ cursor: 'pointer' }}><strong>Início</strong></li>
            <li onClick={() => handleScrollOrNavigate('#quem-somos')} style={{ cursor: 'pointer' }}>Quem somos</li>
            <li onClick={() => handleScrollOrNavigate('#contato')} style={{ cursor: 'pointer' }}>Contato</li>
            
            {/* AQUI ESTÁ A MUDANÇA: O link do Chatbot agora está ativo */}
            <li><Link to="/chatbot">Chatbot</Link></li>
          </ul>
        </nav>
        
        <Link to="/diagnostico">
          <button className="login-btn">Formulário</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;