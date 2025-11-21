import { useEffect, useState, useRef } from 'react'; // Corrigido: Importando apenas Hooks
import DashboardHeader from '../components/DashboardHeader';
import DashboardFooter from '../components/DashboardFooter';
// import Progresso from '../components/Progresso'; // REMOVIDO: Gráficos
import DetalhesModal from '../components/DetalhesModal'; 
import Pendencias from '../components/Pendencias'; 
import '../styles/dashboard.css';
import '../styles/DetalhesModal.css'; 
import userIcon from '../assets/dashuser_icon.png';
import { supabase } from '../services/supabase';

// ================== trilhas ==================

// Caminhos de imagem originais e estáveis do repositório
import thumbProgresso1 from '../assets/1.jpg';
import thumbProgresso2 from '../assets/2.jpg';
import thumbProgresso3 from '../assets/3.jpg';

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

// lista de cards das trilhas
const allCursos: Curso[] = [
  {
    id: 1,
    icon: '🚀',
    level: 'Intermediário',
    title: 'React Avançado',
    time: '6h 40min',
    status: 'progresso',
    type: 'video', 
    thumbnailUrl: thumbProgresso1, 
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
    thumbnailUrl: thumbProgresso2, 
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
    thumbnailUrl: thumbProgresso3, 
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
    thumbnailUrl: thumbProgresso1,
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
    thumbnailUrl: thumbProgresso2,
    description: 'Trilha Soft Skills: Módulo 01 de 03. Ouça sobre como a comunicação não-violenta pode transformar seu ambiente de trabalho.', 
    progress: 0,
  },
  {
    id: 6, 
    icon: '💼',
    level: 'Avançado',
    title: 'Liderança 4.0',
    time: '5h 00min',
    status: 'novo',
    type: 'video', 
    thumbnailUrl: thumbProgresso3,
    description: 'Trilha de Liderança: Descubra os novos modelos de gestão para a era digital.', 
    progress: 0,
  },
  {
    id: 7, 
    icon: '⚙️',
    level: 'Básico',
    title: 'Processos Ágeis',
    time: '2h 45min',
    status: 'concluido',
    type: 'atividade', 
    thumbnailUrl: thumbProgresso1,
    description: 'Introdução ao Scrum e Kanban.', 
    progress: 100,
    score: 8.9,
  },
  // NOVOS ITENS
  {
    id: 8, 
    icon: '💡',
    level: 'Intermediário',
    title: 'Pensamento Criativo',
    time: '1h 50min',
    status: 'novo',
    type: 'podcast', 
    thumbnailUrl: thumbProgresso2,
    description: 'Técnicas de brainstorming e inovação no ambiente de trabalho.', 
    progress: 0,
  },
  {
    id: 9, 
    icon: '🤝',
    level: 'Básico',
    title: 'Habilidades de Vendas',
    time: '4h 10min',
    status: 'progresso',
    type: 'video', 
    thumbnailUrl: thumbProgresso3,
    description: 'Módulo 1: Introdução ao Funil de Vendas.', 
    progress: 15,
    score: 0,
  },
  {
    id: 10, 
    icon: '⏱️',
    level: 'Avançado',
    title: 'Gestão de Tempo',
    time: '3h 00min',
    status: 'progresso',
    type: 'atividade', 
    thumbnailUrl: thumbProgresso1,
    description: 'Dominando a Matriz de Eisenhower.', 
    progress: 85,
    score: 7.9,
  },
];

// =======================================================
// NOVO COMPONENTE: TrilhaConclusaoCard.tsx (Integrado aqui para simplicidade)
// =======================================================
interface TrilhaConclusaoCardProps {
    cursos: Curso[];
    onConcluirSelecionadas: (ids: number[]) => void; // NOVO: Recebe IDs para conclusão
}

