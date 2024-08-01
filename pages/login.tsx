import { useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '@/app/api/supabase';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Autentica o usuário
            const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError || !user) throw signInError;

            // Busca o tipo de usuário na tabela user_metadata
            const { data: userMetadata, error: metadataError } = await supabase
                .from('user_metadata')
                .select('user_type')
                .eq('user_id', user.id)
                .single();

            if (metadataError || !userMetadata) throw metadataError;

            // Redireciona com base no tipo de usuário
            switch (userMetadata.user_type) {
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
                    setError('Tipo de usuário desconhecido');
                    break;
            }
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
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Senha:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
};

export default LoginPage;
