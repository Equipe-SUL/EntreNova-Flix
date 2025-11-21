// src/components/DashboardHeader.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
// Importa o Modal E SEU CSS (Assumindo que estão corretos)
import NotificacoesModal from './NotificacoesModal';
import '../styles/NotificacoesModal.css';
// Importa o CSS principal do Dashboard (que vamos refazer abaixo)
import '../styles/dashboard.css';

const DashboardHeader: React.FC = () => {
    const navigate = useNavigate();
    const [isNotificacoesOpen, setIsNotificacoesOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/signin');
    };
    
    // NOVO HANDLER: Rola a página para o topo
    const handleScrollToTop = (e: React.MouseEvent) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleOpenNotificacoes = () => setIsNotificacoesOpen(true);
    const handleCloseNotificacoes = () => setIsNotificacoesOpen(false);

    return (
        <>
            <header className="dash-header"> {/* Mudança de classe para evitar conflitos */}
                {/* Logo */}
                <div className="dash-header__logo">
                    {/* APLICANDO O NOVO HANDLER PARA O LINK DO LOGO */}
                    <Link to="/dashboard/funcionario" onClick={handleScrollToTop}>DASH<span>BOARD</span></Link>
                </div>

                {/* Centro: Navegação + Pesquisa */}
                <div className="dash-header__center">
                    <nav className="dash-header__nav">
                        <ul>
                            <li>
                                {/* APLICANDO O NOVO HANDLER PARA O LINK 'INÍCIO' */}
                                <Link to="/dashboard/funcionario" onClick={handleScrollToTop}>Início</Link>
                            </li>
                            <li>
                                {/* Botão para abrir o modal */}
                                <button onClick={handleOpenNotificacoes} className="dash-header__nav-button">
                                    Notificações
                                    <span className="dash-header__badge">3</span>
                                </button>
                            </li>
                        </ul>
                    </nav>

                    <div className="dash-header__search">
                        <input type="text" placeholder="Pesquisar trilhas..." />
                        <svg className="dash-header__search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </div>
                </div>

                {/* Botão Sair */}
                <button onClick={handleLogout} className="dash-header__logout-btn">
                    Sair
                </button>
            </header>

            {/* Modal de Notificações */}
            {isNotificacoesOpen && (
                <NotificacoesModal onClose={handleCloseNotificacoes} />
            )}
        </>
    );
};

export default DashboardHeader;