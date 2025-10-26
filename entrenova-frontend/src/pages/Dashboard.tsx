import React, { useEffect, useState } from 'react'; 
import DashboardHeader from '../components/DashboardHeader';
import DashboardFooter from '../components/DashboardFooter';
import Progresso from '../components/Progresso'; 
import DetalhesModal from '../components/DetalhesModal'; 
import '../styles/dashboard.css';
import '../styles/DetalhesModal.css'; 
import userIcon from '../assets/dashuser_icon.png';
import { supabase } from '../services/supabase';

// ================== simulando trilhas ==================
// thumbs que criei com i.a
import thumbProgresso1 from '../assets/thumbnail1.png';
import thumbProgresso2 from '../assets/thumbnail2.png';
import thumbProgresso3 from '../assets/thumbnail3.png';

// --- Estrutura dos cursos ---
type CursoStatus = 'progresso' | 'concluido' | 'novo';

export interface Curso {
  id: number;
  icon: string;
  level: string;
  title: string;
  time: string;
  status: CursoStatus;
  type: 'video' | 'podcast' | 'atividade'; 
  thumbnailUrl?: string; 
  description?: string; 
  progress: number;
  score?: number; 
}

// --- Criando um "banco de dados" de cursos ---
// Atualizar os dados fictícios
const allCursos: Curso[] = [
  {
    id: 1,
    icon: '🚀',
    level: 'Intermediário',
    title: 'React Avançado',
    time: '6h 40min',
    status: 'progresso',
    type: 'video', 
    thumbnailUrl: thumbProgresso1, // <-- Thumbnail 1 aplicada aqui
    description: 'Trilha de Conhecimento: React. Aula 01 de 10. Aprenda sobre hooks avançados, renderização e performance.', 
    progress: 70,
    score: 8.5,
  },
  {
    id: 2,
    icon: '📌',
    level: 'Iniciante',
    title: 'Comunicação e Web',
    time: '3h 15min',
    status: 'progresso',
    type: 'podcast', 
    thumbnailUrl: thumbProgresso2, // <-- Thumbnail 2 aplicada aqui
    description: 'Trilha de Fundamentos: Atividade 01 de 05. Construa uma landing page responsiva usando HTML semântico e CSS moderno.', 
    progress: 45,
    score: 7.6,
  },
  {
    id: 3,
    icon: '🎨',
    level: 'Iniciante',
    title: 'UI/UX Basics',
    time: '2h 10min',
    status: 'progresso',
    type: 'video', 
    thumbnailUrl: thumbProgresso3, // <-- Thumbnail 3 aplicada aqui
    description: 'Trilha de Design: Aula 01 de 05. Entenda os princípios fundamentais de UI e UX para criar interfaces que os usuários amam.', 
    progress: 20,
    score: 6.8,
  },
  {
    id: 4,
    icon: '✅',
    level: 'Intermediário',
    title: 'TypeScript Essencial',
    time: '4h 20min',
    status: 'concluido',
    type: 'atividade', 
    thumbnailUrl: 'https://img.youtube.com/vi/gp_s-xOB_fQ/maxresdefault.jpg',
    description: 'Trilha de Conhecimento: TypeScript. Atividade Final. Revise os conceitos de tipos, interfaces e genéricos.', 
    progress: 100,
    score: 9.2,
  },
  {
    id: 5, 
    icon: '🎧',
    level: 'Iniciante',
    title: 'Comunicação Eficaz',
    time: '1h 30min',
    status: 'novo',
    type: 'podcast', 
    description: 'Trilha Soft Skills: Módulo 01 de 03. Ouça sobre como a comunicação não-violenta pode transformar seu ambiente de trabalho.', 
    progress: 0,
  },
];



