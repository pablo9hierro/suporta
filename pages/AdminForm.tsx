import React, { useState, useEffect } from 'react';
import supabase from '@/app/api/supabase';

const AdminForm: React.FC = () => {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      // Obter a sessão atual do Supabase
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Erro ao obter sessão:', error.message);
        return;
      }

      // Definir o userId se a sessão for válida
      const session = data.session;
      setUserId(session?.user.id ?? null);
    };

    fetchUserId();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!userId) {
      alert('Usuário não autenticado');
      return;
    }
  
    // Verificar se o userId existe na tabela users
    const { data: userCheck, error: userCheckError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();
  
    if (userCheckError || !userCheck) {
      alert('Usuário não encontrado');
      console.error('Erro ao verificar usuário:', userCheckError.message);
      return;
    }
  
    // Inserir o novo supervisor
    const { data, error } = await supabase
      .from('supervisor')
      .insert([{ nome, telefone, senha, user_id: userId }]);
  
    if (error) {
      alert('Erro ao cadastrar supervisor');
      console.error('Erro ao cadastrar supervisor:', error.message);
      return;
    }
  
    alert('Supervisor cadastrado com sucesso!');
    setNome('');
    setTelefone('');
    setSenha('');
  };
  
  return (
    <div>
      <h1>Cadastro de Supervisor</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </label>
        <label>
          Telefone:
          <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />
        </label>
        <label>
          Senha:
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </label>
        <button type="submit">Cadastrar Supervisor</button>
      </form>
    </div>
  );
};

export default AdminForm;
