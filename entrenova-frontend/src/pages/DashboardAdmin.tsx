// DashboardAdmin.tsx
import React, { useState, useEffect, useCallback } from "react";
import Header from "../components/Header"
import AdminNavbar from "../components/DashboardAdminNavbar"
import { supabase } from '../services/supabase';

// Componentes de Seção
import OverviewSection from "../components/OverviewSection"; 
import CompaniesAndTracksMainSection from "../components/CompaniesAndTracksSection"; 


// Interfaces de Dados
interface RelatorioLead { lead: string; }
interface ChartData { name: string; quantidade: number; }
interface PlanoAtivo { plano: string; created_at: string; }
interface RevenueData { month: string; revenue: number; }

const PLAN_COSTS: { [key: string]: number } = {
    'ouro': 29.90, 'diamante': 35.99, 'esmeralda': 45.99,
};

// Funções de Processamento (Mantidas fora do componente para estabilidade)
const processRevenue = (data: PlanoAtivo[]): RevenueData[] => {
    const now = new Date();
    const monthsToAnalyze = Array.from({ length: 4 }).map((_, index) => {
        const date = new Date(now.getFullYear(), now.getMonth() + index - 1, 1);
        return date.toISOString().substring(0, 7); 
    });
    // ... (Lógica de processamento de Receita) ...
    const monthNames = monthsToAnalyze.map(monthKey => {
        const date = new Date(monthKey + '-01');
        return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
    });

    const monthlyRevenue: { [key: string]: number } = monthsToAnalyze.reduce((acc, month) => {
        acc[month] = 0;
        return acc;
    }, {} as { [key: string]: number });

    data.forEach(item => {
        const cost = PLAN_COSTS[item.plano.toLowerCase()] || 0; 
        const activationMonth = item.created_at.substring(0, 7);

        monthsToAnalyze.forEach(targetMonth => {
            if (targetMonth >= activationMonth && cost > 0) {
                monthlyRevenue[targetMonth] += cost;
            }
        });
    });

    const processedData: RevenueData[] = monthsToAnalyze.map((monthKey, index) => ({
        month: monthNames[index],
        revenue: parseFloat(monthlyRevenue[monthKey].toFixed(2)),
    }));

    return processedData;
};

const processLeads = (data: RelatorioLead[]): ChartData[] => {
    // ... (Lógica de processamento de Leads) ...
    const leadCounts: { [key: string]: number } = {};
    data.forEach(item => {
        const leadName = item.lead;
        leadCounts[leadName] = (leadCounts[leadName] || 0) + 1;
    });

    const processedData: ChartData[] = Object.keys(leadCounts).map(name => ({
        name: name,
        quantidade: leadCounts[name]
    }));
    
    return processedData;
};


const DashboardAdmin: React.FC = () => {
    // ESTADOS
    const [activeView, setActiveView] = useState<'overview' | 'companies_and_tracks'>('overview');
    
    // Estados para dados de Leads
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para dados de Receita
    const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
    const [loadingRevenue, setLoadingRevenue] = useState(true);
    const [errorRevenue, setErrorRevenue] = useState<string | null>(null);

    // ESTADO CHAVE: Flag de cache para a Visão Geral
    const [isOverviewDataFetched, setIsOverviewDataFetched] = useState(false); 


    // FUNÇÕES DE BUSCA: Envoltas em useCallback com Cache Check robusto
    
    const fetchRevenue = useCallback(async () => {
        // Se já buscou e marcou o flag, retorna imediatamente.
        if (isOverviewDataFetched) return; 

        setLoadingRevenue(true);
        setErrorRevenue(null);
        try {
            const { data, error } = await supabase
                .from('plano_empresa')
                .select('plano, created_at'); 

            if (error) {
                setErrorRevenue(error.message);
                return;
            }
            
            if (data && data.length > 0) {
                const processed = processRevenue(data as PlanoAtivo[]);
                setRevenueData(processed);
            }

        } catch (err) {
            setErrorRevenue("Ocorreu um erro inesperado ao buscar a receita.");
        } finally {
            setLoadingRevenue(false);
        }
    }, [isOverviewDataFetched]);

    const fetchLeads = useCallback(async () => {
        // Se já buscou e marcou o flag, retorna imediatamente.
        if (isOverviewDataFetched) return; 
        
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('relatorios')
                .select('lead'); 

            if (error) {
                setError(error.message);
                return;
            }
            
            if (data) {
                const processed = processLeads(data as RelatorioLead[]);
                setChartData(processed);
            }

            // MARCA O CACHE COMO SUCESSO APÓS A PRIMEIRA BUSCA
            setIsOverviewDataFetched(true); 

        } catch (err) {
            setError("Ocorreu um erro inesperado ao conectar ao banco de dados.");
        } finally {
            setLoading(false);
        }
    }, [isOverviewDataFetched]);


    // FUNÇÃO PARA MUDANÇA DE VIEW
    const handleViewChange = (view: 'overview' | 'companies_and_tracks') => {
        setActiveView(view);
    };

    // EFEITO COLATERAL: Dispara as buscas quando a view é 'overview'
    useEffect(() => {
        if (activeView === 'overview') {
            fetchLeads();
            fetchRevenue();
        }
    }, [activeView, fetchLeads, fetchRevenue]);


    // RENDERIZAÇÃO
    return(
        <>
            <Header />
            
            <AdminNavbar 
                onViewChange={handleViewChange} 
                activeView={activeView} 
            />
            
            {/* Renderização Condicional da Seção Principal */}
            {activeView === 'overview' ? (
                <OverviewSection 
                    chartData={chartData}
                    loading={loading}
                    error={error}
                    revenueData={revenueData}
                    loadingRevenue={loadingRevenue}
                    errorRevenue={errorRevenue}
                />
            ) : (
                <CompaniesAndTracksMainSection /> 
            )}
        </>
    )
}

export default DashboardAdmin