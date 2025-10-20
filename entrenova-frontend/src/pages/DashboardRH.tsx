// fileName: DashboardRH.tsx

import React, { useState, useEffect } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardFooter from '../components/DashboardFooter';
import CreateFuncionarioForm from '../components/CreateFuncionarioForm'; // Componente de formulário
import '../styles/dashboard.css';
import { supabase } from '../services/supabase'; // Para buscar a sessão e o perfil

// Assume que a URL base da sua API está em uma variável de ambiente
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Não é mais necessária aqui

const DashboardRH: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rhName, setRhName] = useState('Recursos Humanos');
  
  // Os estados de registro de funcionário foram removidos, pois pertencem ao componente CreateFuncionarioForm.

  useEffect(() => {
    // 1. Busca a sessão e o nome do RH logado
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        // Busca o perfil do RH para obter o nome
        supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (data && data.full_name) {
              setRhName(data.full_name);
            }
          });
      }
      setLoading(false);
    });
  }, []);
  
  if (loading) {
    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            Carregando Dashboard RH...
        </div>
    );
  }

  // Renderiza o Dashboard
  return (
    <div className="dashboard-layout">
      <DashboardSidebar /> 

      <div className="dashboard-main">
        <DashboardHeader />

        {/* ----------------------------------------------------------- */}
        {/* SEÇÃO 1: CARTÃO HERO DO RH */}
        {/* ----------------------------------------------------------- */}
        <section className="dash-section">
          <div className="dash-card dash-card--hero">
            <div className="dash-card__header">
              <span className="dash-badge dash-badge--admin">Admin RH</span>
              <h2>{rhName}</h2> {/* Nome dinâmico do RH */}
              <span className="dash-tag">Gerenciador de Equipe</span>
            </div>

            <div className="dash-card__score">
              <div className="dash-score">
                <div className="dash-score__ring" style={{ backgroundColor: '#28a745' }}>
                  <span>RH</span> 
                </div>
                <small>Acesso</small>
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------- */}
        {/* SEÇÃO 2: CADASTRO DE FUNCIONÁRIOS (Admin RH) */}
        {/* ----------------------------------------------------------- */}
        <section className="dash-section">
            <header className="dash-section__header">
                <h3>Cadastrar Novo Colaborador</h3>
                <p>Adicione um funcionário à sua conta e atribua uma senha inicial.</p>
            </header>

            <div className="dash-card dash-card--form">
                {/* RENDERIZA O COMPONENTE DEDICADO */}
                <CreateFuncionarioForm />
            </div>
        </section>
        
        {/* ----------------------------------------------------------- */}
        {/* SEÇÃO 3: OUTRAS AÇÕES ADMINISTRATIVAS */}
        {/* ----------------------------------------------------------- */}
        <section className="dash-section">
          <header className="dash-section__header">
            <h3>Relatórios e Outras Ações</h3>
          </header>

          <div className="dash-list" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            
            <article className="dash-item" style={{ flex: '1 1 300px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <h4 className="dash-item__title">Relatórios e Métricas</h4>
              <p>Acesse a visão de resultados de todos os colaboradores.</p>
              <button className="dash-btn dash-btn--secondary">Ver Relatórios</button>
            </article>

            <article className="dash-item" style={{ flex: '1 1 300px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <h4 className="dash-item__title\">Gerenciar Plano</h4>
              <p>Detalhes do Plano e Faturamento.</p>
              <button className="dash-btn dash-btn--secondary">Configurações</button>
            </article>
          </div>
        </section>
        
        <DashboardFooter />
      </div>
    </div>
  );
};

export default DashboardRH;