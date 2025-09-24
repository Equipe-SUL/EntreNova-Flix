import React from 'react';
import { Link } from 'react-router-dom'; // 1. Importe o Link
import '../styles/Hero.css';
import videoicon from '../assets/videoicon.png';

const Hero: React.FC = () => (
  <section className="hero">
    <article id='artsec1'>
      <div className="hero-text">
        <h1>ENTRENOVA<br />FLIX</h1>
        <p className='p1'>Desafios em soluções.<br /></p> 
        <p className='p2'>Nossa plataforma de streaming para treinamentos foi desenvolvida para levar conhecimento de forma prática, acessível e interativa.</p>
        <div className="hero-buttons">
          {/* 2. Envolva os botões com o componente Link */}
          <Link to="/diagnostico">
            <button className="start-btn">INICIAR</button>
          </Link>
          <Link to="/quem-somos">
            <button className="btn">SOBRE</button>
          </Link>
        </div>
      </div>
      <div className="hero-image">
        <img className="videoicon" src={videoicon} alt="Logo Ícone de video" />
      </div>
    </article>
  </section>
);

export default Hero;