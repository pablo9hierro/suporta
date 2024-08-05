// pages/login.tsx

import { useState } from 'react';
import { useRouter } from 'next/router';
import supabase from './api/supabase';


const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (user) {
        const { data, error: metadataError } = await supabase
          .from('user_metadata')
          .select('user_type')
          .eq('user_id', user.id)
          .single();

        if (metadataError) throw metadataError;

        if (data) {
          switch (data.user_type) {
            case 'admin':
              router.push('/MeuDashAdmin');
              break;
            case 'supervisor':
              router.push('/MeuDashSup');
              break;
            case 'vendedor':
              router.push('/MeuDashVen');
              break;
            default:
              setError('Tipo de usuário desconhecido.');
          }
        }
      }
    } catch (error) {
      setError('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
