import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CheckoutPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [plano, setPlano] = useState('BASICO'); // Exemplo de plano
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);

        if (!API_BASE_URL) {
            setErrorMsg("Erro de configuração: VITE_API_BASE_URL não definida.");
            setLoading(false);
            return;
        }

        try {
            // 1. Enviar credenciais e plano para o backend
            const response = await fetch(`${API_BASE_URL}/payment/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, plano }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Se o backend retornou 4xx ou 5xx
                throw new Error(data.message || 'Falha no pagamento/criação da conta.');
            }

            // 2. **SUCESSO:** O backend criou a conta, processou o pagamento e retornou a sessão.
            // Injetamos a sessão no cliente Supabase para logar o usuário automaticamente.
            if (data.session) {
                await supabase.auth.setSession(data.session);
                
                // Redireciona para a área logada (ex: /dashboard, que seria a área de conteúdo)
                navigate('/dashboard'); 
            } else {
                throw new Error("Sucesso no pagamento, mas falha ao obter a sessão de login.");
            }

        } catch (error) {
            console.error("Erro no Checkout:", error);
            setErrorMsg(error instanceof Error ? error.message : "Erro desconhecido.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Escolha seu Plano e Crie sua Conta</h1>
            <form onSubmit={handleSubmit}>
                {/* Campos de Informações do Login */}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua Senha"
                    required
                />
                
                {/* Escolha do Plano (Simples) */}
                <select value={plano} onChange={(e) => setPlano(e.target.value)}>
                    <option value="BASICO">Plano Básico (R$19.90)</option>
                    <option value="PREMIUM">Plano Premium (R$49.90)</option>
                </select>

                {/* Mensagens de Erro/Loading */}
                {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
                
                <button type="submit" disabled={loading}>
                    {loading ? 'Processando...' : `Pagar e Criar Conta`}
                </button>
            </form>
          <Link to="/signin">
          <button className="login-btn">Já possui uma conta?</button>
          </Link>
        </div>
    );
};

export default CheckoutPage;