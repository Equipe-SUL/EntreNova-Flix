// DashboardAdminNavbar.tsx
import React from 'react';
import '../styles/AdminNavbar.css'

interface AdminNavbarProps {
    // A view 'companies_and_tracks' é a nova opção
    onViewChange: (view: 'overview' | 'companies_and_tracks') => void;
    activeView: 'overview' | 'companies_and_tracks'; 
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ onViewChange, activeView }) => {
    return (
        <nav className="navbar-admin">
            <div className="title-navbar">
                <h1>Área da Entrenova</h1>
                <h6>Tenha informações sobre o projeto Entrenova-Flix</h6>
            </div>
            <div className='btns-navbar'>
                <button 
                    onClick={() => onViewChange('overview')} 
                    className={activeView === 'overview' ? 'active-btn' : ''}
                >
                    Visão Geral
                </button>
                <button 
                    onClick={() => onViewChange('companies_and_tracks')}
                    className={activeView === 'companies_and_tracks' ? 'active-btn' : ''}
                >
                    Empresas e Trilhas </button>
            </div>
        </nav>
    )
}

export default AdminNavbar;