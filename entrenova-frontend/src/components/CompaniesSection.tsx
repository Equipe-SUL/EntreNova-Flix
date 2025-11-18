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
            setError(`Ocorreu um erro inesperado ao buscar os dados das empresas: ${err instanceof Error ? err.message : String(err)}`);
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
                border: '1px solid #444', 
                padding: '20px', 
                margin: '10px', 
                borderRadius: '8px',
                width: '300px',
                backgroundColor: '#222',
                color: 'white'
            }}
        >
            <h3>{company.nome}</h3>
            <small>CNPJ: {company.cnpj}</small>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                <div style={{ textAlign: 'center', flex: 1, borderRight: '1px solid #555' }}>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{company.totalFuncionarios}</p>
                    <small>Funcionários cadastrados</small>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{company.trilhasConcluidasPercentual}%</p>
                    <small>Trilhas concluídas</small>
                </div>
            </div>
            <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#8a2be2', borderRadius: '4px', textAlign: 'center', textTransform: 'uppercase', fontWeight: 'bold' }}>
                {company.plano}
            </div>
        </div>
    );

    if (loading) return <p style={{ padding: '20px 0' }}>Carregando dados das empresas...</p>;
    if (error) return <p style={{ padding: '20px 0', color: 'red' }}>Erro: {error}</p>;

    return (
        <div style={{ padding: '20px 0' }}>
            <h3>Lista de Empresas</h3>
            
            {companies.length === 0 ? (
                <p>Nenhuma empresa registrada.</p>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                    {companies.map(renderCompanyCard)}
                </div>
            )}
        </div>
    );
}

export default CompaniesSection;