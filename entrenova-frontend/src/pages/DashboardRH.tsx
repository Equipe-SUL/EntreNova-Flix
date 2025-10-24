import React, { useState, useEffect } from 'react';
import DashboardHeader from '../components/DashboardHeader';

import DashboardFooter from '../components/DashboardFooter';
import CreateFuncionarioForm from '../components/CreateFuncionarioForm'; 
import '../styles/Dashboardrh.css';
import { supabase } from '../services/supabase'; 

const DashboardRH: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rhName, setRhName] = useState('Recursos Humanos');

  // --- Estados para simular a busca ---
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
  
  // Função para simular a busca (front-end only)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;

    setIsSearching(true);
    setSearchResult(null);

    // Simula uma chamada de API (1.5 segundos)
    setTimeout(() => {
      const fakeResult = {
        id: 'user_12345',
        full_name: 'Ana Silva (Funcionária Exemplo)',
        email: searchTerm.includes('@') ? searchTerm : 'ana.silva@empresa.com',
        completionPercentage: 45, 
        maxActivityTime: 120, 
        activity: [
          { day: 'Seg', time: 30 },
          { day: 'Ter', time: 0 },
          { day: 'Qua', time: 90 },
          { day: 'Qui', time: 45 },
          { day: 'Sex', time: 0 },
        ],
        progress: [
          { trilha: 'Onboarding Corporativo', status: 'Concluído', tempo: '2h 10m' },
          { trilha: 'Segurança da Informação', status: 'Em Andamento', tempo: '0h 45m' },
          { trilha: 'Ferramenta de Vendas (CRM)', status: 'Não Iniciado', tempo: '3h 00m' }
        ]
      };
      
      setSearchResult(fakeResult);
      setIsSearching(false);
    }, 1500);
  };
  
  if (loading) {
    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            Carregando Dashboard RH...
        </div>
    );
  }

  return (
    <div className="dashboard-layout">
     

      <div className="dashboard-main">
        <DashboardHeader />


      {/* ----------------------------------------------------------- */}
      {/* SEÇÃO 1: RH CARD */}
      {/* ----------------------------------------------------------- */}
      <section className="area-funcionario" style={{margin: '2em 0'}}>
        <div className="card-funcionario" style={{width: 'auto', maxWidth: '800px'}}>
          <div className="info-funcionario">
            <p className="empresa">Admin RH</p>
            <h2 className="nome">{rhName}</h2> 
            <button className="cargo">Gerenciador de Equipe</button>
          </div>
          <div className="avaliacao">
            <div className="nota">
              <span style={{lineHeight: '56px'}}>RH</span>
              <p>Acesso</p>
            </div>
            <div className="linha"></div>
            <button className="btn-filho">
              <span>▶</span>
              <p>Meu Perfil</p>
            </button>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- */}
      {/* SEÇÃO 2: MÉTRICAS (Usa .grade-trilhas) */}
      {/* ----------------------------------------------------------- */}
      <section className="trilhas" style={{margin: '0 5%'}}>
        <h2><span>★</span> Métricas da Equipe <span>★</span></h2>
        <p className="descricao">Relatórios e indicadores de desempenho</p>
        
        <div className="grade-trilhas">
          {/* Card Fictício 1: Engajamento */}
          <div className="card">
            <p className="tipo">📊 Relatório Semanal</p>
            <h3>Engajamento da Equipe</h3>
            <p style={{fontSize: '2.5rem', color: '#ff007f', margin: '15px 0', textAlign: 'center'}}>+12%</p>
            <p style={{fontSize: '0.9rem', color: '#ccc', margin: '10px 0'}}>
              Em relação ao mês anterior.
            </p>
            <button className="btn iniciar" style={{width: '100%'}}>Ver Detalhes</button>
          </div>
          {/* Card Fictício 2: Conclusão */}
          <div className="card">
            <p className="tipo">🎯 Métricas de Treinamento</p>
            <h3>Taxa de Conclusão</h3>
            <p style={{fontSize: '2.5rem', color: '#fff', margin: '15px 0', textAlign: 'center'}}>84%</p>
            <p style={{fontSize: '0.9rem', color: '#ccc', margin: '10px 0'}}>
              Meta de 80% atingida.
            </p>
            <button className="btn iniciar" style={{width: '100%'}}>Analisar Trilhas</button>
          </div>
          {/* Card Fictício 3: Turnover */}
          <div className="card">
            <p className="tipo">📈 Indicador Chave</p>
            <h3>Turnover Voluntário</h3>
            <p style={{fontSize: '2.5rem', color: '#fff', margin: '15px 0', textAlign: 'center'}}>3.2%</p>
            <p style={{fontSize: '0.9rem', color: '#ccc', margin: '10px 0'}}>
              Redução de 0.5% no trimestre.
            </p>
            <button className="btn iniciar" style={{width: '100%'}}>Gerar Relatório</button>
          </div>

          {/* Card Fictício 4: Novas Contratações */}
          <div className="card">
            <p className="tipo">👥 People</p>
            <h3>Novas Contratações (Mês)</h3>
            <p style={{fontSize: '2.5rem', color: '#fff', margin: '15px 0', textAlign: 'center'}}>+8</p>
            <p style={{fontSize: '0.9rem', color: '#ccc', margin: '10px 0'}}>
              Meta de 5 contratações atingida.
            </p>
            <button className="btn iniciar" style={{width: '100%'}}>Ver Funil de Contratação</button>
          </div>

        </div>
      </section>

      {/* ----------------------------------------------------------- */}
      {/* SEÇÃO 3: ADMINISTRAÇÃO */}
      {/* ----------------------------------------------------------- */}
      <section className="trilhas" style={{margin: '0 5%'}}>
        <h2><span>★</span> Administração <span>★</span></h2>
        <p className="descricao">Busque por um colaborador para ver seu progresso</p>
        
        <div className="form-grid-container">
          
          <div className="search-and-results-wrapper">
            
            {/* Card 1: Formulário de Busca */}
            <div className="login-card search-form-card">
              <h2>Buscar Colaborador</h2>
              <p>Insira o ID ou email para ver o progresso.</p>
              
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '1.5em' }}>
                <label htmlFor="search">Email ou ID do Funcionário</label>
                <input 
                  type="text" 
                  id="search"
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  placeholder="ex: user_12345 ou nome@empresa.com" 
                  required 
                />
                <button type="submit" className="btn-submit" disabled={isSearching}>
                  {isSearching ? 'Buscando...' : 'Buscar Funcionário'}
                </button>
              </form>
            </div>

            {/* Card 2: Resultado da Busca */}
            {isSearching && (
              <div className="card search-result-card-placeholder">
                <p style={{textAlign: 'center', fontSize: '1.2rem'}}>Buscando dados...</p>
              </div>
            )}
            
            {searchResult && (
              <div className="login-card search-result-card">
                <h2>{searchResult.full_name}</h2>
                <p>ID: {searchResult.id} | Email: {searchResult.email}</p>
                
                <div className="chart-container">
                  <div className="chart-block pie-chart-wrapper">
                    <div 
                      className="pie-chart" 
                      style={{ 
                        background: `conic-gradient(#ff007f 0% ${searchResult.completionPercentage}%, #333 ${searchResult.completionPercentage}% 100%)` 
                      }}
                    >
                      <div className="pie-chart-inner">
                        {searchResult.completionPercentage}%
                      </div>
                    </div>
                    <h4>Trilhas Concluídas</h4>
                  </div>
                  
                  <div className="chart-block bar-chart-wrapper">
                    <div className="bar-chart-graph">
                      {searchResult.activity.map((day: any, index: number) => (
                        <div className="bar-wrapper" key={index}>
                          <div 
                            className="bar" 
                            style={{ 
                              height: `${(day.time / searchResult.maxActivityTime) * 100}%` 
                            }}
                            title={`${day.time} minutos`}
                          ></div>
                          <span className="bar-label">{day.day}</span>
                        </div>
                      ))}
                    </div>
                    <h4>Atividade na Semana (min)</h4>
                  </div>
                </div>
                
                <h3 style={{marginTop: '25px', borderBottom: '1px solid #555', paddingBottom: '10px'}}>
                  Andamento Detalhado
                </h3>
                <ul style={{listStyle: 'none', padding: '10px 0', gap: '10px', display: 'flex', flexDirection: 'column', marginTop: '10px'}}>
                  {searchResult.progress.map((trilha: any, index: number) => (
                    <li key={index} style={{border: '1px solid #333', backgroundColor: '#1a1a1a', padding: '15px', borderRadius: '8px'}}>
                      <strong>{trilha.trilha}</strong>
                      <span style={{
                          float: 'right', 
                          fontWeight: 'bold', 
                          color: trilha.status === 'Concluído' ? '#28a745' : (trilha.status === 'Em Andamento' ? '#ffc107' : '#aaa')
                        }}>
                        {trilha.status}
                      </span>
                      <br />
                      <small style={{color: '#ccc'}}>Tempo de uso: {trilha.tempo}</small>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div> {/* FIM DO search-and-results-wrapper */}

        </div> {/* FIM DO form-grid-container */}
      </section>
      
      {/* ----------------------------------------------------------- */}
      {/* SEÇÃO 4: CADASTRO */}
      {/* ----------------------------------------------------------- */}
      <section className="trilhas" style={{margin: '0 5%'}}>
        <h2><span>★</span> Cadastrar Novo Colaborador <span>★</span></h2>
        <p className="descricao">Adicione um novo funcionário ao sistema</p>

        <div className="form-grid-container">
          <CreateFuncionarioForm />
        </div>
      </section>

      <DashboardFooter />
    </div>
   </div>
  );
};

export default DashboardRH;