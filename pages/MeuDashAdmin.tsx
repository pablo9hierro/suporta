import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '@/pages/api/supabase';

interface UserMetadata {
    user_id: string;
    user_type: 'admin' | 'supervisor' | 'vendedor';
    email: string;
}

const MeuDashAdmin = () => {
    const [supervisores, setSupervisores] = useState<UserMetadata[]>([]);
    const [vendedores, setVendedores] = useState<UserMetadata[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [creatingSupervisor, setCreatingSupervisor] = useState(false);
    const router = useRouter();
    const [adminId, setAdminId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError || !session) {
                router.push('/login');
                return;
            }

            const userId = session.user.id;
            setAdminId(userId); // Armazena o ID do admin

            try {
                // Buscar o tipo de usuário
                const { data: userMetadata, error: metadataError } = await supabase
                    .from('user_metadata')
                    .select('user_type')
                    .eq('user_id', userId)
                    .single();

                if (metadataError || userMetadata?.user_type !== 'admin') {
                    router.push('/login');
                    return;
                }

                // Buscar supervisores e vendedores
                const { data: supervisoresData, error: supervisoresError } = await supabase
                    .from('user_metadata')
                    .select('*')
                    .eq('user_type', 'supervisor');

                if (supervisoresError) throw supervisoresError;

                const { data: vendedoresData, error: vendedoresError } = await supabase
                    .from('user_metadata')
                    .select('*')
                    .eq('user_type', 'vendedor');

                if (vendedoresError) throw vendedoresError;

                setSupervisores(supervisoresData || []);
                setVendedores(vendedoresData || []);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Erro desconhecido');
                }
            }
        };

        fetchData();
    }, [router]);

    const handleCreateSupervisor = async (event: React.FormEvent) => {
        event.preventDefault();
        setCreatingSupervisor(true);

        try {
            // Criar novo usuário no Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password
            });

            if (authError || !authData.user) {
                setError(authError?.message || 'Erro ao criar usuário');
                setCreatingSupervisor(false);
                return;
            }

            // Adicionar metadados do usuário
            const { error: metadataError } = await supabase
                .from('user_metadata')
                .insert({
                    user_id: authData.user.id,
                    user_type: 'supervisor',
                    email,
                    created_by_user_id: adminId // Usa o ID do admin armazenado
                });

            if (metadataError) {
                setError(metadataError.message);
                setCreatingSupervisor(false);
                return;
            }

            // Atualizar a lista de supervisores
            setSupervisores([...supervisores, { user_id: authData.user.id, user_type: 'supervisor', email }]);
            setEmail('');
            setPassword('');
        } catch (error) {
            setError('Erro desconhecido');
        } finally {
            setCreatingSupervisor(false);
        }
    };

    return (
        <div>
            <h1>Dashboard Admin</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h2>Supervisores</h2>
            <ul>
                {supervisores.map(supervisor => (
                    <li key={supervisor.user_id}>{supervisor.email}</li>
                ))}
            </ul>
            <h2>Vendedores</h2>
            <ul>
                {vendedores.map(vendedor => (
                    <li key={vendedor.user_id}>{vendedor.email}</li>
                ))}
            </ul>
            <h2>Criar Novo Supervisor</h2>
            <form onSubmit={handleCreateSupervisor}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Senha</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={creatingSupervisor}>
                    {creatingSupervisor ? 'Criando...' : 'Criar Supervisor'}
                </button>
            </form>
        </div>
    );
};

export default MeuDashAdmin;
