// src/components/DashboardRHNavbar.tsx
import React from "react";

interface DashboardRHNavbarProps {
  activeView?: string;
  onViewChange?: (view: string) => void;
  onOpenNewCollaborator?: () => void;
  onOpenSearch?: () => void; 
}

const DashboardRHNavbar: React.FC<DashboardRHNavbarProps> = ({ activeView, onViewChange, onOpenNewCollaborator, onOpenSearch }) => {
  
  const navbarStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 2.5rem",
    marginTop: "2rem",
    marginBottom: "1rem",
    flexWrap: "wrap",
    gap: "20px"
  };

  const titleStyle: React.CSSProperties = {
    color: "#fff",
    fontSize: "2rem",
    fontWeight: "700",
    margin: 0
  };

  const subtitleStyle: React.CSSProperties = {
    color: "#888",
    fontSize: "0.9rem",
    marginTop: "5px",
    fontWeight: "400"
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "25px", 
    alignItems: "center"
  };

  // DEFINIÇÃO DO ESTILO PADRÃO (ROSA NEON)
  // Usaremos este mesmo estilo para os dois botões
  const neonButtonStyle: React.CSSProperties = {
    backgroundColor: "#ff007f",
    color: "#fff",
    border: "none",
    padding: "0 35px", // Largura interna confortável
    height: "45px",    
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 0 15px rgba(255, 0, 127, 0.4)", // O brilho neon
    display: "flex",
    alignItems: "center",
    justifyContent: "center", 
    gap: "8px", 
    whiteSpace: "nowrap",
    minWidth: "210px" // Largura mínima para ficarem parecidos
  };

  return (
    <div style={navbarStyle}>
      {/* LADO ESQUERDO */}
      <div>
        <h1 style={titleStyle}>Área do RH</h1>
        <p style={subtitleStyle}>Painel de Gestão e Performance da Empresa</p>
      </div>

      {/* LADO DIREITO */}
      <div style={buttonGroupStyle}>
        
        {/* BOTÃO DE BUSCA (AGORA IDENTICO AO DE CADASTRO) */}
        <button 
          style={neonButtonStyle}
          onClick={onOpenSearch}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span style={{fontSize: '1.1rem'}}>🔍</span> Buscar Colaborador
        </button>
        
        {/* BOTÃO NOVO COLABORADOR */}
        <button 
          style={neonButtonStyle}
          onClick={onOpenNewCollaborator}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span style={{ fontSize: '1.2rem', lineHeight: 0, marginBottom: '2px' }}>+</span> Novo Colaborador
        </button>
      </div>
    </div>
  );
};

export default DashboardRHNavbar;