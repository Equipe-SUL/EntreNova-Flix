// CompaniesAndTracksMainSection.tsx
import React, { useState } from 'react';

// Importa os componentes das sub-seções
// OBS: Você precisará criar estes arquivos: CompaniesSection.tsx e TracksSection.tsx
import CompaniesSection from "./CompaniesSection"; 
import TracksSection from "./TracksSection"; 

// Define as opções de sub-visualização
type SubView = 'companies' | 'tracks';

const CompaniesAndTracksMainSection: React.FC = () => {
    // Estado interno para alternar entre "Empresas" e "Trilhas"
    const [subView, setSubView] = useState<SubView>('companies');

    // Estilo simples para os botões de navegação interna
    const buttonStyle = (isActive: boolean) => ({
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px 4px 0 0',
        cursor: 'pointer',
        marginRight: '5px',
        backgroundColor: isActive ? '#333' : '#555',
        color: 'white',
        borderBottom: isActive ? '3px solid #8a2be2' : '3px solid transparent',
        fontWeight: isActive ? 'bold' : 'normal',
        transition: 'all 0.2s',
    });

    return (
        <div style={{ padding: '40px 20px' }}>
            <h2>Empresas e Trilhas</h2>

            {/* Navegação Interna */}
            <div style={{ marginBottom: '20px', borderBottom: '1px solid #444' }}>
                <button 
                    style={buttonStyle(subView === 'companies')} 
                    onClick={() => setSubView('companies')}
                >
                    Lista de Empresas
                </button>
                <button 
                    style={buttonStyle(subView === 'tracks')} 
                    onClick={() => setSubView('tracks')}
                >
                    Gerenciar Trilhas
                </button>
            </div>

            {/* Renderização Condicional do Conteúdo da Sub-seção */}
            {subView === 'companies' && (
                <CompaniesSection />
            )}

            {subView === 'tracks' && (
                <TracksSection />
            )}
        </div>
    );
}

export default CompaniesAndTracksMainSection;