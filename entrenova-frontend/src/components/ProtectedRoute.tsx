import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase'; // Certifique-se de que o caminho está correto

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[]; // Recebe a lista de roles permitidas
}

/**
 * Componente Wrapper para proteger rotas.
 * Verifica a sessão do Supabase E a Role (RBAC) de forma assíncrona.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => { 
    const [session, setSession] = useState<any>(null);
    // O estado 'loading' garante que nada seja renderizado/redirecionado antes da conclusão
    const [loading, setLoading] = useState(true); 
    const [userRole, setUserRole] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        let isCancelled = false; // Flag para evitar atualizações de estado em componente desmontado
        
        // Função unificada para verificar a autenticação e a Role
        const checkAuthAndRole = async (s: any | null) => {
            // Obtém a sessão do listener (s) ou busca a sessão inicial
            const currentSession = s || (await supabase.auth.getSession()).data.session;
            
            if (isCancelled) return;
            
            if (currentSession) {
                setSession(currentSession);
                
                // 1. Busca a ROLE do perfil do usuário no Supabase
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('role') 
                    .eq('id', currentSession.user.id)
                    .single();
                
                if (isCancelled) return;

                if (profileData && !profileError) {
                    // SUCESSO: Role encontrada e definida
                    setUserRole(profileData.role);
                } else {
                    // FALHA: Falhou a busca da role (Provável RLS)
                    console.error('ERRO: Falha ao buscar a role. Verifique RLS e se o perfil existe.', profileError);
                    setUserRole(null);
                    setSession(null); // Trata como falha de autenticação
                }
            } else {
                // FALHA: Nenhuma sessão encontrada
                setSession(null);
                setUserRole(null);
            }
            
            // GARANTE que o loading seja desligado APÓS todas as verificações
            if (!isCancelled) {
                setLoading(false);
            }
        };

        // Roda a verificação inicial ao montar
        checkAuthAndRole(null);
        
        // Listener para garantir que login/logout sejam tratados em tempo real
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                // Ao fazer login, re-executa a lógica completa de espera
                if (_event === 'SIGNED_IN') {
                    setLoading(true); // Liga o loading novamente
                    checkAuthAndRole(session);
                } else if (_event === 'SIGNED_OUT') {
                    // Ao deslogar, limpa os estados e desliga o loading
                    setSession(null);
                    setUserRole(null);
                    setLoading(false); 
                }
            }
        );

        // Função de limpeza
        return () => {
            isCancelled = true;
            authListener?.subscription.unsubscribe();
        };
    }, []);

    // ----------------------------------------------------
    // Lógica de Renderização que AGUARDA o carregamento
    // ----------------------------------------------------

    // 1. Enquanto o estado de 'loading' for verdadeiro, mostra a mensagem de espera
    if (loading) {
        return (
            <div style={{ padding: '50px', textAlign: 'center' }}>
                Verificando autenticação e permissões...
            </div>
        );
    }
    
    // 2. Se não há sessão OU a role não foi carregada (mesmo após a espera), redireciona para o login
    if (!session || !userRole) {
        // Usa `location.pathname` para que o usuário possa ser redirecionado de volta depois
        return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
    }

    // 3. VERIFICAÇÃO FINAL DA ROLE (RBAC)
    // Se logado E a role está na lista de permitidas, renderiza o componente filho
    if (allowedRoles.includes(userRole)) {
        return <>{children}</>;
    }
    
    // 4. Se logado, mas com função incorreta: redireciona para o dashboard correto
    const redirectTo = userRole === 'admin' 
    ? '/dashboard/admin' 
    : userRole === 'rh' 
        ? '/dashboard/rh' 
        : '/dashboard/funcionario';
    
    // Redireciona para o dashboard correto do usuário, pois ele tentou acessar a rota errada.
    return <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;