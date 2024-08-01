import supabase from '@/app/api/supabase';
import { useState } from 'react';

function IndexPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Criação do usuário no Supabase
      const { data: user, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      // Inserir informações na tabela user_metadata
      const { error: metadataError } = await supabase
        .from('user_metadata')
        .insert([
          { user_id: user?.user?.id, user_type: 'admin', email }
        ]);

      if (metadataError) throw metadataError;

      alert('Usuário admin criado com sucesso!');
      setEmail('');
      setPassword('');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Erro desconhecido');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Criar Novo Usuário Admin</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required />
        </label>
        <br />
        <label>
          Senha:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Criando...' : 'Criar Admin'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default IndexPage;