const Dashboard: React.FC = () => {

  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('João Sobrenome');
  const [userRole, setUserRole] = useState('Funcionário');

  const [activeFilter, setActiveFilter] = useState<CursoStatus | 'todas'>('progresso');

  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);

  const filteredCursos = allCursos.filter(curso => {
    if (activeFilter === 'todas') {
      return true; 
    }
    return curso.status === activeFilter; 
  });


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase
          .from('profiles')
          .select('full_name, role') // Seleciona o nome e o papel/cargo
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (data) {
              setUserName(data.full_name);
              // Mapeia o 'role' para um termo de cargo mais amigável, se necessário
              setUserRole(data.role === 'rh' ? 'Gerente RH' : 'Colaborador'); 
            } else if (error) {
              console.error('Erro ao buscar perfil:', error.message);
            }
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  }, []); // Executa apenas uma vez ao montar o componente
  
  const handleDetalhesClick = (curso: Curso) => {
    setSelectedCurso(curso);
  };
  
  const handleCloseModal = () => {
    setSelectedCurso(null);
  };


  return (
    <div className="dashboard-layout">

      <div className="dashboard-main">
        <DashboardHeader />

        {/* Card do Usuário (Hero) */}
        <section className="dash-section">
          <div className="dash-card dash-card--hero">
            <img
              src={userIcon}
              alt="Ícone do Usuário"
              className="dash-card__user-icon"
            />
            <div className="dash-card__header">
              <span className="dash-badge dash-badge--active">Funcionário Ativo</span>
              <h2>{userName}</h2>
              <span className="dash-tag">{userRole}</span>
            </div>
            <div className="dash-card__score">
              <div className="dash-score">
                <div className="dash-score__ring">
                  <span>8/10</span>
                </div>
                <small>Concluido</small>
              </div>
            </div>
          </div>
        </section>

        
        <Progresso />
      


        {/* --- SEÇÃO DE TRILHAS ATUALIZADA --- */}
        <section className="dash-section">
          <header className="dash-section__header">
            <h3>Trilhas de Aprendizado</h3>
            <p>Continue seu desenvolvimento profissional</p>
            <div className="dash-filters">
              
              <button
                className={`dash-chip ${activeFilter === 'todas' ? 'dash-chip--active' : ''}`}
                onClick={() => setActiveFilter('todas')}
              >
                Todas
              </button>
              <button
                className={`dash-chip ${activeFilter === 'progresso' ? 'dash-chip--active' : ''}`}
                onClick={() => setActiveFilter('progresso')}
              >
                Em Progresso
              </button>
              <button
                className={`dash-chip ${activeFilter === 'concluido' ? 'dash-chip--active' : ''}`}
                onClick={() => setActiveFilter('concluido')}
              >
                Concluídas
              </button>
            </div>
          </header>

          <div className="dash-list">
            
            {filteredCursos.length === 0 && (
              <p className="dash-list__empty-message">Nenhuma trilha encontrada para este filtro.</p>
            )}

            {filteredCursos.map(curso => (
              <article className="dash-item" key={curso.id}>

                <div className="dash-item__left">
                  <div className="dash-item__icon" aria-hidden="true">{curso.icon}</div>
                  
                  <div className="dash-item__text-content"> 
                    <small className="dash-item__level">{curso.level}</small>
                    <h4 className="dash-item__title">{curso.title}</h4>
                    
                    <span 
                      className="dash-item__type-badge" 
                      data-type={curso.type}
                    >
                      {curso.type}
                    </span>
                    
                    <small className="dash-item__time">{curso.time}</small>
                  </div>
                </div>

                <div className="dash-item__right">
                  <div className="dash-progress">
                    <div className="dash-progress__track">
                      <div className="dash-progress__bar" style={{ width: `${curso.progress}%` }} />
                    </div>
                    <span className="dash-progress__pct">{curso.progress}%</span>
                  </div>

                  {curso.score && (
                    <div className="dash-score-chip">Nota: {curso.score}</div>
                  )}

                  <div className="dash-actions">
                    {curso.status === 'concluido' && (
                      <button 
                        className="dash-btn dash-btn--primary"
                        onClick={() => handleDetalhesClick(curso)} 
                      >
                        Revisar
                      </button>
                    )}
                    {curso.status === 'progresso' && (
                      <>
                        <button className="dash-btn dash-btn--primary">Continuar</button>
                        <button 
                          className="dash-btn dash-btn--outline" 
                          onClick={() => handleDetalhesClick(curso)}
                        >
                          Detalhes
                        </button>
                      </>
                    )}
                    {curso.status === 'novo' && (
                      <button 
                        className="dash-btn dash-btn--primary"
                        onClick={() => handleDetalhesClick(curso)} 
                      >
                        Iniciar
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

  

        <DashboardFooter />
      </div>

      {selectedCurso && (
        <DetalhesModal 
          curso={selectedCurso} 
          onClose={handleCloseModal} 
        />
      )}

    </div>
  );
};

export default Dashboard;