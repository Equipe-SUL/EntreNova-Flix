import React, { useRef, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import "../styles/Dashboardrh.css"

interface Trilha {
  id: number;
  titulo: string;
  tipo: string;
  duracao: string;
  cor: string;
}

const coresPadrao = ["#4a148c", "#0d47a1", "#1b5e20", "#b71c1c", "#f57f17", "#006064", "#311b92"];

const TrilhasCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrilhas = async () => {
      try {
        // Busca a sessão do usuário RH
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.error('Usuário não autenticado');
          setLoading(false);
          return;
        }

        // Busca o perfil do RH para obter o CNPJ
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('cnpj_empresa')
          .eq('id', session.user.id)
          .single();

        if (profileError || !profile?.cnpj_empresa) {
          console.error('Erro ao buscar perfil ou CNPJ não encontrado:', profileError);
          setLoading(false);
          return;
        }

        // Busca as trilhas da empresa na tabela plano_empresa (campo 'trilhas' é JSON)
        const { data: planoData, error: planoError } = await supabase
          .from('plano_empresa')
          .select('trilhas')
          .eq('cnpj_empresa', profile.cnpj_empresa)
          .single();

        if (planoError) {
          console.error('Erro ao buscar plano e trilhas:', planoError);
          setLoading(false);
          return;
        }

        if (planoData && planoData.trilhas && Array.isArray(planoData.trilhas) && planoData.trilhas.length > 0) {
          // Transforma os dados do banco (array JSON) em formato de trilhas para exibição
          const trilhasFormatadas: Trilha[] = planoData.trilhas.map((trilhaId: string, index: number) => {
            const trilhaIdStr = String(trilhaId || '');
            
            // Extrai o tipo/modelo do trilha_id (formato: "descrição - Modelo: tipo")
            const modeloMatch = trilhaIdStr.match(/Modelo:\s*(.+)/i);
            const tipo = modeloMatch ? modeloMatch[1].trim() : 'Vídeo';
            
            // Extrai a descrição (tudo antes de " - Modelo:")
            const descricao = trilhaIdStr.split(' - Modelo:')[0].trim() || trilhaIdStr;
            
            // Determina duração padrão baseada no tipo
            let duracao = "45 min";
            if (tipo.toLowerCase().includes('podcast')) {
              duracao = "20 min";
            } else if (tipo.toLowerCase().includes('quiz') || tipo.toLowerCase().includes('atividade')) {
              duracao = "10 min";
            } else if (tipo.toLowerCase().includes('curso')) {
              duracao = "2h 10m";
            }

            return {
              id: index + 1,
              titulo: descricao,
              tipo: tipo,
              duracao: duracao,
              cor: coresPadrao[index % coresPadrao.length]
            };
          });

          setTrilhas(trilhasFormatadas);
        } else {
          // Se não houver trilhas, mantém vazio
          setTrilhas([]);
        }
      } catch (error) {
        console.error('Erro ao carregar trilhas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrilhas();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300; // Quantidade de pixels para rolar
      if (direction === 'left') {
        current.scrollLeft -= scrollAmount;
      } else {
        current.scrollLeft += scrollAmount;
      }
    }
  };

  return (
    <div className="carousel-container">
      {/* Botão Esquerda */}
      <button className="carousel-btn left" onClick={() => scroll('left')}>
        ‹
      </button>

      {/* Área de Scroll */}
      <div className="carousel-scroll-area" ref={scrollRef}>
        {loading ? (
          <div style={{ padding: '20px', color: '#fff', textAlign: 'center' }}>
            Carregando trilhas...
          </div>
        ) : trilhas.length === 0 ? (
          <div style={{ padding: '20px', color: '#888', textAlign: 'center' }}>
            Nenhuma trilha disponível
          </div>
        ) : (
          trilhas.map((trilha) => (
            <div key={trilha.id} className="track-card">
              {/* Imagem (Placeholder com cor por enquanto) */}
              <div className="track-image-box" style={{background: `linear-gradient(45deg, #111, ${trilha.cor})`}}>
                {/* Se tiver imagem real: <img src={...} alt="..." /> */}
                <span className="track-badge">{trilha.tipo}</span>
              </div>
              
              <div className="track-info">
                <h4>{trilha.titulo}</h4>
                <p>{trilha.duracao}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Botão Direita */}
      <button className="carousel-btn right" onClick={() => scroll('right')}>
        ›
      </button>
    </div>
  );
};

export default TrilhasCarousel;