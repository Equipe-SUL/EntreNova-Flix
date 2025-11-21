import React, { useState } from 'react';
import { Curso } from '../pages/Dashboard'; 

// URL de uma thumbnail placeholder (caso o curso não tenha uma)
const PLACEHOLDER_IMG = 'https://via.placeholder.com/1280x720/1a1a1a/ff007f?text=Em+Breve';

interface DetalhesModalProps {
  curso: Curso;
  onClose: () => void;
}

const DetalhesModal: React.FC<DetalhesModalProps> = ({ curso, onClose }) => {
  
  const thumbnail = curso.thumbnailUrl || PLACEHOLDER_IMG;

  // 1. LÓGICA DO BOTÃO DE AÇÃO
  let buttonText = 'Iniciar';
  let buttonClass = 'modal-action-btn--primary'; // Estilo magenta padrão
  let showSecondaryButton = false;
  const secondaryButtonText = "Iniciar";
  
  if (curso.status === 'concluido') {
      buttonText = 'Revisar';
      buttonClass = 'modal-action-btn--primary';
      showSecondaryButton = false; // Não mostra o segundo botão se for Revisar
  } else if (curso.status === 'progresso') {
      // Se em progresso, mostra Retomar (primário) e Iniciar do zero (secundário)
      buttonText = curso.progress > 0 ? 'Retomar' : 'Iniciar';
      buttonClass = 'modal-action-btn--primary';
      showSecondaryButton = curso.progress > 0; // Só mostra 'Iniciar' se já estiver em progresso
  }


  return (
    // O overlay fecha o modal ao clicar fora
    <div className="modal-overlay" onClick={onClose}>
      
      {/* O stopPropagation evita que o clique no card feche o modal */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <button className="modal-close-btn" onClick={onClose}>X</button>
        
        <h3>{curso.title}</h3>
        
        {/* CORREÇÃO: backgroundSize: 'contain' para garantir que a imagem apareça inteira */}
        <div className="modal-thumbnail-container" style={{ 
             backgroundImage: `url(${thumbnail})`,
             backgroundSize: 'contain', /* MANTIDO: Garante que não haja corte */
             backgroundRepeat: 'no-repeat',
             backgroundPosition: 'center center', 
             /* REMOVIDO: backgroundColor: '#000' */
        }}>
            {/* NOVO ELEMENTO PARA O EFEITO DE HOVER/PLAY */}
            <div className="modal-thumbnail-overlay">
                {/* SUBSTITUÍDO O ÍCONE DE CHECK PELO ÍCONE DE PLAY PADRÃO (TRIÂNGULO) */}
                <svg className="modal-play-icon" viewBox="0 0 24 24" fill="#ff007f">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            </div>
        </div>
        
        {/* Adiciona a descrição se ela existir */}
        {curso.description && (
          <p className="modal-description">
            {curso.description}
          </p>
        )}
        
        {/* NOVO GRUPO DE BOTÕES DE AÇÃO */}
        <div className="modal-actions-group">
            {/* Botão Primário (Retomar/Revisar/Iniciar) */}
            <button className={`modal-action-btn ${buttonClass} ${showSecondaryButton ? 'modal-action-btn--small' : ''}`}>
                {buttonText}
            </button>

            {/* Botão Secundário (Iniciar) */}
            {showSecondaryButton && (
                <button className="modal-action-btn modal-action-btn--outline modal-action-btn--small">
                    {secondaryButtonText}
                </button>
            )}
        </div>
        
        <p className="modal-meta"> 
          Este É Um Módulo Do Tipo "{curso.type}", De Nível {curso.level}.
        </p>
        
      </div>
    </div>
  );
};

export default DetalhesModal;