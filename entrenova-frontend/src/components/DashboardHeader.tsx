import React from 'react';
import logo from '../assets/logo_branco_entrenova.png';

const DashboardHeader: React.FC = () => {
  return (
    <header className="dash-header">
      <div className="dash-headerleft">
        <div className="dash-logo">
          <img src={logo} alt="Entrenova" />
          <span className="dash-logotext">Dashboard</span>
        </div>
      </div>

      <div className="dash-headercenter">
        <input
          className="dash-search"
          type="text"
          placeholder="Buscar trilhas..."
          aria-label="Buscar"
        />
      </div>

      <div className="dash-headerright">
        <button className="dash-pill dash-pill--premium" aria-label="Premium">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3l2.39 4.84L20 8.27l-4 3.9.94 5.48L12 15.77l-4.94 1.88.94-5.48-4-3.9 5.61-.43L12 3z" fill="currentColor" />
          </svg>
          <span>Premium</span>
        </button>
        <button className="dash-icon-btn" aria-label="Notificações">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22a2 2 0 002-2H10a2 2 0 002 2zm6-6V11a6 6 0 10-12 0v5l-2 2v1h16v-1l-2-2z" fill="currentColor" />
          </svg>
        </button>
        <div className="dash-avatar" aria-label="Perfil do usuário">JD</div>
      </div>
    </header>
  );
};

export default DashboardHeader;
