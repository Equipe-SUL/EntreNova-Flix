import '../styles/Hero.css';
import videoicon from '../assets/videoicon.png';

const Hero = () => (
  // coloquei o id encapsulado porque isso aqui vai dentro do component landingpage <-- ass.vivian
  <section id="inicio" className="hero">
    <article id='artsec1'>
      <div className="hero-text">
        <h1>ENTRENOVA<br />FLIX</h1>
        <p className='p1'>Desafios em soluções.<br /></p> 
        <p className='p2'>Nossa plataforma de streaming para treinamentos foi desenvolvida para levar conhecimento de forma prática, acessível e interativa.</p>
        <div className="hero-buttons">
          {/* 3. Botões ajustados para scroll com a tag <a> e href="#id" */}
          <a href="#questionario">
            <button className="start-btn">INICIAR</button>
          </a>
          <a href="#quem-somos">
            <button className="btn">SOBRE</button>
          </a>
        </div>
      </div>
      <div className="hero-image">
        <img className="videoicon" src={videoicon} alt="Logo Ícone de video" />
      </div>
    </article>
  </section>
);

export default Hero;