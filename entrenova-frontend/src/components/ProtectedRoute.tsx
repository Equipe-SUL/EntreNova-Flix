import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../services/supabase'; // Certifique-se de que o caminho está correto

/**
 * Componente Wrapper para proteger rotas.
 * Verifica a sessão do Supabase:
 * - Se logado, renderiza o componente filho (children).
 * - Se não logado ou sessão expirada, redireciona para /signin.
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Estado para armazenar a sessão
    const [session, setSession] = useState<any>(null);
    // Estado para indicar se a verificação inicial terminou
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Verifica o estado inicial da sessão
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // 2. Ouve mudanças na sessão (login, logout, refresh de token)
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
                // Garante que o loading seja desligado mesmo após o estado inicial
                if (loading) setLoading(false);
            }
        );

        // Cleanup: remove o listener ao desmontar o componente
        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []); // O array vazio garante que o useEffect rode apenas uma vez (na montagem)

    // Enquanto verifica a sessão (após o carregamento inicial da página)
    if (loading) {
        return (
            <div style={{ padding: '50px', textAlign: 'center' }}>
                Verificando autenticação...
            </div>
        );
    }
    
    // Se houver sessão (o usuário está logado), renderiza o componente filho
    if (session) {
        return <>{children}</>;
    }

    // Se não houver sessão, redireciona para a página de login
    return <Navigate to="/signin" replace />;
};

export default ProtectedRoute;