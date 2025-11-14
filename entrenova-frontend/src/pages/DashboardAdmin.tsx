import React, { useState, useEffect } from "react";
import Header from "../components/Header"
import AdminNavbar from "../components/DashboardAdminNavbar"
import { supabase } from '../services/supabase';
import LeadsChart from "../components/LeadsChart";
import RevenueChart from "../components/RevenueChart";


interface RelatorioLead {
    lead: string; // Ou o tipo correto da coluna 'lead'
}

interface ChartData {
    name: string;
    quantidade: number;
}

interface PlanoAtivo {
    plano: string;
    created_at: string; // Usaremos isto como data de ativação/primeiro pagamento
}

// Interface para os dados do gráfico de linha
interface RevenueData {
    month: string;
    revenue: number;
}

const PLAN_COSTS: { [key: string]: number } = {
    'ouro': 29.90,
    'diamante': 35.99,
    'esmeralda': 45.99,
};

const DashboardAdmin: React.FC = () => {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para definir a receita
    const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
    const [loadingRevenue, setLoadingRevenue] = useState(true);
    const [errorRevenue, setErrorRevenue] = useState<string | null>(null);

    const processRevenue = (data: PlanoAtivo[]): RevenueData[] => {
        const now = new Date();
        // Define o intervalo de meses (M-1, M, M+1, M+2)
        const monthsToAnalyze = Array.from({ length: 4 }).map((_, index) => {
            const date = new Date(now.getFullYear(), now.getMonth() + index - 1, 1);
            return date.toISOString().substring(0, 7); // Formato YYYY-MM
        });

        // Mapeia o nome completo do mês para o eixo X do gráfico
        const monthNames = monthsToAnalyze.map(monthKey => {
            const date = new Date(monthKey + '-01');
            return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
        });

        // 1. Inicializa o contador de receita mensal
        const monthlyRevenue: { [key: string]: number } = monthsToAnalyze.reduce((acc, month) => {
            acc[month] = 0;
            return acc;
        }, {} as { [key: string]: number });

        // 2. Calcula a receita gerada em cada mês analisado
        data.forEach(item => {
            const cost = PLAN_COSTS[item.plano.toLowerCase()] || 0; // Custo do plano
            const activationMonth = item.created_at.substring(0, 7);

            monthsToAnalyze.forEach(targetMonth => {
                // Simula que o plano gera receita se já estiver ativo no mês alvo
                if (targetMonth >= activationMonth && cost > 0) {
                    monthlyRevenue[targetMonth] += cost;
                }
            });
        });

        // 3. Formata para o gráfico
        const processedData: RevenueData[] = monthsToAnalyze.map((monthKey, index) => ({
            month: monthNames[index],
            revenue: parseFloat(monthlyRevenue[monthKey].toFixed(2)),
        }));

        return processedData;
    };

    const processLeads = (data: RelatorioLead[]): ChartData[] => {
        const leadCounts: { [key: string]: number } = {};

        // 1. Contar cada lead
        data.forEach(item => {
            const leadName = item.lead;
            leadCounts[leadName] = (leadCounts[leadName] || 0) + 1;
        });

        // 2. Montar o array de objetos no formato { name: '...', quantidade: X }
        const processedData: ChartData[] = Object.keys(leadCounts).map(name => ({
            name: name,
            quantidade: leadCounts[name]
        }));
        
        return processedData;
    };

    const fetchRevenue = async () => {
        setLoadingRevenue(true);
        setErrorRevenue(null);
        try {
            const { data, error } = await supabase
                .from('plano_empresa')
                .select('plano, created_at'); 

            if (error) {
                console.error("Erro ao buscar planos:", error);
                setErrorRevenue(error.message);
                return;
            }
            
            if (data && data.length > 0) {
                const processed = processRevenue(data as PlanoAtivo[]);
                setRevenueData(processed);
            }

        } catch (err) {
            console.error("Exceção ao buscar planos:", err);
            setErrorRevenue("Ocorreu um erro inesperado ao buscar a receita.");
        } finally {
            setLoadingRevenue(false);
        }
    };

    // Função para buscar os dados no Supabase
    const fetchLeads = async () => {
        setLoading(true);
        setError(null);
        try {
            // Requisição para buscar a coluna 'lead' da tabela 'relatorios'
            const { data, error } = await supabase
                .from('relatorios')
                .select('lead'); // Puxa apenas a coluna 'lead'

            if (error) {
                console.error("Erro ao buscar leads:", error);
                setError(error.message);
                return;
            }
            
            if (data) {
                // Processa os dados
                const processed = processLeads(data as RelatorioLead[]);
                setChartData(processed);
            }

        } catch (err) {
            console.error("Exceção ao buscar leads:", err);
            setError("Ocorreu um erro inesperado ao conectar ao banco de dados.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
        fetchRevenue();
    }, []);
    return(
        <>
        <Header />
        <AdminNavbar />
        <div style={{ padding: '40px', marginLeft: '20px' }}>
                {loading && <p>Carregando dados de leads...</p>}
                
                {error && <p style={{ color: 'red' }}>Erro: {error}</p>}

                {!loading && !error && chartData.length === 0 && (
                    <p>Nenhum dado de lead encontrado.</p>
                )}
                
                {!loading && !error && chartData.length > 0 && (
                    // Inserir o componente do gráfico aqui
                    // O LeadsChart será responsável por renderizar o gráfico
                    <LeadsChart data={chartData} />
                )}
            </div>
            <div style={{  padding: '40px', marginRight: '20px'  }}>
                <h2>💰 Análise Financeira</h2>
                
                {loadingRevenue && <p>Carregando dados financeiros...</p>}
                
                {errorRevenue && <p style={{ color: 'red' }}>Erro financeiro: {errorRevenue}</p>}

                {!loadingRevenue && !errorRevenue && revenueData.length > 0 && (
                    <RevenueChart data={revenueData} /> 
                )}
            </div>
        </>
    )
}

export default DashboardAdmin