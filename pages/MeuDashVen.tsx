import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '@/pages/api/supabase';

interface UserMetadata {
    user_id: string;
    user_type: 'admin' | 'supervisor' | 'vendedor';
    email: string;
}

const MeuDashVen = () => {
    const [vendedores, setVendedores] = useState<UserMetadata[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError || !session) {
                router.push('/login');
                return;
            }

            const userId = session.user.id;
            setCurrentUserId(userId);

            try {
                // Buscar o tipo de usuário
                const { data: userMetadata, error: metadataError } = await supabase
                    .from('user_metadata')
                    .select('user_type')
                    .eq('user_id', userId)
                    .single();

                if (metadataError || userMetadata?.user_type !== 'vendedor') {
                    router.push('/login');
                    return;
                }

                // Buscar vendedores
                const { data: vendedoresData, error: vendedoresError } = await supabase
                    .from('user_metadata')
                    .select('*')
                    .eq('user_type', 'vendedor')
                    .eq('user_id', userId); // Filtra para o vendedor atual

                if (vendedoresError) throw vendedoresError;

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
            <h1>Dashboard Vendedores</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h2>Vendedores</h2>
            <ul>
                {vendedores.map(vendedor => (
                    <li key={vendedor.user_id}>{vendedor.email}</li>
                ))}
            </ul>
        </div>
    );
};

export default MeuDashVen;
