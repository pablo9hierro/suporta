// pages/api/fetchUserData.ts

import supabase from '@/pages/api/supabase';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId, targetUserId } = req.query;

    if (typeof userId !== 'string' || typeof targetUserId !== 'string') {
        return res.status(400).json({ error: 'Invalid userId or targetUserId' });
    }

    try {
        const { data, error } = await supabase
            .from('user_metadata')
            .select('*')
            .eq('user_id', targetUserId)
            .single();

        if (error) {
            throw error;
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
