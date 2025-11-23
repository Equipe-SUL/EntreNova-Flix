import { useEffect, useState, useRef } from 'react'; 

import DashboardHeader from '../components/DashboardHeader';

import DashboardFooter from '../components/DashboardFooter';

import DetalhesModal from '../components/DetalhesModal'; 

import '../styles/dashboard.css';

import '../styles/DetalhesModal.css'; 

import userIcon from '../assets/dashuser_icon.png';

import { supabase } from '../services/supabase';



// ================== trilhas ==================



// CAPAS FEITAS PELO UANDS (1.jpg, 2.jpg, 3.jpg)

import thumbProgresso1 from '../assets/1.jpg';

import thumbProgresso2 from '../assets/2.jpg';

import thumbProgresso3 from '../assets/3.jpg';

import thumbProgresso4 from '../assets/4.jpg';

import thumbProgresso5 from '../assets/5.jpg';

import thumbProgresso6 from '../assets/6.jpg';

import thumbProgresso7 from '../assets/7.jpg';

import thumbProgresso8 from '../assets/8.jpg';

import thumbProgresso9 from '../assets/9.jpg';

import thumbProgresso10 from '../assets/10.jpg';



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

  trilhaIdOriginal?: string; // ID original do banco de dados (trilha_id completo)

}



// lista de cards das trilhas FICTICIAS 

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




interface HistoricoModalProps {

    trilhas: Curso[];

    onClose: () => void;

}



const HistoricoModal: React.FC<HistoricoModalProps> = ({ trilhas, onClose }) => {

    return (

        <div className="modal-overlay" onClick={onClose}>

            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>

                <button className="modal-close-btn" onClick={onClose}>X</button>

                <h3 style={{color: '#00BFFF'}}>Histórico de Conclusão</h3>

                <ul className="pendencias-list" style={{ marginTop: '10px' }}>

                    {trilhas.map(curso => (

                        <li key={curso.id} className="pendencias-list-item">

                             <span className="list-icon" style={{color: '#00BFFF'}}>✅</span>

                            <p className="item-title">{curso.title}</p>

                            <small style={{color: '#00BFFF'}}>Concluída</small>

                        </li>

                    ))}

                    {trilhas.length === 0 && (

                        <li className="list-empty">Nenhuma trilha concluída ainda.</li>

                    )}

                </ul>

            </div>

        </div>

    );

};





interface TrilhaConclusaoCardProps {

    cursos: Curso[];

    onConcluirSelecionadas: (ids: number[]) => void;

}



