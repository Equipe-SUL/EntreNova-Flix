import React from 'react';
import '../styles/NotificacoesModal.css'; 

interface NotificacoesModalProps {
  onClose: () => void;
}

const NotificacoesModal: React.FC<NotificacoesModalProps> = ({ onClose }) => {
  return (
    
    <div className="modal-overlay" onClick={onClose}>
      {/* Conteúdo (para o clique) */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Botão de Fechar (o mesmo do DetalhesModal) */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Fechar modal">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="modal-close-icon"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h3>Notificações</h3>

        {/* Lista de notificações (com os estilos criativos) */}
        <ul className="notificacoes-lista-modal">
          <li>
            <span className="notificacao-tipo atividade">Atividade</span>
            <div className="notificacao-texto">
              <strong>Entrega: Fundamentos Web</strong>
              <span>Não se esqueça de enviar a Atividade 1.</span>
            </div>
          </li>
          <li>
            <span className="notificacao-tipo podcast">Podcast</span>
            <div className="notificacao-texto">
              <strong>Aula 2 de Comunicação Eficaz</strong>
              <span>Você parou na metade. Termine de ouvir.</span>
            </div>
          </li>
          <li>
            <span className="notificacao-tipo video">Vídeo</span>
            <div className="notificacao-texto">
              <strong>Próxima aula: React Avançado</strong>
              <span>Aprenda sobre "Renderização Condicional".</span>
            </div>
          </li>
          <li>
            <span className="notificacao-tipo atividade">Atividade</span>
            <div className="notificacao-texto">
              <strong>Feedback: UI/UX Basics</strong>
              <span>Seu mentor deixou um feedback na Atividade 2.</span>
            </div>
          </li>
        </ul>

      </div>
    </div>
  );
};

export default NotificacoesModal;