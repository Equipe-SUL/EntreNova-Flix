// src/services/supabaseAuthServices.js

import {createClient} from '@supabase/supabase-js'
import { configDotenv } from 'dotenv'; 
import fetch from 'node-fetch'; // Adicione isto se estiver em um ambiente Node puro sem polyfills

// Assume que as variáveis já estão disponíveis via ambiente Node
const supabaseUrl = process.env.SUPABASE_URL;
// ** Chave de Serviço (Service Role Key) do Supabase para o Backend **
const supabaseServiceRoleKey = process.env.SUPABASE_KEY; 

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('ERRO: SUPABASE_URL ou SUPABASE_KEY faltando no .env do backend.');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    // Configurações para garantir que o fetch funcione em Node.js
    auth: { persistSession: false },
    global: { fetch }
});

/**
 * Valida o JWT do cliente e retorna o objeto user COMPLETO com a ROLE e CNPJ.
 */
const validateUserAuthentication = async (jwtToken) => {
    // 1. Usa a Service Role Key para verificar se o JWT é válido.
    const { data, error } = await supabaseAdmin.auth.getUser(jwtToken);
    
    if (error) {
        throw new Error(`Token inválido ou expirado: ${error.message}`);
    }
    
    const user = data.user;

    // 2. Busca o perfil (incluindo a role e cnpj_empresa) na tabela profiles
    const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*') 
        .eq('id', user.id)
        .single();
    
    if (profileError || !profileData) {
        throw new Error(`Perfil não encontrado para o usuário: ${user.id}. Erro: ${profileError?.message || 'Dados vazios'}`);
    }

    // 3. Retorna o objeto profile
    return profileData; 
};

export {
    validateUserAuthentication, 
    supabaseAdmin 
};