const TrilhaConclusaoCard: React.FC<TrilhaConclusaoCardProps> = ({ cursos, onConcluirSelecionadas }) => {
    const [selectedTrilhas, setSelectedTrilhas] = useState<number[]>([]); // NOVO: Estado para checkboxes

    // Handler para marcar/desmarcar trilhas
    const handleCheckboxChange = (id: number, isChecked: boolean) => {
        setSelectedTrilhas(prevSelected => 
            isChecked
                ? [...prevSelected, id]
                : prevSelected.filter(trilhaId => trilhaId !== id)
        );
    };

    // Handler para o botão de conclusão
    const handleFinalizar = () => {
        if (selectedTrilhas.length === 0) {
            alert("Selecione pelo menos uma trilha para concluir.");
            return;
        }

        const confirmacao = window.confirm(
            `Você tem certeza que deseja marcar ${selectedTrilhas.length} trilha(s) como concluída(s)?`
        );

        if (confirmacao) {
            onConcluirSelecionadas(selectedTrilhas); // Envia os IDs selecionados
            setSelectedTrilhas([]); // Limpa as seleções após a conclusão
        }
    };

    const trilhasAbertas = cursos.filter(c => c.status !== 'concluido');
    
    return (
        <section className="dash-section">
            <h3 className="dash-section__title">Conclusão Rápida</h3>
            <div className="pendencias-container" style={{ gridTemplateColumns: '1fr', maxWidth: '500px', margin: '0 auto' }}>
                <div className="pendencias-card" style={{ borderLeft: '5px solid #00BFFF' }}>
                    <h4>Trilhas Pendentes ({trilhasAbertas.length})</h4>
                    <p className="pendencias-subtext">Selecione para marcar como concluída. O Hero Card será atualizado.</p>
                    
                    <ul className="pendencias-list" style={{ marginBottom: '15px' }}>
                        {trilhasAbertas.length === 0 ? (
                            <li className="list-empty">🎉 Todas as trilhas marcadas como concluídas!</li>
                        ) : (
                            trilhasAbertas.map(curso => (
                                <li key={curso.id} className="pendencias-list-item">
                                    <input 
                                        type="checkbox" 
                                        id={`curso-${curso.id}`}
                                        checked={selectedTrilhas.includes(curso.id)} // Controlado pelo estado
                                        onChange={(e) => handleCheckboxChange(curso.id, e.target.checked)} // Novo handler de seleção
                                        style={{ accentColor: '#00BFFF' }}
                                    />
                                    <label htmlFor={`curso-${curso.id}`} className="item-title" style={{ fontWeight: 400, color: '#eee' }}>
                                        {curso.title} ({curso.level})
                                    </label>
                                </li>
                            ))
                        )}
                    </ul>
                    <button 
                        className="dash-btn dash-btn--primary"
                        onClick={handleFinalizar} // Novo handler para o botão
                        disabled={selectedTrilhas.length === 0} // Desabilita se nada estiver marcado
                    >
                        Concluir Trilhas Selecionadas ({selectedTrilhas.length})
                    </button>
                </div>
            </div>
        </section>
    );
};
// =======================================================


