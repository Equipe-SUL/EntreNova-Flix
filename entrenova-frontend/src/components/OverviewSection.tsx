// OverviewSection.tsx
import React from 'react';
// Importe os componentes de gráfico que já existem
import LeadsChart from "../components/LeadsChart";
import RevenueChart from "../components/RevenueChart";

// Defina as interfaces de dados (copiadas do DashboardAdmin.tsx original)
interface ChartData {
    name: string;
    quantidade: number;
}

interface RevenueData {
    month: string;
    revenue: number;
}

// 1. Defina a interface das props
interface OverviewSectionProps {
    chartData: ChartData[];
    loading: boolean;
    error: string | null;
    revenueData: RevenueData[];
    loadingRevenue: boolean;
    errorRevenue: string | null;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({
    chartData,
    loading,
    error,
    revenueData,
    loadingRevenue,
    errorRevenue,
}) => {
    return (
        <>
            {/* Seção do Gráfico de Leads */}
            <div style={{ padding: '40px', marginLeft: '20px' }}>
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
            <div style={{  padding: '40px', marginRight: '20px'  }}>
                <h2>💰 Análise Financeira</h2>
                
                {loadingRevenue && <p>Carregando dados financeiros...</p>}
                
                {errorRevenue && <p style={{ color: 'red' }}>Erro financeiro: {errorRevenue}</p>}

                {!loadingRevenue && !errorRevenue && revenueData.length > 0 && (
                    <RevenueChart data={revenueData} /> 
                )}
            </div>
        </>
    );
}

export default OverviewSection;