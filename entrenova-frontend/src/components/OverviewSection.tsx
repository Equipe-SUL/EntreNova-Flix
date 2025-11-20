// OverviewSection.tsx
import React from 'react';
// Importe os componentes de gráfico que já existem
import LeadsChart from "../components/LeadsChart";
import RevenueChart from "../components/RevenueChart";
import '../styles/DashboardAdmin.css'

// Importar a interface (Ajuste o caminho se DashboardAdmin.tsx não estiver em '../pages/')
import { HighlightsData } from '../pages/DashboardAdmin'; 

// Defina as interfaces de dados 
interface ChartData {
    name: string;
    quantidade: number;
}

interface RevenueData {
    month: string;
    revenue: number;
}

// 1. Defina a interface das props (Adicionando as novas props)
interface OverviewSectionProps {
    chartData: ChartData[];
    loading: boolean;
    error: string | null;
    revenueData: RevenueData[];
    loadingRevenue: boolean;
    errorRevenue: string | null;
    // Novas props para Highlights
    highlightsData: HighlightsData | null;
    loadingHighlights: boolean;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({
    chartData,
    loading,
    error,
    revenueData,
    loadingRevenue,
    errorRevenue,
    highlightsData,
    loadingHighlights,
}) => {
    return (
        <>
        <section className='graficos-admin'>
             {/* Seção do Gráfico de Leads */}
            <div className='grafico'>
                {loading && <p>Carregando dados de leads...</p>}
                
                {error && <p style={{ color: 'red' }}>Erro: {error}</p>}

                {!loading && !error && chartData.length === 0 && (
                    <p>Nenhum dado de lead encontrado.</p>
                )}
                
                {!loading && !error && chartData.length > 0 && (
                    <LeadsChart data={chartData} />
                )}
            </div>

            {/* Seção do Gráfico Financeiro */}
            <div className='grafico'>
                
                {loadingRevenue && <p>Carregando dados financeiros...</p>}
                
                {errorRevenue && <p style={{ color: 'red' }}>Erro financeiro: {errorRevenue}</p>}

                {!loadingRevenue && !errorRevenue && revenueData.length > 0 && (
                    <RevenueChart data={revenueData} /> 
                )}
            </div>
        </section>

        {/* NOVA SEÇÃO HIGHLIGHTS */}
        <section className='Highlights-container'>
            <div className="highlights-header">
                <h3>Highlights <span style={{color: '#ff007f'}}>★</span></h3>
                <p>Veja o resumo das suas conquistas até então.</p>
            </div>

            {loadingHighlights ? (
                <p>Carregando highlights...</p>
            ) : (
                <div className="highlights-grid">
                    {/* CARD 1: Empresas (Empresas com plano / Empresas totais) */}
                    <div className="highlight-card">
                        <h2>
                            {highlightsData?.empresasAtivas} <span style={{fontSize: '0.6em', opacity: 0.7}}>/ {highlightsData?.totalEmpresas}</span>
                        </h2>
                        <p>Empresas registradas</p>
                        <span className="star-icon">★</span>
                    </div>

                    {/* CARD 2: Plano Mais Escolhido (Real) */}
                    <div className="highlight-card">
                        <h2 style={{textTransform: 'capitalize'}}>{highlightsData?.planoMaisPopular}</h2>
                        <p>Plano mais escolhido</p>
                        <span className="star-icon">★</span>
                    </div>

                    {/* CARD 3: Trilhas Assistidas (Fictício) */}
                    <div className="highlight-card">
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
                            <h2>{highlightsData?.trilhasConcluidas}</h2>
                        </div>
                        <p>Trilhas assistidas</p>
                        <span className="star-icon">★</span>
                    </div>

                    {/* CARD 4: Trilha Mais Aplicada (Fictício - Largo) */}
                    <div className="highlight-card wide-card">
                        <div className="track-info">
                            <h4>Trilha mais aplicada <span style={{color: '#ff007f'}}>★</span></h4>
                            <p className="track-name">{highlightsData?.topTrilha.nome}</p>
                            <div className="track-meta">
                                <span>🔊 {highlightsData?.topTrilha.categoria}</span>
                                <span style={{marginLeft: '15px'}}>🕒 {highlightsData?.topTrilha.tempo}</span>
                            </div>
                        </div>
                        
                        <div className="track-stats">
                            <div className="stat-circle">
                                <div className="circle-content">{highlightsData?.topTrilha.vezesAplicada}</div>
                                <span>Vezes aplicada</span>
                            </div>
                            <div className="stat-separator"></div>
                            <div className="stat-circle">
                                <div className="circle-content">{highlightsData?.topTrilha.vezesAssistida}</div>
                                <span>Vezes assistida</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
           
        </>
    );
}

export default OverviewSection;