const TrilhaConclusaoCard: React.FC<TrilhaConclusaoCardProps> = ({ cursos, onConcluirSelecionadas }) => {

    const [selectedTrilhas, setSelectedTrilhas] = useState<number[]>([]); 

    const [isHistoricoOpen, setIsHistoricoOpen] = useState(false);



    const handleCheckboxChange = (id: number, isChecked: boolean) => {

        setSelectedTrilhas(prevSelected => 

            isChecked ? [...prevSelected, id] : prevSelected.filter(trilhaId => trilhaId !== id)

        );

    };



    const handleFinalizar = () => {

        if (selectedTrilhas.length === 0) {

            alert("Selecione pelo menos uma trilha para concluir.");

            return;

        }



        const confirmacao = window.confirm(

            `Você tem certeza que deseja marcar ${selectedTrilhas.length} trilha(s) como concluída(s)?`

        );



        if (confirmacao) {

            onConcluirSelecionadas(selectedTrilhas); 

            setSelectedTrilhas([]);

        }

    };



    const trilhasAbertas = cursos.filter(c => c.status !== 'concluido');

    const trilhasConcluidas = cursos.filter(c => c.status === 'concluido');

    

    return (

        <section className="dash-section">

            <h3 className="dash-section__title">Checklist das Trilhas</h3> 

            

      

            <div className="checklist-avatar-container"> 

                

                {/* 1. CARD DA ESQUERDA: PENDENTES (Checklist) */}

                <div className="pendencias-card checklist-card" style={{ borderLeft: '5px solid #ff007f', display: 'flex', flexDirection: 'column' }}>

                    <h4>Trilhas Pendentes ({trilhasAbertas.length})</h4>

                    <p className="pendencias-subtext">Selecione para marcar como concluída e atualizar seu progresso.</p>

                    

                    <ul className="pendencias-list" style={{ marginBottom: '15px', flexGrow: 1 }}>

                        {trilhasAbertas.map(curso => (

                            <li key={curso.id} className="pendencias-list-item">

                                <input type="checkbox" id={`curso-${curso.id}`} checked={selectedTrilhas.includes(curso.id)} onChange={(e) => handleCheckboxChange(curso.id, e.target.checked)} style={{ accentColor: '#ff007f' }} />

                                <label htmlFor={`curso-${curso.id}`} className="item-title" style={{ fontWeight: 400, color: '#eee' }}>

                                    {curso.title} ({curso.level})

                                </label>

                            </li>

                        ))}

                        {trilhasAbertas.length === 0 && (<li className="list-empty">🎉 Nenhuma pendência restante!</li>)}

                    </ul>

                    <button 

                        className="dash-btn dash-btn--primary"

                        onClick={handleFinalizar}

                        disabled={selectedTrilhas.length === 0}

                        style={{width: '100%', marginTop: 'auto'}}

                    >

                        Concluir Trilhas Selecionadas ({selectedTrilhas.length})

                    </button>

                </div>

                

                {/* 2. CARD DA DIREITA: CONCLUÍDAS (Lista e Botão Histórico) */}

                 <div className="pendencias-card concluidas-card" style={{ borderLeft: '5px solid #00BFFF', display: 'flex', flexDirection: 'column' }}>

                    <h4>Atividades Concluídas ({trilhasConcluidas.length})</h4>

                    <p className="pendencias-subtext">Visualize o histórico de trilhas finalizadas.</p>

                    

                    <ul className="pendencias-list" style={{ flexGrow: 1 }}>

                        {trilhasConcluidas.slice(0, 4).map(curso => (

                            <li key={curso.id} className="pendencias-list-item">

                                <span className="list-icon" style={{color: '#00BFFF'}}>✅</span>

                                <p className="item-title">{curso.title}</p>

                                <small style={{color: '#00BFFF'}}>Concluída</small>

                            </li>

                        ))}

                        {trilhasConcluidas.length === 0 && (

                             <li className="list-empty">Nenhuma trilha concluída ainda.</li>

                        )}

                        

                    </ul>

                    <button 

                        className="dash-btn dash-btn--outline" 

                        onClick={() => setIsHistoricoOpen(true)}

                        style={{width: '100%', marginTop: 'auto'}}

                    >

                        Ver Histórico ({trilhasConcluidas.length})

                    </button>

                </div>



            </div>



            {/* Modal de Histórico */}

            {isHistoricoOpen && (

                <HistoricoModal trilhas={trilhasConcluidas} onClose={() => setIsHistoricoOpen(false)} />

            )}

        </section>

    );

};





