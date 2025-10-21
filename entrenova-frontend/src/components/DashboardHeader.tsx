// src/components/DashboardHeader.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase'; // Ajuste o caminho se necessário
import '../styles/dashboard.css'; // Ou o CSS que estiliza o .navbar

const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();

  // Função para fazer o logout do usuário
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/signin'); // Redireciona de volta para a página de login
  };

  return (
    // Baseado no <header class="navbar"> do seu dashboardusuario.html
    <header className="navbar">
      <div className="logo">ENTREN<span>NOVA</span></div>
      <nav>
        <ul>
          {/* Links para DENTRO do dashboard */}
          <li><Link to="/dashboard">Início</Link></li> 
          <li><Link to="/dashboard/perfil">Meu Perfil</Link></li>
          <li><Link to="/suporte">Suporte</Link></li> 
          {/* Removido: Chatbot, Formulário, etc. */}
        </ul>
      </nav>
      
      {/* Botão de Sair (Logout) */}
      <button onClick={handleLogout} className="btn-entrar"> 
        Sair
      </button>
    </header>
  );
};

export default DashboardHeader;