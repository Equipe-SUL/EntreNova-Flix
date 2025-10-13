// src/services/supabaseAuthService.js

import {createClient} from '@supabase/supabase-js'
import { configDotenv } from 'dotenv'; // Você provavelmente não precisa desta importação aqui se estiver usando um bundler como nodemon/ts-node.

// Assume que as variáveis já estão disponíveis via ambiente Node
const supabaseUrl = process.env.SUPABASE_URL;
// ** Use a Service Role Key (Chave de Serviço) do Supabase para o Backend **
const supabaseServiceRoleKey = process.env.SUPABASE_KEY; 

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('ERRO: SUPABASE_URL ou SUPABASE_KEY faltando no .env do backend.');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

/**
 * Valida o JWT do cliente e retorna o objeto user.
 * (A verificação de role foi removida para permitir acesso a todos os usuários logados.)
 */
const validateUserAuthentication = async (jwtToken) => {
    // 1. Usa a Service Role Key para verificar se o JWT é válido.
    const { data, error } = await supabaseAdmin.auth.getUser(jwtToken);
    
    if (error) {
        // Lança erro se o token for inválido (expirado, malformado, etc.)
        throw new Error(`Token inválido ou expirado: ${error.message}`);
    }
    
    const user = data.user;

    // --- LÓGICA DE ROLE REMOVIDA AQUI ---
    /*
    const userRole = user.app_metadata.role;
    if (userRole !== 'RH') {
        // Este throw não acontecerá mais.
        throw new Error('Acesso negado: Usuário autenticado, mas sem papel de RH.');
    }
    */
    // ------------------------------------

    // Se o token for válido, o usuário é retornado.
    return user;
};

export {
    validateUserAuthentication, // ** Renomeado para refletir a nova função **
    supabaseAdmin 
};