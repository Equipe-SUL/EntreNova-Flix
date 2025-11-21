import React from 'react';

const DashboardFooter: React.FC = () => {
  return (
    // Usa a nova classe
    <footer className="footer-stream"> 
      <div className="dash-footercontent">
        <small>© {new Date().getFullYear()} Entrenova • Todos os direitos reservados</small>
        <nav className="dash-footerlinks" aria-label="Links legais">
          <a href="#">Privacidade</a>
          <a href="#">Termos</a>
          <a href="#">Suporte</a>
        </nav>
      </div>
    </footer>
  );
};

export default DashboardFooter;