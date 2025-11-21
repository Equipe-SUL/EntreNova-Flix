// CompaniesAndTracksMainSection.tsx
import React, { useState } from 'react';

import CompaniesSection from "./CompaniesSection"; 
import TracksSection from "./TracksSection"; 

type SubView = 'companies' | 'tracks';

const CompaniesAndTracksMainSection: React.FC = () => {
    const [subView, setSubView] = useState<SubView>('companies');

    // Estilo atualizado para o padrão Neon/Dark
    const buttonStyle = (isActive: boolean) => ({
        padding: '12px 24px',
        border: 'none',
        // Se ativo, fundo levemente rosado, senão transparente
        backgroundColor: isActive ? 'rgba(255, 0, 127, 0.1)' : 'transparent', 
        color: isActive ? '#fff' : '#aaa', // Texto branco se ativo, cinza se inativo
        borderBottom: isActive ? '3px solid #ff007f' : '3px solid transparent', // Borda Rosa Neon
        fontWeight: isActive ? '600' : '400',
        fontSize: '1rem',
        cursor: 'pointer',
        marginRight: '5px',
        transition: 'all 0.3s ease',
        fontFamily: '"Poppins", sans-serif', // Garante a fonte
        borderRadius: '8px 8px 0 0', // Leve arredondamento no topo
    });

    return (
        // Ajustei o padding para alinhar com o resto do dashboard
        <div style={{ padding: '0 2.5rem', marginTop: '2.5rem' }}>
            
            {/* Título da Seção com o detalhe rosa embaixo */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#fff', margin: 0 }}>
                    Empresas e Trilhas
                </h3>
                <div style={{ width: '50px', height: '3px', backgroundColor: '#ff007f', marginTop: '4px' }}></div>
            </div>

            {/* Navegação Interna */}
            <div style={{ marginBottom: '30px', borderBottom: '1px solid #333', display: 'flex' }}>
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

            {/* Conteúdo */}
            <div>
                {subView === 'companies' && <CompaniesSection />}
                {subView === 'tracks' && <TracksSection />}
            </div>
        </div>
    );
}

export default CompaniesAndTracksMainSection;