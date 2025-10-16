import React from 'react';

const DashboardFooter: React.FC = () => {
  return (
    <footer className="dash-footer">
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
