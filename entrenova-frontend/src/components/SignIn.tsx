// src/pages/SignIn.tsx
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';

// 1. IMPORTAÇÕES DE ESTILO (NÃO IMPORTA MAIS O HEADER)
import '../styles/signin.css'; 
// import Header from '../components/Header'; // <-- REMOVIDO

const SignIn: React.FC = () => {
  // Lógica de estado e navegação (sem alterações)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Função handleSignIn (sem alterações na lógica)
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage('Login falhou. Credenciais inválidas ou conta não existe.');
    } else if (data.session && data.user) {
      const userId = data.user.id;
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
        
      if (profileError || !profileData) {
        console.error('Erro ao buscar perfil:', profileError);
        setMessage('Erro de autorização: Perfil de usuário não encontrado.');
        await supabase.auth.signOut();
        return;
      }
      
      const role = profileData.role; 
      if (role === 'rh') {
        navigate('/dashboard/rh');
      } else if (role === 'funcionario') {
        navigate('/dashboard/funcionario');
      } else if (role === 'admin') {
        navigate('/dashboard/admin');
      }
       else {
        setMessage(`Sua conta tem um papel de usuário inválido: ${role}.`);
        await supabase.auth.signOut();
      }
    }
  };

  return (
    // 2. O FRAGMENT <> E O <Header /> FORAM REMOVIDOS
    // O <main> agora é o elemento raiz do componente
    <main className="contender">
      <div className="cartao-login">
        
        <h2>Login</h2>
        <p>Insira as credenciais fornecidas pelo seu RH.</p>

        <form onSubmit={handleSignIn}>
          <label htmlFor="email">E-mail</label>
          <input 
            type="email" 
            id="email" 
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="senha">Senha</label>
          <input 
            type="password" 
            id="senha" 
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />

          <a href="#" className="forgot">Esqueci minha senha.</a>

          {message && (
            <p 
              className="login-message"
              style={{ 
                color: message.includes('falhou') || message.includes('Erro') ? 'red' : 'green' 
              }}
            >
              {message}
            </p>
          )}

          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default SignIn;