const Dashboard: React.FC = () => {



  const carouselRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const [canScrollRight, setCanScrollRight] = useState(false);



  const [allTrilhas, setAllTrilhas] = useState<Curso[]>([]); 
  const [loading, setLoading] = useState(true);

  const [userName, setUserName] = useState('João Sobrenome');

  const [userRole, setUserRole] = useState('Colaborador');

  const [userCompany, setuserCompany] = useState('Entrenova Tech');

  const [userId, setUserId] = useState<string | null>(null); 



  const [activeFilter, setActiveFilter] = useState<CursoStatus | 'todas'>('progresso');



  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);

  // Função para buscar trilhas do funcionário no banco de dados
  const fetchTrilhasFromDB = async (userId: string) => {
    try {
      const { data: progressoData, error: progressoError } = await supabase
        .from('progresso_funcionario')
        .select('*')
        .eq('user_id', userId)
        .order('id', { ascending: true });

      if (progressoError) {
        console.error('Erro ao buscar progresso:', progressoError);
        return [];
      }

      if (!progressoData || progressoData.length === 0) {
        console.log('Nenhuma trilha encontrada para o usuário');
        return [];
      }

      // Mapear dados do banco para o formato Curso
      const trilhasMapeadas: Curso[] = progressoData.map((item, index) => {
        // Parsear o trilha_id para extrair informações
        const trilhaId = item.trilha_id || '';
        const isConcluida = item.is_concluida || false;
        
        // Extrair modelo do texto (formato: "descrição - Modelo: modelo")
        const modeloMatch = trilhaId.match(/Modelo:\s*(.+)/i);
        const modelo = modeloMatch ? modeloMatch[1].trim() : 'video';
        
        // Determinar o tipo baseado no modelo
        let type: 'video' | 'podcast' | 'atividade' = 'video';
        const modeloLower = modelo.toLowerCase();
        if (modeloLower.includes('podcast')) {
          type = 'podcast';
        } else if (modeloLower.includes('quiz') || modeloLower.includes('atividade') || modeloLower.includes('curso')) {
          type = 'atividade';
        }

        // Extrair descrição (tudo antes de " - Modelo:")
        const descricaoMatch = trilhaId.split(' - Modelo:')[0];
        const descricao = descricaoMatch || trilhaId;

        // Determinar status
        const status: CursoStatus = isConcluida ? 'concluido' : 'progresso';

        // Gerar um ID único baseado no índice e user_id
        const id = item.id || index + 1;

        // Determinar nível baseado na descrição ou padrão
        let level = 'Intermediário';
        if (descricao.toLowerCase().includes('básico') || descricao.toLowerCase().includes('iniciante')) {
          level = 'Iniciante';
        } else if (descricao.toLowerCase().includes('avançado') || descricao.toLowerCase().includes('expert')) {
          level = 'Avançado';
        }

        // Estimar duração baseada no tipo
        let time = '2h 00min';
        if (type === 'podcast') {
          time = '1h 30min';
        } else if (type === 'atividade') {
          time = '45min';
        }

        // Ícone baseado no tipo
        let icon = '🚀';
        if (type === 'podcast') {
          icon = '🎧';
        } else if (type === 'atividade') {
          icon = '✅';
        }

        // Thumbnail padrão (pode ser melhorado depois)
        const thumbnails = [
          thumbProgresso1, 
          thumbProgresso2, 
          thumbProgresso3,
          thumbProgresso4,
          thumbProgresso5,
          thumbProgresso6,
          thumbProgresso7,
          thumbProgresso8,
          thumbProgresso9,
          thumbProgresso10
        ];
        const thumbnailUrl = thumbnails[index % thumbnails.length];

        // Progresso baseado no status
        const progress = isConcluida ? 100 : Math.floor(Math.random() * 80) + 10; // 10-90% para em progresso

        // Score apenas para concluídas
        const score = isConcluida ? parseFloat((Math.random() * 2 + 7).toFixed(1)) : undefined;

        return {
          id: Number(id),
          icon,
          level,
          title: descricao.length > 50 ? descricao.substring(0, 50) + '...' : descricao,
          time,
          status,
          type,
          thumbnailUrl,
          description: descricao,
          progress,
          score,
          trilhaIdOriginal: trilhaId, // Salvar o trilha_id completo para atualizações
        };
      });

      return trilhasMapeadas;
    } catch (error) {
      console.error('Erro ao buscar trilhas:', error);
      return [];
    }
  };

  // Lógica de filtro 

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

        const scrollAmount = 320; 

        carouselRef.current.scrollBy({

            left: direction === 'right' ? scrollAmount : -scrollAmount,

            behavior: 'smooth'

        });

    }

  };

    


    const handleConcluirTrilhasSelecionadas = async (ids: number[]) => {
        if (!userId) {
            alert('Erro: Usuário não identificado.');
            return;
        }

        try {
            // Buscar as trilhas correspondentes aos IDs selecionados
            const trilhasParaAtualizar = allTrilhas.filter(curso => ids.includes(curso.id));
            
            // Atualizar cada trilha no banco de dados
            const updatePromises = trilhasParaAtualizar.map(async (curso) => {
                // Usar o trilha_id original se disponível, senão tentar montar a partir da descrição
                const trilhaIdParaBusca = curso.trilhaIdOriginal || (curso.description ? `${curso.description} - Modelo: ${curso.type === 'podcast' ? 'Podcast' : curso.type === 'atividade' ? 'Atividade' : 'Video'}` : curso.title);
                
                // Buscar o registro no banco pelo user_id e trilha_id
                const { data: progressoData, error: fetchError } = await supabase
                    .from('progresso_funcionario')
                    .select('id')
                    .eq('user_id', userId)
                    .eq('trilha_id', trilhaIdParaBusca)
                    .maybeSingle();

                if (fetchError) {
                    console.error(`Erro ao buscar progresso para trilha ${curso.id}:`, fetchError);
                    return;
                }

                if (progressoData) {
                    // Atualizar o registro existente
                    const { error: updateError } = await supabase
                        .from('progresso_funcionario')
                        .update({ is_concluida: true })
                        .eq('id', progressoData.id);

                    if (updateError) {
                        console.error(`Erro ao atualizar trilha ${curso.id}:`, updateError);
                    }
                } else {
                    // Se não encontrar, criar um novo registro
                    const trilhaIdParaInserir = curso.trilhaIdOriginal || (curso.description ? `${curso.description} - Modelo: ${curso.type === 'podcast' ? 'Podcast' : curso.type === 'atividade' ? 'Atividade' : 'Video'}` : curso.title);
                    
                    const { error: insertError } = await supabase
                        .from('progresso_funcionario')
                        .insert({
                            user_id: userId,
                            trilha_id: trilhaIdParaInserir,
                            is_concluida: true
                        });

                    if (insertError) {
                        console.error(`Erro ao inserir trilha ${curso.id}:`, insertError);
                    }
                }
            });

            await Promise.all(updatePromises);

            // Atualizar o estado local
            setAllTrilhas(prevTrilhas => 
                prevTrilhas.map(curso => 
                    ids.includes(curso.id) 
                        ? { ...curso, status: 'concluido', progress: 100 } 
                        : curso
                )
            );

            // Garante que o carrossel recheque a rolagem após a atualização
            setTimeout(checkScroll, 100);
        } catch (error) {
            console.error('Erro ao concluir trilhas:', error);
            alert('Erro ao salvar as alterações. Tente novamente.');
        }
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

 


  // ... (Lógica de autenticação e scores DE TRILHAS REALIZADAS EX: 2/10) ...

  useEffect(() => {

    supabase.auth.getSession().then(({ data: { session } }) => {

      if (session) {
        const currentUserId = session.user.id;
        setUserId(currentUserId);

        supabase

          .from('profiles')

          .select('full_name, role, cnpj_empresa') 

          .eq('id', currentUserId)

          .single()

          .then(async ({ data, error }) => {

            if (data) {

              setUserName(data.full_name);

              setUserRole(data.role === 'rh' ? 'Gerente RH' : 'Colaborador');

              if (data.cnpj_empresa) {

                  setuserCompany(`ENTRENOVA TECH`); 
              }

              // Buscar trilhas do banco de dados
              const trilhasDB = await fetchTrilhasFromDB(currentUserId);
              if (trilhasDB.length > 0) {
                setAllTrilhas(trilhasDB);
              } else {
                // Se não houver trilhas no banco, usar dados fictícios como fallback
                setAllTrilhas(allCursos);
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



        {/* SEÇÃO 1: IDENTIFICAÇÃO DO USUÁRIO --- */}

        <section className="dash-section dash-section--hero">

  
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

        

        {/*  SEÇÃO 2: TRILHAS PERSONALIZADAS (Carrossel) --- */}

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



            {/* SECTION 2: Carrossel de Trilhas */}

            <div className="dash-carousel" ref={carouselRef}>

              

              {filteredCursos.length === 0 && (

                <p className="dash-carousel__empty-message">Nenhuma trilha encontrada para este filtro.</p>

              )}



              {filteredCursos.map(curso => ( 

                <article 

                    className="dash-carousel-item" 

                    key={curso.id}

                    onClick={() => handleDetalhesClick(curso)} 

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

        




        {/*SEÇÃO 3: CHECKLIST DAS TRILHAS  */}

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