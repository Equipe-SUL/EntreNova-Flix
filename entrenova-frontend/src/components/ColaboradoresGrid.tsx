// src/components/ColaboradoresGrid.tsx
import React from 'react';

// Dados Fictícios (Mock)
const mockColaboradores = [
  { id: 1, nome: "Ana Silva", cargo: "Analista de Marketing", setor: "Marketing", status: "active" },
  { id: 2, nome: "Carlos Souza", cargo: "Desenvolvedor Senior", setor: "Tech", status: "active" },
  { id: 3, nome: "Beatriz Lima", cargo: "Gerente de Vendas", setor: "Comercial", status: "active" },
  { id: 4, nome: "João Pedro", cargo: "Estagiário", setor: "Design", status: "active" },
  { id: 5, nome: "Fernanda Costa", cargo: "RH Business Partner", setor: "Recursos Humanos", status: "active" },
  { id: 6, nome: "Rafael Alves", cargo: "Engenheiro de Dados", setor: "Tech", status: "active" },
  { id: 7, nome: "Mariana Dias", cargo: "Coordenadora", setor: "Financeiro", status: "inactive" },
  { id: 8, nome: "Lucas Pereira", cargo: "Suporte Técnico", setor: "Operações", status: "active" },
];

const ColaboradoresGrid: React.FC = () => {
  return (
    <div className="colaboradores-grid">
      {mockColaboradores.map((colab) => (
        <div key={colab.id} className="colab-card">
          
          {/* Área Visual (Avatar/Topo) */}
          <div className="colab-avatar-box" style={{
              // Gera um gradiente aleatório sutil para cada card ficar visualmente interessante
              background: `linear-gradient(135deg, #222 0%, #333 100%)`,
              borderBottom: '1px solid #333'
          }}>
            {/* Iniciais do Nome */}
            <span className="colab-avatar-placeholder">
                {colab.nome.substring(0, 2)}
            </span>
            
            {/* Bolinha de Status */}
            <div className="colab-status" style={{ backgroundColor: colab.status === 'active' ? '#28a745' : '#6c757d' }}></div>
          </div>

          {/* Informações */}
          <div className="colab-info">
            <h4>{colab.nome}</h4>
            <p>{colab.cargo}</p>
            <span className="setor">{colab.setor}</span>
          </div>

        </div>
      ))}
    </div>
  );
};

export default ColaboradoresGrid;