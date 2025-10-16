import React from 'react';

const IconBook: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="4" y="3" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M8 7h6M8 11h6M8 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconEye: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const IconTrophy: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M8 4h8v3a4 4 0 01-4 4 4 4 0 01-4-4V4z" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M6 7H4a3 3 0 003 3" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M18 7h2a3 3 0 01-3 3" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M10 14h4v2h-4z" fill="currentColor" />
    <path d="M9 18h6v2H9z" fill="currentColor" />
  </svg>
);

const IconSettings: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    <path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1l2.1-2.1M17 7l2.1-2.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const DashboardSidebar: React.FC = () => {
  return (
    <aside className="dash-sidebar" aria-label="Navegação do Dashboard">
      <nav className="dash-nav">
        <a href="#" className="dash-nav__item dash-nav__item--active" aria-label="Trilhas" aria-current="page" title="Trilhas">
          <span className="dash-nav__icon"><IconBook /></span>
          <span className="dash-nav__text">Trilhas</span>
        </a>
        <a href="#" className="dash-nav__item" aria-label="Visão" title="Visão">
          <span className="dash-nav__icon"><IconEye /></span>
          <span className="dash-nav__text">Visão</span>
        </a>
        <a href="#" className="dash-nav__item" aria-label="Metas" title="Metas">
          <span className="dash-nav__icon"><IconTrophy /></span>
          <span className="dash-nav__text">Metas</span>
        </a>
        <a href="#" className="dash-nav__item" aria-label="Configurações" title="Configurações">
          <span className="dash-nav__icon"><IconSettings /></span>
          <span className="dash-nav__text">Configurações</span>
        </a>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;