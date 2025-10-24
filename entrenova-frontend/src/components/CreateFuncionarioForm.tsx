// src/components/CreateFuncionarioForm.tsx

import React, { useState } from 'react';
import { supabase } from '../services/supabase'; // Para obter o token de sessão


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CreateFuncionarioForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [full_name, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setIsError(false);

    if (!API_BASE_URL) {
      setMessage("Erro de Configuração: VITE_API_BASE_URL não está definida.");
      setIsError(true);
      setLoading(false);
      return;
    }
    
    // Obtém o token da sessão do Supabase (o RH logado)
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    if (!token) {
      setMessage("Erro: Usuário RH não autenticado. Faça login novamente.");
      setIsError(true);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/payment/admin/create-funcionario`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // Envia o token do RH logado no cabeçalho Authorization
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ email, password, full_name }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsError(true);
        // Exibe a mensagem de erro detalhada do backend (ex: 'Acesso Proibido', 'Email já existe')
        setMessage(data.message || data.details || 'Falha ao cadastrar funcionário.');
      } else {
        setIsError(false);
        setMessage(data.message || `Funcionário ${full_name} cadastrado com sucesso!`);
        // Limpa o formulário
        setEmail('');
        setPassword('');
        setFullName('');
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setIsError(true);
      setMessage("Erro de conexão com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Aplicando classes do style.css (login-card)
    <div className="login-card" style={{ maxWidth: '500px', margin: '20px 0', height: 'auto', textAlign: 'left' }}>
      
      <h2>Cadastrar Novo Colaborador</h2>
      <p>Adicione um funcionário à sua conta e atribua uma senha inicial.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '1.5em' }}>
        
        <label htmlFor="fullName">Nome Completo</label>
        <input 
          type="text" 
          id="fullName"
          value={full_name} 
          onChange={(e) => setFullName(e.target.value)} 
          placeholder="Nome Completo do Funcionário" 
          required 
        />
        
        <label htmlFor="email">Email</label>
        <input 
          type="email" 
          id="email"
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email de Acesso" 
          required 
        />
        
        <label htmlFor="password">Senha Inicial</label>
        <input 
          type="password" 
          id="password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Senha Inicial" 
          required 
        />
        
        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'Criando...' : 'Criar Conta do Funcionário'}
        </button>
      </form>
      
      {message && (
        <p style={{ 
          color: isError ? 'red' : 'green', 
          marginTop: '15px', 
          border: `1px solid ${isError ? 'red' : 'green'}`, 
          padding: '10px',
          borderRadius: '4px'
        }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default CreateFuncionarioForm;