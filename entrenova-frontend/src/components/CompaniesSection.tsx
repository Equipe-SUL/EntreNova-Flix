// CompaniesSection.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

// Interfaces para o dado final que será exibido
interface CompanyDetails {
    nome: string;
    cnpj: string;
    plano: string; 
    totalFuncionarios: number;
    trilhasConcluidasPercentual: number; 
}

// Interfaces para os dados brutos de cada consulta
interface CompanyRaw {
    cnpj: string;
    nome: string;
    profiles: Array<{ id: string, role: string }>; 
}

interface PlanRaw {
    cnpj_empresa: string;
    plano: string;
}

const aggregateCompanyData = (companies: CompanyRaw[], plans: PlanRaw[]): CompanyDetails[] => {
    // 1. Mapeia Planos para acesso rápido por CNPJ
    const planMap = new Map<string, string>();
    plans.forEach(p => {
        planMap.set(p.cnpj_empresa, p.plano);
    });

    // 2. Mescla os dados das empresas com os planos
    return companies.map(empresa => {
        // Contagem de Funcionários ('role: funcionario')
        const totalFuncionarios = empresa.profiles
            .filter(profile => profile.role === 'funcionario')
            .length;

        // Plano Ativo (Busca no Map)
        const plano = planMap.get(empresa.cnpj) || 'N/A';
        
        // Trilhas Concluídas (PLACEHOLDER)
        const trilhasConcluidasPercentual = (totalFuncionarios > 0) ? 75 : 0; 

        return {
            nome: empresa.nome,
            cnpj: empresa.cnpj,
            plano: plano,
            totalFuncionarios: totalFuncionarios,
            trilhasConcluidasPercentual: trilhasConcluidasPercentual,
        };
    });
};

const CompaniesSection: React.FC = () => {
    const [companies, setCompanies] = useState<CompanyDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCompanies = async () => {
        setLoading(true);
        setError(null);
        try {
            // --- 1. BUSCA DE EMPRESAS E PERFIS (Funcionários) ---
            const { data: companiesData, error: companiesError } = await supabase
                .from('empresas')
                .select(`
                    cnpj,
                    nome,
                    profiles (id, role)
                `);

            if (companiesError) throw companiesError;

            // --- 2. BUSCA DOS PLANOS (Separatamente) ---
            const { data: plansData, error: plansError } = await supabase
                .from('plano_empresa')
                .select(`
                    cnpj_empresa,
                    plano
                `);
            
            if (plansError) throw plansError;
            
            // --- 3. PROCESSAMENTO E AGREGAÇÃO ---
            const processed = aggregateCompanyData(
                companiesData as CompanyRaw[], 
                plansData as PlanRaw[]
            );
            setCompanies(processed);

        } catch (err) {
            console.error("Exceção geral ao buscar dados:", err);
            setError(`Ocorreu um erro inesperado: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const renderCompanyCard = (company: CompanyDetails) => (
        <div 
            key={company.cnpj} 
            style={{ 
                border: '1px solid #333', // Borda mais sutil
                padding: '25px', 
                // margin removido para usar o gap do grid
                borderRadius: '12px', // Mais arredondado
                backgroundColor: '#1a1a1a', // Fundo Padrão Dark
                color: 'white',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)', // Sombra suave
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.3s ease, border-color 0.3s ease'
            }}
            // Adicionei um efeito simples inline de hover (opcional, via JS)
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#ff007f';
                e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '5px', color: '#fff' }}>{company.nome}</h3>
                <small style={{ color: '#888' }}>CNPJ: {company.cnpj}</small>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px', marginBottom: '25px' }}>
                <div style={{ textAlign: 'center', flex: 1, borderRight: '1px solid #333' }}>
                    <p style={{ fontSize: '2rem', fontWeight: '700', margin: '0', color: '#fff' }}>{company.totalFuncionarios}</p>
                    <small style={{ color: '#aaa', fontSize: '0.8rem' }}>Funcionários</small>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                    <p style={{ fontSize: '2rem', fontWeight: '700', margin: '0', color: '#fff' }}>{company.trilhasConcluidasPercentual}%</p>
                    <small style={{ color: '#aaa', fontSize: '0.8rem' }}>Conclusão</small>
                </div>
            </div>

            {/* Botão do Plano - Agora Rosa Neon */}
            <div style={{ 
                padding: '12px', 
                backgroundColor: '#ff007f', // ROSA NEON
                color: '#fff',
                borderRadius: '25px', // Arredondado estilo pílula
                textAlign: 'center', 
                textTransform: 'uppercase', 
                fontWeight: '700',
                letterSpacing: '1px',
                boxShadow: '0 0 15px rgba(255, 0, 127, 0.3)', // Brilho neon
                fontSize: '0.9rem'
            }}>
                {company.plano}
            </div>
        </div>
    );

    if (loading) return <p style={{ padding: '20px 0', color: '#aaa' }}>Carregando dados das empresas...</p>;
    if (error) return <p style={{ padding: '20px 0', color: '#ff6b6b' }}>Erro: {error}</p>;

    return (
        <div style={{ padding: '20px 0' }}>
            {/* Título removido pois já existe no componente pai "CompaniesAndTracksMainSection" */}
            
            {companies.length === 0 ? (
                <p style={{color: '#aaa'}}>Nenhuma empresa registrada.</p>
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', // Grid Responsivo
                    gap: '20px' 
                }}>
                    {companies.map(renderCompanyCard)}
                </div>
            )}
        </div>
    );
}

export default CompaniesSection;