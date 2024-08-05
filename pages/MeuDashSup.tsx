import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '@/pages/api/supabase';

interface UserMetadata {
    user_id: string;
    user_type: 'admin' | 'supervisor' | 'vendedor';
    email: string;
    created_by_user_id?: string;
}

const MeuDashSup = () => {
    const [supervisores, setSupervisores] = useState<UserMetadata[]>([]);
    const [vendedores, setVendedores] = useState<UserMetadata[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [newVendedorEmail, setNewVendedorEmail] = useState<string>('');
    const [newVendedorPassword, setNewVendedorPassword] = useState<string>('');

    // Estados para o novo expediente
    const [vendedorId, setVendedorId] = useState<string>('');
    const [comissao10, setComissao10] = useState<number>(0);
    const [comissao15, setComissao15] = useState<number>(0);
    const [estoque10, setEstoque10] = useState<number>(0);
    const [estoque15, setEstoque15] = useState<number>(0);

    useEffect(() => {
        const fetchSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error || !data?.session) {
                router.push('/login');
                return;
            }
            setUserId(data.session.user.id);
        };

        fetchSession();
    }, [router]);

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;

            try {
                // Buscar supervisores
                const { data: supervisoresData, error: supervisoresError } = await supabase
                    .from('user_metadata')
                    .select('user_id, email')
                    .eq('user_type', 'supervisor')
                    .eq('created_by_user_id', userId);

                if (supervisoresError) throw supervisoresError;

                setSupervisores(supervisoresData as UserMetadata[]);

                // Buscar vendedores
                const { data: vendedoresData, error: vendedoresError } = await supabase
                    .from('user_metadata')
                    .select('user_id, email')
                    .eq('user_type', 'vendedor')
                    .eq('created_by_user_id', userId);

                if (vendedoresError) throw vendedoresError;

                setVendedores(vendedoresData as UserMetadata[]);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Erro desconhecido');
                }
            }
        };

        fetchData();
    }, [userId]);

    const handleCreateVendedor = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            // Cria novo usuário
            const { data: newUser, error: signUpError } = await supabase.auth.signUp({
                email: newVendedorEmail,
                password: newVendedorPassword,
            });

            if (signUpError || !newUser.user) throw signUpError;

            // Insere na tabela user_metadata
            const { error: metadataError } = await supabase
                .from('user_metadata')
                .insert([{ user_id: newUser.user.id, user_type: 'vendedor', email: newVendedorEmail, created_by_user_id: userId }]);

            if (metadataError) throw metadataError;

            setNewVendedorEmail('');
            setNewVendedorPassword('');
            alert('Vendedor criado com sucesso!');
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Erro desconhecido');
            }
        }
    };

    const handleCreateExpediente = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const { data, error } = await supabase
                .from('novexped')
                .insert([{
                    user_id: vendedorId,
                    comissao_10: comissao10,
                    comissao_15: comissao15,
                    estoque_10: estoque10,
                    estoque_15: estoque15,
                    saldo: 0
                }]);

            if (error) throw error;

            alert('Expediente criado com sucesso!');
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Erro desconhecido');
            }
        }
    };

    return (
        <div>
            <h1>Dashboard Supervisor</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <h2>Criar Novo Vendedor</h2>
            <form onSubmit={handleCreateVendedor}>
                <label>
                    Email:
                    <input
                        type="email"
                        value={newVendedorEmail}
                        onChange={(e) => setNewVendedorEmail(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Senha:
                    <input
                        type="password"
                        value={newVendedorPassword}
                        onChange={(e) => setNewVendedorPassword(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit">Criar Vendedor</button>
            </form>

            <h2>Criar Novo Expediente</h2>
            <form onSubmit={handleCreateExpediente}>
                <label>
                    Nome do Vendedor:
                    <select
                        value={vendedorId}
                        onChange={(e) => setVendedorId(e.target.value)}
                        required
                    >
                        <option value="">Selecione um vendedor</option>
                        {vendedores.map((vendedor) => (
                            <option key={vendedor.user_id} value={vendedor.user_id}>
                                {vendedor.email}
                            </option>
                        ))}
                    </select>
                </label>
                <br />
                <label>
                    Comissão 10:
                    <input
                        type="number"
                        value={comissao10}
                        onChange={(e) => setComissao10(parseFloat(e.target.value))}
                        required
                    />
                </label>
                <br />
                <label>
                    Comissão 15:
                    <input
                        type="number"
                        value={comissao15}
                        onChange={(e) => setComissao15(parseFloat(e.target.value))}
                        required
                    />
                </label>
                <br />
                <label>
                    Estoque 10:
                    <input
                        type="number"
                        value={estoque10}
                        onChange={(e) => setEstoque10(parseFloat(e.target.value))}
                        required
                    />
                </label>
                <br />
                <label>
                    Estoque 15:
                    <input
                        type="number"
                        value={estoque15}
                        onChange={(e) => setEstoque15(parseFloat(e.target.value))}
                        required
                    />
                </label>
                <br />
                <button type="submit">Criar Expediente</button>
            </form>

            <h2>Vendedores Criados</h2>
            <ul>
                {vendedores.map((vendedor) => (
                    <li key={vendedor.user_id}>{vendedor.email}</li>
                ))}
            </ul>
        </div>
    );
};

export default MeuDashSup;