const Dashboard: React.FC = () => {
  // --- Refs para o Carrossel ---
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const [allTrilhas, setAllTrilhas] = useState<Curso[]>(allCursos); // Usa estado para gerenciar trilhas
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('João Sobrenome');
  const [userRole, setUserRole] = useState('Colaborador');
  const [userCompany, setUserCompany] = useState('Entrenova Tech'); 

  const [activeFilter, setActiveFilter] = useState<CursoStatus | 'todas'>('progresso');

  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);

  // Lógica de filtro (permanece a mesma, mas usa allTrilhas)
  const filteredCursos = allTrilhas.filter(curso => {
    if (activeFilter === 'todas') {
      return true; 
    }
    // CORREÇÃO DA LÓGICA DO FILTRO: Retorna APENAS os cursos cujo status corresponde ao filtro ativo
    return curso.status === activeFilter; 
  });


  // --- Lógica de Navegação do Carrossel ---
  const checkScroll = () => {
    if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
        const scrollAmount = 320; // 300px (card) + 20px (gap)
        carouselRef.current.scrollBy({
            left: direction === 'right' ? scrollAmount : -scrollAmount,
            behavior: 'smooth'
        });
    }
  };
    
    // NOVO HANDLER DE CONCLUSÃO DE TRILHA MÚLTIPLA
    const handleConcluirTrilhasSelecionadas = (ids: number[]) => {
        setAllTrilhas(prevTrilhas => 
            prevTrilhas.map(curso => 
                // Se o ID do curso estiver no array 'ids', marca como concluído
                ids.includes(curso.id) ? { ...curso, status: 'concluido' } : curso
            )
        );
        // Garante que o carrossel recheque a rolagem após a atualização
        setTimeout(checkScroll, 100); 
    };


  useEffect(() => {
    // Adiciona listener de scroll para atualizar as setas
    carouselRef.current?.addEventListener('scroll', checkScroll);
    // Chama a checagem inicial após a renderização (para setar o scrollRight)
    setTimeout(checkScroll, 50); 
    
    // Cleanup do listener
    return () => {
        carouselRef.current?.removeEventListener('scroll', checkScroll);
    };
  }, [filteredCursos, loading]);
  // ------------------------------------------

  // ... (Lógica de autenticação e scores) ...
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase
          .from('profiles')
          .select('full_name, role, cnpj_empresa') 
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (data) {
              setUserName(data.full_name);
              setUserRole(data.role === 'rh' ? 'Gerente RH' : 'Colaborador');
              if (data.cnpj_empresa) {
                  setUserCompany(`ENTRENOVA TECH`); // Mantido o texto fixo para o badge
              }
            } else if (error) {
              console.error('Erro ao buscar perfil:', error.message);
            }
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  }, []); 
  
  const handleDetalhesClick = (curso: Curso) => {
    setSelectedCurso(curso);
  };
  
  const handleCloseModal = () => {
    setSelectedCurso(null);
  };


  if (loading) {
     return <div className="loading-error-container">Carregando Dashboard...</div>;
  }

  /* Lógica para calcular o progresso da trilha para o score (2/10) com base no estado allTrilhas */
  const totalCursos = allTrilhas.length;
  const concluidosCount = allTrilhas.filter(c => c.status === 'concluido').length;
  const progressRatio = totalCursos > 0 ? `${concluidosCount}/${totalCursos}` : '0/0';


  return (
    <div className="dashboard-layout">
      <div className="dashboard-main">
        <DashboardHeader />

        {/* --- 1. SEÇÃO 1: IDENTIFICAÇÃO DO USUÁRIO --- */}
        <section className="dash-section dash-section--hero">
          {/* INÍCIO DO WRAPPER DE LARGURA MÁXIMA (800PX) */}
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="dash-card dash-card--hero">
              <img
                src={userIcon}
                alt="Ícone do Usuário"
                className="dash-card__user-icon"
              />
              <div className="dash-card__header">
                <span className="dash-badge dash-badge--active">{userCompany}</span>
                <h2>{userName}</h2>
                <span className="dash-tag">{userRole}</span>
              </div>
              {/* REMOVIDO: dash-score--secondary (Nota Média) */}
              <div className="dash-card__score">
                <div className="dash-score">
                  <div className="dash-score__ring">
                    <span>{progressRatio}</span> 
                  </div>
                  <small>Trilhas</small>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* --- 2. SEÇÃO 2: TRILHAS PERSONALIZADAS (Carrossel) --- */}
        <section className="dash-section dash-section--carousel">
          <header className="dash-section__header dash-section__header--no-line">
            <h3 className="dash-section__title">Trilhas de Aprendizado</h3>
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

          {/* NOVO WRAPPER PARA POSICIONAR AS SETAS */}
          <div className="carousel-wrapper">
             
            {/* Botão de Navegação Esquerda */}
            <button 
                onClick={() => scrollCarousel('left')} 
                className={`carousel-nav-btn carousel-nav-btn--prev ${canScrollLeft ? 'visible' : ''}`}
                disabled={!canScrollLeft}
                aria-label="Anterior"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
            </button>

            {/* Carrossel de Trilhas */}
            <div className="dash-carousel" ref={carouselRef}>
              
              {filteredCursos.length === 0 && (
                <p className="dash-carousel__empty-message">Nenhuma trilha encontrada para este filtro.</p>
              )}

              {filteredCursos.map(curso => ( // USANDO filteredCursos PARA APLICAR OS FILTROS
                <article 
                    className="dash-carousel-item" 
                    key={curso.id}
                    onClick={() => handleDetalhesClick(curso)} // TORNANDO O CARD INTEIRO CLICÁVEL
                >
                  
                  <div className="dash-carousel-item__thumbnail" 
                      style={{ backgroundImage: `url(${curso.thumbnailUrl})` }}
                  >
                  </div>

                  <div className="dash-carousel-item__content">
                    <h4 className="dash-item__title">{curso.title}</h4>
                    
                    {/* Novo meta text */}
                    <div className="dash-item__text-meta">
                        <small>{curso.progress}% {curso.status === 'concluido' ? 'Concluído' : 'Em Progresso'}</small>
                    </div>
                    
                  </div>
                </article>
              ))}
            </div>

            {/* Botão de Navegação Esquerda */}
            <button 
                onClick={() => scrollCarousel('left')} 
                className={`carousel-nav-btn carousel-nav-btn--prev ${canScrollLeft ? 'visible' : ''}`}
                disabled={!canScrollLeft}
                aria-label="Anterior"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
            </button>

            {/* Botão de Navegação Direita */}
            <button 
                onClick={() => scrollCarousel('right')} 
                className={`carousel-nav-btn carousel-nav-btn--next ${canScrollRight ? 'visible' : ''}`}
                disabled={!canScrollRight}
                aria-label="Próximo"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </button>
          </div>
        </section>
        
        {/* --- 3. SEÇÃO 3: ATIVIDADES E PENDÊNCIAS --- */}
        <Pendencias cursos={allTrilhas} />

        {/* --- 4. SEÇÃO 4: NOVO CARD DE CONCLUSÃO DE TRILHA (SUBSTITUI PROGESSO E GRÁFICOS) --- */}
        <TrilhaConclusaoCard cursos={allTrilhas} onConcluirSelecionadas={handleConcluirTrilhasSelecionadas} />


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