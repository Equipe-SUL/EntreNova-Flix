import { Curso } from '../pages/Dashboard'; // Importa a interface Curso
import '../styles/Pendencias.css'; // Novo arquivo de estilo

interface PendenciasProps {
  cursos: Curso[];
}

const Pendencias: React.FC<PendenciasProps> = ({ cursos }) => {
  // 1. Separa as trilhas em Pendentes e Concluídas
  const pendentes = cursos.filter(c => c.status === 'progresso' || c.status === 'novo');
  const concluidas = cursos.filter(c => c.status === 'concluido');

  // 2. Conta quantos itens extras existem para exibição simplificada
  const itensVisiveisPendente = 3;
  const itensEscondidosCount = pendentes.length > itensVisiveisPendente 
    ? pendentes.length - itensVisiveisPendente 
    : 0;

  return (
    <section className="pendencias-section dash-section">
      <h3>Atividades e Pendências</h3>
      <div className="pendencias-container">
        
        {/* Card da Esquerda: EM FOCO / PENDÊNCIAS */}
        <div className="pendencias-card pendencias-card--pendente">
          <h4>Em Foco: {pendentes.length} Pendências</h4>
          <p className="pendencias-subtext">Revise as trilhas que precisam de sua atenção.</p>
          
          <ul className="pendencias-list">
            {/* Limita a exibição aos 3 primeiros itens pendentes */}
            {pendentes.slice(0, itensVisiveisPendente).map(curso => (
              <li key={curso.id} className="pendencias-list-item">
                <span className="list-icon">📝</span>
                <p className="item-title">{curso.title}</p>
                {/* Status textual */}
                <small data-status={curso.status}>Pendente</small>
              </li>
            ))}

            {itensEscondidosCount > 0 && (
              <li className="list-more">
                + {itensEscondidosCount} itens em outras trilhas
              </li>
            )}
          </ul>

          <button className="dash-btn dash-btn--primary">
            Ver todas as Pendências
          </button>
        </div>

        {/* Card da Direita: CONCLUÍDAS */}
        <div className="pendencias-card pendencias-card--concluido">
          <h4>Concluídas ({concluidas.length})</h4>
          <p className="pendencias-subtext">Parabéns pelo seu progresso!</p>
          
          <ul className="pendencias-list">
            {concluidas.slice(0, 3).map(curso => (
              <li key={curso.id} className="pendencias-list-item">
                <span className="list-icon">✅</span>
                <p className="item-title">{curso.title}</p>
                <small data-status={curso.status}>Concluída</small>
                {/* O score foi removido aqui. */}
              </li>
            ))}

            {concluidas.length > 3 && (
                <li className="list-more">...</li>
            )}

            {concluidas.length === 0 && (
                 <li className="list-empty">Nenhuma trilha concluída.</li>
            )}
          </ul>
          
          <button className="dash-btn dash-btn--primary">
            Ver Histórico
          </button>
        </div>
      </div>
    </section>
  );
};

export default Pendencias;