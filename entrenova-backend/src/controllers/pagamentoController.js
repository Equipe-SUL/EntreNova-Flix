// src/controllers/pagamentoController.js

import { supabaseAdmin } from '../services/supabaseAuthServices.js'

/**
 * Lógica: Recebe as credenciais do RH, processa o pagamento, cria a conta RH e INSERE o perfil manualmente (usando .upsert()).
 */
export const handleCheckout = async (req, res) => {
    // Recebe as informações completas do RH do frontend
    const { email, password, plano, full_name, cnpj_empresa } = req.body; 

    if (!email || !password || !plano || !full_name || !cnpj_empresa) {
        return res.status(400).json({ message: 'Todos os dados do usuário (email, senha, nome, CNPJ) e plano são obrigatórios.' });
    }

    try {
        // 1. ... (Simulação de Pagamento) ...
        console.log(`Simulando processamento do pagamento para ${email} (RH) no plano ${plano}...`);
        
        // 2. **CRIAÇÃO DA CONTA RH NO SUPABASE (auth.users)**
        // Metadados são opcionais aqui, pois criaremos o perfil separadamente.
        const { data: userData, error: signUpError } = await supabaseAdmin.auth.signUp({
            email,
            password,
            options: {
                // Força a confirmação do e-mail no Supabase para login imediato
                email_confirm: true, 
                // data: { ... } (Não é necessário, pois estamos criando o perfil manualmente)
            }
        });

        if (signUpError) {
            return res.status(409).json({ message: `Falha ao criar conta: ${signUpError.message}` });
        }
        
        const newUserId = userData.user.id;
        
        // 3. **CRIAÇÃO/ATUALIZAÇÃO MANUAL DO PERFIL (public.profiles)**
        // USAMOS .upsert() PARA SUBSTITUIR O .insert().onConflict() e resolver o erro de função.
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({
                id: newUserId, // Este é o ID que causava o conflito
                full_name: full_name,
                email: email,
                role: 'rh', // A role é definida aqui, no código da aplicação
                cnpj_empresa: cnpj_empresa
            }, 
            // Indica ao upsert que ele deve usar a coluna 'id' para determinar se deve inserir ou atualizar
            { onConflict: 'id' }); 
        
        if (profileError) {
             // Se falhar, tentamos deletar o usuário criado para evitar lixo
             await supabaseAdmin.auth.admin.deleteUser(newUserId);
             throw new Error(`Falha ao criar perfil: ${profileError.message}. Usuário deletado.`);
        }


        // 4. **GERAR TOKENS E LOGIN AUTOMÁTICO**
        const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) {
            throw new Error(`Erro de login após criação: ${signInError.message}`);
        }

        // 5. **RESPOSTA DE SUCESSO**
        res.status(200).json({
            status: 'SUCCESS',
            message: 'Conta RH criada e plano ativado com sucesso!',
            session: signInData.session 
        });

    } catch (error) {
        console.error("Erro no checkout/pagamento:", error.message);
        res.status(500).json({ message: `Erro interno do servidor: ${error.message}` });
    }
};