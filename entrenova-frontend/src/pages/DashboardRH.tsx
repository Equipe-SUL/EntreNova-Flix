// DashboardRH.tsx
import React, { useState, useEffect } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import DashboardFooter from '../components/DashboardFooter';
import CreateFuncionarioForm from '../components/CreateFuncionarioForm'; 
import '../styles/Dashboardrh.css';
import { supabase } from '../services/supabase'; 
import DashboardRHNavbar from '../components/DashboardRHNavbar';
import TrilhasCarousel from '../components/TrilhasCarousel';
import ColaboradoresGrid from '../components/ColaboradoresGrid';

const DashboardRH: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rhName, setRhName] = useState('Recursos Humanos');

  // --- Estados dos MODAIS ---
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // --- Estados de BUSCA ---
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null); 
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
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
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;

    setIsSearching(true);
    setSearchResult(null);

    setTimeout(() => {
      const fakeResult = {
        id: 'user_12345',
        full_name: 'Ana Silva (Funcionária Exemplo)',
        email: searchTerm.includes('@') ? searchTerm : 'ana.silva@empresa.com',
        completionPercentage: 45, 
        maxActivityTime: 120, 
        activity: [
          { day: 'Seg', time: 30 }, { day: 'Ter', time: 0 }, { day: 'Qua', time: 90 },
          { day: 'Qui', time: 45 }, { day: 'Sex', time: 0 },
        ],
        progress: [
          { trilha: 'Onboarding Corporativo', status: 'Concluído', tempo: '2h 10m' },
          { trilha: 'Segurança da Informação', status: 'Em Andamento', tempo: '0h 45m' },
          { trilha: 'Ferramenta de Vendas (CRM)', status: 'Não Iniciado', tempo: '3h 00m' }
        ]
      };
      setSearchResult(fakeResult);
      setIsSearching(false);
      setIsSearchModalOpen(false); 
    }, 1500);
  };

  // --- ESTILOS REUTILIZÁVEIS ---
  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(5px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999
  };

  const modalContentStyle: React.CSSProperties = {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '12px',
    padding: '30px',
    width: '90%',
    maxWidth: '700px', // Largura confortável
    maxHeight: '95vh',
    overflowY: 'auto',
    position: 'relative', // Importante para o botão absoluto funcionar
    boxShadow: '0 0 30px rgba(255, 0, 127, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center' 
  };

  // --- BOTÃO FECHAR (RESET TOTAL DE ESTILOS) ---
  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute', 
    top: '15px',     
    right: '20px',   
    background: 'transparent', // Remove fundo
    border: 'none',            // Remove borda
    outline: 'none',           // Remove contorno azul de foco
    boxShadow: 'none',         // Remove sombras
    color: '#888',
    fontSize: '2rem', 
    cursor: 'pointer', 
    fontWeight: '400', 
    padding: 0,
    margin: 0,
    lineHeight: '1', 
    zIndex: 20,
    appearance: 'none',       // Remove estilo nativo do sistema
    WebkitAppearance: 'none'  // Remove estilo nativo (Safari/Chrome)
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px', marginTop: '8px', marginBottom: '20px',
    backgroundColor: '#222', border: '1px solid #333', borderRadius: '6px',
    color: 'white', outline: 'none'
  };

  const btnSubmitStyle: React.CSSProperties = {
    width: '100%', padding: '12px', backgroundColor: '#ff007f',
    color: 'white', border: 'none', borderRadius: '25px',
    fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem',
    boxShadow: '0 0 10px rgba(255, 0, 127, 0.3)'
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Carregando...</div>;

  return (
    <div className="dashboard-layout">
      <div className="dashboard-main">
        <DashboardHeader />
        
        <DashboardRHNavbar 
            activeView="visao_geral" 
            onOpenNewCollaborator={() => setIsCreateModalOpen(true)} 
            onOpenSearch={() => setIsSearchModalOpen(true)}
        />

      {/* SEÇÃO 1: RH CARD */}
      <section className="area-funcionario" style={{margin: '2em 0'}}>
        <div className="card-funcionario" style={{width: 'auto', maxWidth: '800px', margin: '0 auto'}}>
            <div className="info-funcionario">
                <p className="empresa">Admin RH</p>
                <h2 className="nome">{rhName}</h2> 
                <a className="cargo">Gerenciador de Equipe</a>
            </div>
            <div className="avaliacao">
                <div className="nota">
                    <span style={{lineHeight: '56px'}}>RH</span>
                    <p>Acesso</p>
                </div>
                <div className="linha"></div>
                <div id='divbtnfilho'>
                    <button className="btn-filho"><span>▶</span></button>
                    <p id='pmeuperfil'>Meu Perfil</p>
                </div>
            </div>
        </div>
      </section>

      {/* SEÇÃO DE RESULTADO DA BUSCA */}
      {searchResult && (
        <section className="trilhas" style={{margin: '0 5% 2em 5%'}}>
             <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h2><span>🔍</span> Resultado da Busca: {searchResult.full_name}</h2>
                <button 
                    onClick={() => setSearchResult(null)} 
                    style={{background: 'transparent', border: '1px solid #ff007f', color: '#ff007f', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer'}}
                >
                    Limpar Busca
                </button>
             </div>
             
             <div className="login-card search-result-card" style={{marginTop: '1rem', width: '100%', border: '1px solid #ff007f'}}>
                <div className="chart-container">
                  <div className="chart-block pie-chart-wrapper">
                    <div className="pie-chart" style={{ background: `conic-gradient(#ff007f 0% ${searchResult.completionPercentage}%, #333 ${searchResult.completionPercentage}% 100%)` }}>
                      <div className="pie-chart-inner">{searchResult.completionPercentage}%</div>
                    </div>
                    <h4>Trilhas Concluídas</h4>
                  </div>
                  <div className="chart-block bar-chart-wrapper">
                    <div className="bar-chart-graph">
                      {searchResult.activity.map((day: any, index: number) => (
                        <div className="bar-wrapper" key={index}>
                          <div className="bar" style={{ height: `${(day.time / searchResult.maxActivityTime) * 100}%` }} title={`${day.time} minutos`}></div>
                          <span className="bar-label">{day.day}</span>
                        </div>
                      ))}
                    </div>
                    <h4>Atividade na Semana (min)</h4>
                  </div>
                </div>
                
                <h3 style={{marginTop: '25px', borderBottom: '1px solid #555', paddingBottom: '10px'}}>Andamento Detalhado</h3>
                <ul style={{listStyle: 'none', padding: '10px 0', gap: '10px', display: 'flex', flexDirection: 'column', marginTop: '10px'}}>
                  {searchResult.progress.map((trilha: any, index: number) => (
                    <li key={index} style={{border: '1px solid #333', backgroundColor: '#1a1a1a', padding: '15px', borderRadius: '8px'}}>
                      <strong>{trilha.trilha}</strong>
                      <span style={{ float: 'right', fontWeight: 'bold', color: trilha.status === 'Concluído' ? '#28a745' : (trilha.status === 'Em Andamento' ? '#ffc107' : '#aaa') }}>{trilha.status}</span>
                      <br />
                      <small style={{color: '#ccc'}}>Tempo de uso: {trilha.tempo}</small>
                    </li>
                  ))}
                </ul>
             </div>
        </section>
      )}

      {/* SEÇÃO 2: MINHAS TRILHAS (CARROSSEL) */}
      <section className="trilhas" style={{margin: '0 5%'}}>
         <h2><span>★</span> Minhas Trilhas <span>★</span></h2>
         <p className="descricao">Conteúdos recomendados para sua equipe</p>

         {/* AQUI ENTRA O CARROSSEL */}
         <TrilhasCarousel />
      </section>

      {/* SEÇÃO 3: COLABORADORES */}
      <section className="trilhas" style={{margin: '0 5%', paddingBottom: '3rem'}}>
         <h2><span>★</span> Meus Colaboradores <span>★</span></h2>
         <p className="descricao">Visão geral da equipe cadastrada</p>

         {/* COMPONENTE GRID */}
         <ColaboradoresGrid />

      </section>

      {/* SEÇÃO 4: MÉTRICAS GERAIS */}
      <section className="trilhas" style={{margin: '0 5%', paddingBottom: '3rem'}}>
        <h2><span>★</span> Métricas da Equipe <span>★</span></h2><br></br>
        <div className="grade-trilhas">
          <div className="card">
            <p className="tipo">📊 Relatório Semanal</p>
            <h3>Engajamento</h3>
            <p style={{fontSize: '2.5rem', color: '#ff007f', margin: '15px 0', textAlign: 'center'}}>+12%</p>
            <button className="btn iniciar" style={{width: '100%'}}>Ver Detalhes</button>
          </div>
          <div className="card">
            <p className="tipo">🎯 Treinamento</p>
            <h3>Conclusão</h3>
            <p style={{fontSize: '2.5rem', color: '#fff', margin: '15px 0', textAlign: 'center'}}>84%</p>
            <button className="btn iniciar" style={{width: '100%'}}>Analisar</button>
          </div>
          <div className="card">
            <p className="tipo">📈 Indicador</p>
            <h3>Turnover</h3>
            <p style={{fontSize: '2.5rem', color: '#fff', margin: '15px 0', textAlign: 'center'}}>3.2%</p>
            <button className="btn iniciar" style={{width: '100%'}}>Relatório</button>
          </div>
          <div className="card">
            <p className="tipo">👥 People</p>
            <h3>Contratações</h3>
            <p style={{fontSize: '2.5rem', color: '#fff', margin: '15px 0', textAlign: 'center'}}>+8</p>
            <button className="btn iniciar" style={{width: '100%'}}>Funil</button>
          </div>
        </div>
      </section>

      {/* --- MODAL 1: NOVO CADASTRO --- */}
      {isCreateModalOpen && (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <button 
                    onClick={() => setIsCreateModalOpen(false)} 
                    style={closeButtonStyle}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
                >
                    ×
                </button>
                <h2 style={{textAlign: 'center', color: '#fff', marginBottom: '20px', marginTop: '0'}}>Novo Cadastro</h2>
                <CreateFuncionarioForm />
            </div>
        </div>
      )}

      {/* --- MODAL 2: BUSCA --- */}
      {isSearchModalOpen && (
        <div style={modalOverlayStyle}>
            <div style={{...modalContentStyle, maxWidth: '450px'}}> 
                <button 
                    onClick={() => setIsSearchModalOpen(false)} 
                    style={closeButtonStyle}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
                >
                    ×
                </button>
                <h2 style={{textAlign: 'center', color: '#fff', marginBottom: '5px', marginTop: '0'}}>Buscar Colaborador</h2>
                <p style={{textAlign: 'center', color: '#888', fontSize: '0.9rem', marginBottom: '20px'}}>
                    Visualize o progresso individual
                </p>
                
                <form onSubmit={handleSearchSubmit} style={{width: '100%'}}>
                    <label style={{display: 'block', color: '#ccc', fontSize: '0.9rem'}}>ID ou Email</label>
                    <input 
                        type="text" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        placeholder="ex: ana.silva@empresa.com" 
                        style={inputStyle}
                        autoFocus
                    />
                    <button type="submit" style={btnSubmitStyle} disabled={isSearching}>
                        {isSearching ? 'Buscando...' : 'Buscar agora'}
                    </button>
                </form>
            </div>
        </div>
      )}

      <DashboardFooter />
    </div>
   </div>
  );
};

export default DashboardRH;