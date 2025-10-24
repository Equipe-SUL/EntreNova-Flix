import '../styles/Hero.css';
import logo from '../assets/imagemINICIO3.png';

const Hero = () => (
  // coloquei o id encapsulado porque isso aqui vai dentro do component landingpage <-- ass.vivian
  <section id="inicio" className="hero">
    <article id="artsec1">
      <div className="hero-text">
        <h1>ENTRENOVA<br />FLIX</h1>
        <p className="p1">Desafios em soluções.<br /></p>
        <p className="p2">
          Nossa plataforma de streaming para treinamentos foi desenvolvida para levar conhecimento de forma prática, acessível e interativa.
        </p>
        <div className="hero-buttons">
          <a href="/diagnostico">
            <button className="btn-x9zq1">INICIAR</button>
          </a>
          <a href="#about-section">
            <button className="btn-y7kq4">SOBRE</button>
          </a>
        </div>
      </div>
      <div className="hero-image">
        <img className="videoicon" src = {logo} alt="imagem da landing page" loading="lazy" />
      </div>
    </article>
  </section>
);

export default Hero;