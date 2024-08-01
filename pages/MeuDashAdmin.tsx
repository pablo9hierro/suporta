import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '@/app/api/supabase';

interface UserMetadata {
    user_id: string;
    user_type: 'admin' | 'supervisor' | 'vendedor';
    email: string;
}

const MeuDashAdmin = () => {
    const [supervisores, setSupervisores] = useState<UserMetadata[]>([]);
    const [vendedores, setVendedores] = useState<UserMetadata[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError || !session) {
                router.push('/login');
                return;
            }

            const userId = session.user.id;

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
        </div>
    );
};

export default MeuDashAdmin;
