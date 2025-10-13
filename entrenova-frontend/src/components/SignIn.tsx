import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom'; 

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

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      // Lógica crucial: Trata e-mail não confirmado
      if (error.message.includes('Email not confirmed')) {
        setMessage('O email precisa ser confirmado. Verifique sua caixa de entrada.');
      } else {
        setMessage('Login falhou. Credenciais inválidas.');
      }
    } else if (data.session) {
      // Login bem-sucedido: Redireciona para a página de pagamento protegida
      navigate('/dashboard');
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
      {message && <p style={{ color: message.includes('falhou') || message.includes('negado') ? 'red' : 'green', marginTop: '15px' }}>{message}</p>}
      
      {/* Exemplo de link para o sign up */}
      <p style={{ marginTop: '20px' }}>
        Não tem uma conta? <a href="/checkout">Registre-se aqui</a>
      </p>
    </div>
  );
}

export default SignIn;