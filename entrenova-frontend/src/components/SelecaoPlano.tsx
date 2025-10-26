import React from 'react';
import { Plano } from '../types/types.pagamento';
import '../styles/Checkout.css'

// Mapeamento dos planos lógicos para os nomes e valores visuais
const PLAN_DETAILS: Record<Plano, { titulo: string; precoMensal: string; quantTrilhas: string; totalAnual: string; }> = {
    BASICO: { // Corresponde a 'Ouro'
        titulo: 'Ouro',
        precoMensal: '29,90',
        quantTrilhas: '7',
        totalAnual: '358,80',
    },
    INTERMEDIARIO: { // Corresponde a 'Diamante'
        titulo: 'Diamante',
        precoMensal: '35,99',
        quantTrilhas: '10',
        totalAnual: '431,88',
    },
    PREMIUM: { // Corresponde a 'Esmeralda'
        titulo: 'Esmeralda',
        precoMensal: '45,99',
        quantTrilhas: '13',
        totalAnual: '551,88',
    },
};

interface PlanSelectionProps {
    plano: Plano; // Plano atualmente selecionado ('BASICO' | 'INTERMEDIARIO' | 'PREMIUM')
    setPlano: (plano: Plano) => void;
    onNext: () => void;
}

const PlanSelection: React.FC<PlanSelectionProps> = ({ plano, setPlano, onNext }) => {
    
    // Função auxiliar para configurar o plano e avançar
    const handlePlanSelectAndNext = (selectedPlano: Plano) => {
        setPlano(selectedPlano);
        onNext();
    };

    // Array de planos para facilitar a renderização
    const plans: { key: Plano, details: typeof PLAN_DETAILS[Plano] }[] = [
        { key: 'BASICO', details: PLAN_DETAILS.BASICO },
        { key: 'INTERMEDIARIO', details: PLAN_DETAILS.INTERMEDIARIO },
        { key: 'PREMIUM', details: PLAN_DETAILS.PREMIUM },
    ];

    return (
        <div className="pagina">
            <h2 id='h2planos' >1. Selecione seu Plano</h2>
            
            <section className="planos-container">
                {plans.map(({ key, details }) => (
                    // Adicionando a classe 'selecionado' para o plano ativo
                    // O estilo dessa classe deve ser definido no seu CSS global
                    <div 
                        key={key} 
                        className={`plano ${plano === key ? 'selecionado' : ''}`}
                        // Opção: O card inteiro pode ser clicável para setar o plano
                        onClick={() => setPlano(key)}
                    >
                        {/* Estrutura HTML/Classes enviadas pelo usuário */}
                        <h2 className="titulo"><span>{details.titulo}</span></h2>
                        <h3 className="plano-tipo">Plano Anual</h3>
                        <p className="preco"><span>12x</span> R$ <strong>{details.precoMensal}</strong></p>
                        <p className="total">Total de R$ {details.totalAnual}</p>
                        <p>Tendo disponiveis {details.quantTrilhas} trilhas</p>
                        <button 
                            onClick={() => handlePlanSelectAndNext(key)}
                        >
                            {/* O texto do botão muda se for o plano atualmente selecionado para indicar o avanço */}
                            {plano === key ? 'Continuar' : 'Quero esse!'}
                        </button>
                        <a href="#" className="detalhes">Mais detalhes</a>
                        {/* Fim da Estrutura HTML/Classes */}
                    </div>
                ))}
            </section>
        </div>
    );
};

export default PlanSelection;