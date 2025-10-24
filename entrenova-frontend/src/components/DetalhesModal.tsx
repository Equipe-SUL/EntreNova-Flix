import React from 'react';
import { Curso } from '../pages/Dashboard'; 

// URL de uma thumbnail placeholder (caso o curso não tenha uma)
const PLACEHOLDER_IMG = 'https://via.placeholder.com/1280x720/1a1a1a/ff007f?text=Em+Breve';

interface DetalhesModalProps {
  curso: Curso;
  onClose: () => void;
}

const DetalhesModal: React.FC<DetalhesModalProps> = ({ curso, onClose }) => {
  
  const thumbnail = curso.thumbnailUrl || PLACEHOLDER_IMG;

  return (
    // O overlay fecha o modal ao clicar fora
    <div className="modal-overlay" onClick={onClose}>
      
      {/* O stopPropagation evita que o clique no card feche o modal */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <button className="modal-close-btn" onClick={onClose}>X</button>
        
        <h3>{curso.title}</h3>
        
        <div className="modal-thumbnail-container">
          <img 
            src={thumbnail} 
            alt={`Thumbnail para ${curso.title}`} 
            className="modal-thumbnail-img"
          />
        </div>
        
        {/* Adiciona a descrição se ela existir */}
        {curso.description && (
          <p className="modal-description">
            {curso.description}
          </p>
        )}
        
        {/* Renomeei a classe deste parágrafo para 'modal-meta' */}
        <p className="modal-meta"> 
          Este é um módulo do tipo "{curso.type}", de nível {curso.level}.
        </p>
        
      </div>
    </div>
  );
};

export default DetalhesModal;