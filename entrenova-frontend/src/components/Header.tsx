// src/components/Header.tsx

import React, { useState } from 'react';

import { Link, useLocation, useNavigate } from 'react-router-dom';

import '../styles/Header.css';



import logo from '../assets/logo_branco_entrenova.png'; 



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

    <header className="header">

      <div className="logo-wrap">

        

        {/* 2. SUBSTITUÍDO o 'div.text-logo' pela tag <img> */}

        <img

          src={logo}

          alt="Logo Entrenova"

          className="logo" // Você pode precisar ajustar essa classe no seu CSS

          onClick={() => handleScrollOrNavigate('#inicio')}

          style={{ cursor: 'pointer' }}

        />



      </div>



      <div id='divuniao'>

        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>

          <span></span>

          <span></span>

          <span></span>

        </div>



        <nav>

          <ul className={menuOpen ? 'show' : ''}>

            <li onClick={() => handleScrollOrNavigate('#inicio')}>Início</li>

            <li onClick={() => handleScrollOrNavigate('#about-section')}>Quem somos</li>

            <li onClick={() => handleScrollOrNavigate('#footer')}>Contato</li>

            <li><Link to="/chatbot">Chatbot</Link></li>

            <li>

              <Link to="/diagnostico" className="login-btn">Formulário</Link>

            </li>

            

            <li>

              <Link to="/login" className="btn-entrar">Login</Link>

            </li>

            

          </ul>

        </nav>

      </div>

    </header>

  );

};



export default Header;