// src/components/ColaboradoresGrid.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface Colaborador {
  id: string;
  nome: string;
  email: string;
  status: 'active' | 'inactive';
}

const ColaboradoresGrid: React.FC = () => {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColaboradores = async () => {
      try {
        // Busca a sessão do usuário RH
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.error('Usuário não autenticado');
          setLoading(false);
          return;
        }

        // Busca o perfil do RH para obter o CNPJ
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('cnpj_empresa')
          .eq('id', session.user.id)
          .single();

        if (profileError || !profile?.cnpj_empresa) {
          console.error('Erro ao buscar perfil ou CNPJ não encontrado:', profileError);
          setLoading(false);
          return;
        }

        // Busca os funcionários da empresa na tabela profiles
        // Filtra por role = 'funcionario' e cnpj_empresa igual ao do RH
        const { data: funcionariosData, error: funcionariosError } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .eq('role', 'funcionario')
          .eq('cnpj_empresa', profile.cnpj_empresa)
          .order('full_name', { ascending: true });

        if (funcionariosError) {
          console.error('Erro ao buscar funcionários:', funcionariosError);
          setLoading(false);
          return;
        }

        if (funcionariosData && funcionariosData.length > 0) {
          // Transforma os dados do banco em formato de colaboradores
          const colaboradoresFormatados: Colaborador[] = funcionariosData.map((func) => ({
            id: func.id,
            nome: func.full_name || 'Sem nome',
            email: func.email || '',
            status: 'active' // Por padrão, todos os funcionários estão ativos
          }));

          setColaboradores(colaboradoresFormatados);
        } else {
          setColaboradores([]);
        }
      } catch (error) {
        console.error('Erro ao carregar colaboradores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchColaboradores();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', color: '#fff', textAlign: 'center' }}>
        Carregando colaboradores...
      </div>
    );
  }

  if (colaboradores.length === 0) {
    return (
      <div style={{ padding: '20px', color: '#888', textAlign: 'center' }}>
        Nenhum colaborador cadastrado ainda
      </div>
    );
  }

  return (
    <div className="colaboradores-grid">
      {colaboradores.map((colab) => (
        <div key={colab.id} className="colab-card">
          
          {/* Área Visual (Avatar/Topo) */}
          <div className="colab-avatar-box" style={{
              background: `linear-gradient(135deg, #222 0%, #333 100%)`,
              borderBottom: '1px solid #333'
          }}>
            {/* Iniciais do Nome */}
            <span className="colab-avatar-placeholder">
                {colab.nome.substring(0, 2).toUpperCase()}
            </span>
            
            {/* Bolinha de Status */}
            <div className="colab-status" style={{ backgroundColor: colab.status === 'active' ? '#28a745' : '#6c757d' }}></div>
          </div>

          {/* Informações */}
          <div className="colab-info">
            <h4>{colab.nome}</h4>
            <p>{colab.email}</p>
            <span className="setor">Funcionário</span>
          </div>

        </div>
      ))}
    </div>
  );
};

export default ColaboradoresGrid;