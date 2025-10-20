// src/components/PaginaCheckout.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase'; // Certifique-se de que o caminho está correto

// Obtém o URL base da API do ambiente (VITE_API_BASE_URL)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CheckoutPage: React.FC = () => {
    // ESTADOS PARA INFORMAÇÕES DE LOGIN E CADASTRO RH
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [full_name, setFullName] = useState(''); // NOVO: Nome Completo do RH
    const [cnpj_empresa, setCnpjEmpresa] = useState(''); // NOVO: CNPJ da Empresa
    const [plano, setPlano] = useState('BASICO'); // Exemplo de plano
    
    // ESTADOS DE UI
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
            // 1. Enviar TODOS OS DADOS (credenciais, nome e CNPJ) para o backend
            const response = await fetch(`${API_BASE_URL}/payment/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email, 
                    password, 
                    plano,
                    full_name, 
                    cnpj_empresa 
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Se o backend retornou um erro (400, 409, 500, etc.)
                setErrorMsg(data.message || 'Erro desconhecido no processamento do checkout.');
                
            } else {
                // Sucesso: Inicia a sessão no cliente usando a sessão retornada pelo backend
                if (data.session) {
                    await supabase.auth.setSession(data.session);
                    // Como é um RH, redireciona para o dashboard RH
                    navigate('/dashboard/rh'); 
                } else {
                    setErrorMsg('Checkout bem-sucedido, mas falha ao obter sessão de login.');
                }
            }

        } catch (e) {
            console.error(e);
            setErrorMsg('Falha na comunicação com o servidor. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto', textAlign: 'center' }}>
            <h1>Escolha seu Plano e Crie sua Conta RH</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                
                {/* 1. Campos de Informações do Login */}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email de Acesso (RH)"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua Senha"
                    required
                />
                
                {/* 2. CAMPOS DO PERFIL RH */}
                <input
                    type="text"
                    value={full_name}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nome Completo do RH"
                    required
                />
                <input
                    type="text"
                    value={cnpj_empresa}
                    onChange={(e) => setCnpjEmpresa(e.target.value)}
                    placeholder="CNPJ da Empresa"
                    required
                />
                
                {/* 3. Escolha do Plano (Simples) */}
                <select value={plano} onChange={(e) => setPlano(e.target.value)} style={{ padding: '10px' }}>
                    <option value="BASICO">Plano Básico (R$19.90)</option>
                    <option value="PREMIUM">Plano Premium (R$49.90)</option>
                </select>

                {/* Mensagens de Erro/Loading */}
                {errorMsg && <p style={{ color: 'red', margin: '5px 0' }}>{errorMsg}</p>}
                
                <button type="submit" disabled={loading} style={{ padding: '10px 15px', marginTop: '10px' }}>
                    {loading ? 'Processando...' : `Pagar e Criar Conta`}
                </button>
            </form>
            
          <Link to="/signin">
          <button className="login-btn" style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', marginTop: '10px' }}>
            Já possui uma conta?
          </button>
          </Link>
        </div>
    );
};

export default CheckoutPage;