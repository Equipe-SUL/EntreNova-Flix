import React from 'react';
import '../styles/Header.css';
import logo from '../assets/logoentrenova.png';

const Header = () => (
  <header className="header">
     <img className="logo" src={logo} alt="Logo Entrenova" /> 
    <div id='divuniao'>
    <nav>
      <ul>
        <a href="#"><strong><li>Início</li></strong></a>
        <a href="#"><li>Quem somos</li></a>
        <a href="#"><li>Contato</li></a>
      </ul>
    </nav>
    <a href="#"><button className="login-btn">Formulário</button></a>
    </div>
  </header>
);

export default Header;
