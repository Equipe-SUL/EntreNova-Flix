import React, { useState } from 'react';
import { Plano } from '../types/types.pagamento';
import '../styles/Checkout.css';

// Mapeamento dos planos com limites de trilhas
const PLAN_DETAILS: Record<Plano, { titulo: string; precoMensal: string; quantTrilhas: string; totalAnual: string; limitTrilhas: number }> = {
    OURO: {
        titulo: 'Ouro',
        precoMensal: '29,90',
        quantTrilhas: '7',
        totalAnual: '358,80',
        limitTrilhas: 7,
    },
    DIAMANTE: {
        titulo: 'Diamante',
        precoMensal: '35,99',
        quantTrilhas: '10',
        totalAnual: '431,88',
        limitTrilhas: 10,
    },
    ESMERALDA: {
        titulo: 'Esmeralda',
        precoMensal: '45,99',
        quantTrilhas: 'Todas as 13',
        totalAnual: '551,88',
        limitTrilhas: 13, // Assume que o máximo é 13
    },
};

// Interface atualizada para aceitar 'trilhasDisponiveis'
interface PlanSelectionProps {
    plano: Plano;
    setPlano: (plano: Plano) => void;
    onNext: () => void;
    trilhasDisponiveis: string[]; // <--- AQUI ESTÁ A MÁGICA QUE FALTAVA!
}

const PlanSelection: React.FC<PlanSelectionProps> = ({ plano, setPlano, onNext, trilhasDisponiveis }) => {
    
    // Estados para o Modal
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState<{titulo: string, trilhas: string[]} | null>(null);

    const handlePlanSelectAndNext = (selectedPlano: Plano) => {
        setPlano(selectedPlano);
        onNext();
    };

    // Lógica para abrir o Modal e filtrar as trilhas
    const handleVerTrilhas = (e: React.MouseEvent, planDetails: typeof PLAN_DETAILS[Plano]) => {
        e.preventDefault();
        e.stopPropagation();

        // Pega apenas a quantidade de trilhas permitida pelo plano
        // Se trilhasDisponiveis estiver vazio (erro no load), mostra mensagem amigável
        const trilhasParaExibir = trilhasDisponiveis.length > 0 
            ? trilhasDisponiveis.slice(0, planDetails.limitTrilhas)
            : ["Nenhuma trilha carregada para este CNPJ."];
        
        setModalContent({
            titulo: `Trilhas do Plano ${planDetails.titulo}`,
            trilhas: trilhasParaExibir
        });
        setShowModal(true);
    };

    // Array auxiliar para renderizar os cards
    const plans: { key: Plano, details: typeof PLAN_DETAILS[Plano] }[] = [
        { key: 'OURO', details: PLAN_DETAILS.OURO },
        { key: 'DIAMANTE', details: PLAN_DETAILS.DIAMANTE },
        { key: 'ESMERALDA', details: PLAN_DETAILS.ESMERALDA },
    ];

    // Estilos inline básicos para o Modal (pode mover para o CSS se preferir)
    const modalOverlayStyle: React.CSSProperties = {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(5px)'
    };
    const modalBoxStyle: React.CSSProperties = {
        backgroundColor: '#1a1a1a', padding: '30px', borderRadius: '12px',
        maxWidth: '500px', width: '90%', maxHeight: '80vh', overflowY: 'auto',
        border: '1px solid #ff007f', color: '#fff', position: 'relative',
        boxShadow: '0 0 20px rgba(255, 0, 127, 0.3)'
    };

    return (
        <div className="pagina">
            <h2 id='h2planos'>1. Selecione seu Plano</h2>
            
            <section className="planos-container">
                {plans.map(({ key, details }) => (
                    <div 
                        key={key} 
                        className={`plano ${plano === key ? 'selecionado' : ''}`}
                        onClick={() => setPlano(key)}
                    >
                        <h2 className="titulo"><span>{details.titulo}</span></h2>
                        <h3 className="plano-tipo">Plano Anual</h3>
                        <p className="preco"><span>12x</span> R$ <strong>{details.precoMensal}</strong></p>
                        <p className="total">Total de R$ {details.totalAnual}</p>
                        <p>Acesso a {details.quantTrilhas}</p>
                        
                        <button onClick={() => handlePlanSelectAndNext(key)}>
                            {plano === key ? 'Continuar' : 'Quero esse!'}
                        </button>

                        {/* Botão "Ver trilhas" que abre o Modal */}
                        <button 
                            className="detalhes" 
                            style={{ background: 'none', border: 'none', color: '#fff', textDecoration: 'underline', marginTop: '10px', fontSize: '0.9em', width: 'auto', cursor: 'pointer' }}
                            onClick={(e) => handleVerTrilhas(e, details)}
                        >
                            Ver trilhas disponíveis
                        </button>
                    </div>
                ))}
            </section>

            {/* O Modal */}
            {showModal && modalContent && (
                <div style={modalOverlayStyle} onClick={() => setShowModal(false)}>
                    <div style={modalBoxStyle} onClick={(e) => e.stopPropagation()}>
                        <button 
                            onClick={() => setShowModal(false)}
                            style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#888', fontSize: '1.5rem', cursor: 'pointer', padding: 0, width: 'auto' }}
                        >
                            ×
                        </button>
                        <h3 style={{ color: '#ff007f', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                            {modalContent.titulo}
                        </h3>
                        <ul style={{ textAlign: 'left', paddingLeft: '20px', marginTop: '20px' }}>
                            {modalContent.trilhas.map((t, index) => (
                                <li key={index} style={{ marginBottom: '10px', fontSize: '0.95rem', color: '#ccc' }}>
                                    {t}
                                </li>
                            ))}
                        </ul>
                        <div style={{ marginTop: '30px', textAlign: 'center' }}>
                            <button onClick={() => setShowModal(false)} style={{ width: '100%' }}>Fechar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanSelection;