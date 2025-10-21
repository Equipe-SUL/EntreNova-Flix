
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom'; 
import '../styles/SignIn.css'; 

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // 1. Tenta fazer login no Supabase (Autenticação)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      // Login falhou (credenciais erradas)
      setMessage('Login falhou. Credenciais inválidas ou conta não existe.');
      
    } else if (data.session && data.user) {
      
      // 2. Login bem-sucedido. Realiza a query na tabela public.profiles para obter a role.
      const userId = data.user.id;
      
      // REALIZANDO A QUERY NA TABELA public.profiles
      // Busca a role e armazena os dados em 'profileData' (que o usuário solicitou armazenar em uma variável data)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role') // Apenas o campo role é necessário
        .eq('id', userId)
        .single(); // Espera apenas uma linha
        
      if (profileError || !profileData) {
        // Se houver erro na busca ou se o perfil não for encontrado (ex: Trigger falhou)
        console.error('Erro ao buscar perfil:', profileError);
        setMessage('Erro de autorização: Perfil de usuário não encontrado no banco de dados. Tente novamente.');
        await supabase.auth.signOut(); // Desloga o usuário para segurança
        return;
      }
      
      // 3. Redirecionamento baseado na role ENCONTRADA no banco de dados
      const role = profileData.role; 

      if (role === 'rh') {
          navigate('/dashboard/rh');
      } else if (role === 'funcionario') {
          navigate('/dashboard/funcionario');
      } else {
          setMessage(`Sua conta tem um papel de usuário inválido: ${role}.`);
          await supabase.auth.signOut();
      }
    }
  };
   
  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSignIn}>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
          required 
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Senha" 
          required 
          style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '10px 15px' }}>
          {loading ? 'Entrando...' : 'Login'}
        </button>
      </form>
      {message && <p style={{ color: message.includes('falhou') || message.includes('autorização') ? 'red' : 'green', marginTop: '10px' }}>{message}</p>}
    </div>
  );
};

export default SignIn;