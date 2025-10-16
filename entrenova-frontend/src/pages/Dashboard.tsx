import React from 'react';
import DashboardHeader from '../components/DashboardHeader';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardFooter from '../components/DashboardFooter';
import '../styles/dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-layout">
      <DashboardSidebar />

      <div className="dashboard-main">
        <DashboardHeader />

        <section className="dash-section">
          <div className="dash-card dash-card--hero">
            <div className="dash-card__header">
              <span className="dash-badge dash-badge--active">Funcionário Ativo</span>
              <h2>João da Silva</h2>
              <span className="dash-tag">Desenvolvimento Frontend</span>
            </div>

            <div className="dash-card__score">
              <div className="dash-score">
                <div className="dash-score__ring">
                  <span>8/10</span>
                </div>
                <small>Pontuação</small>
              </div>
            </div>
          </div>
        </section>

        <section className="dash-section">
          <header className="dash-section__header">
            <h3>Trilhas de Aprendizado</h3>
            <p>Continue seu desenvolvimento profissional</p>
            <div className="dash-filters">
              <button className="dash-chip">Todas</button>
              <button className="dash-chip dash-chip--active">Em Progresso</button>
              <button className="dash-chip">Concluídas</button>
            </div>
          </header>

          <div className="dash-list">
            <article className="dash-item">
              <div className="dash-item__left">
                <div className="dash-item__icon" aria-hidden="true">📌</div>
                <div>
                  <small className="dash-item__level">Intermediário</small>
                  <h4 className="dash-item__title">React Avançado</h4>
                  <small className="dash-item__time">6h 40min</small>
                </div>
              </div>
              <div className="dash-item__right">
                <div className="dash-progress">
                  <div className="dash-progress__track">
                    <div className="dash-progress__bar" style={{ width: '70%' }} />
                  </div>
                  <span className="dash-progress__pct">70%</span>
                </div>
                <div className="dash-score-chip">Nota: 8.5</div>
                <div className="dash-actions">
                  <button className="dash-btn dash-btn--primary">Continuar</button>
                  <button className="dash-btn dash-btn--outline">Detalhes</button>
                </div>
              </div>
            </article>

            <article className="dash-item">
              <div className="dash-item__left">
                <div className="dash-item__icon" aria-hidden="true">📌</div>
                <div>
                  <small className="dash-item__level">Iniciante</small>
                  <h4 className="dash-item__title">Fundamentos de Desenvolvimento Web</h4>
                  <small className="dash-item__time">3h 15min</small>
                </div>
              </div>
              <div className="dash-item__right">
                <div className="dash-progress">
                  <div className="dash-progress__track">
                    <div className="dash-progress__bar" style={{ width: '45%' }} />
                  </div>
                  <span className="dash-progress__pct">45%</span>
                </div>
                <div className="dash-score-chip">Nota: 7.6</div>
                <div className="dash-actions">
                  <button className="dash-btn dash-btn--primary">Continuar</button>
                  <button className="dash-btn dash-btn--outline">Detalhes</button>
                </div>
              </div>
            </article>

            <article className="dash-item">
              <div className="dash-item__left">
                <div className="dash-item__icon" aria-hidden="true">🎨</div>
                <div>
                  <small className="dash-item__level">Iniciante</small>
                  <h4 className="dash-item__title">UI/UX Basics</h4>
                  <small className="dash-item__time">2h 10min</small>
                </div>
              </div>
              <div className="dash-item__right">
                <div className="dash-progress">
                  <div className="dash-progress__track">
                    <div className="dash-progress__bar" style={{ width: '20%' }} />
                  </div>
                  <span className="dash-progress__pct">20%</span>
                </div>
                <div className="dash-score-chip">Nota: 6.8</div>
                <div className="dash-actions">
                  <button className="btn-x9zq1">Continuar</button>
                  <button className="dash-btn dash-btn--outline">Detalhes</button>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="dash-section">
          <header className="dash-section__header">
            <h3>Cursos Concluídos</h3>
            <p>Veja seu histórico e pontuações</p>
          </header>

          <div className="dash-list">
            <article className="dash-item">
              <div className="dash-item__left">
                <div className="dash-item__icon" aria-hidden="true">✅</div>
                <div>
                  <small className="dash-item__level">Intermediário</small>
                  <h4 className="dash-item__title">TypeScript Essencial</h4>
                  <small className="dash-item__time">4h 20min</small>
                </div>
              </div>
              <div className="dash-item__right">
                <div className="dash-progress">
                  <div className="dash-progress__track">
                    <div className="dash-progress__bar" style={{ width: '100%' }} />
                  </div>
                  <span className="dash-progress__pct">100%</span>
                </div>
                <div className="dash-score-chip">Nota: 9.2</div>
                <button className="dash-btn">Revisar</button>
              </div>
            </article>
          </div>
        </section>

        <DashboardFooter />
      </div>
    </div>
  );
};

export default Dashboard;