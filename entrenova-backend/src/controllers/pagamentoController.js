// src/controllers/pagamentoController.js

import { supabaseAdmin } from '../services/supabaseAuthServices.js'

/**
 * Lógica: Recebe as credenciais do RH, processa o pagamento, cria a conta RH e INSERE o perfil manualmente (usando .upsert()).
 * **NOVO:** Insere o plano e CNPJ na tabela 'plano_empresa'.
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
        const { data: userData, error: signUpError } = await supabaseAdmin.auth.signUp({
            email,
            password,
            options: {
                email_confirm: true, 
            }
        });

        if (signUpError) {
            return res.status(409).json({ message: `Falha ao criar conta: ${signUpError.message}` });
        }
        
        const newUserId = userData.user.id;
        
        // 3. **CRIAÇÃO/ATUALIZAÇÃO MANUAL DO PERFIL (public.profiles)**
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({
                id: newUserId,
                full_name: full_name,
                email: email,
                role: 'rh', 
                cnpj_empresa: cnpj_empresa
            }, 
            { onConflict: 'id' }); 
        
        if (profileError) {
             // Se falhar, tentamos deletar o usuário criado para evitar lixo
             await supabaseAdmin.auth.admin.deleteUser(newUserId);
             throw new Error(`Falha ao criar perfil: ${profileError.message}. Usuário deletado.`);
        }
        
        // ⭐ 4. **INSERÇÃO NA NOVA TABELA (public.plano_empresa)**
        // A tabela 'plano_empresa' deve ter as colunas 'cnpj_empresa' e 'plano'.
        const { error: planoEmpresaError } = await supabaseAdmin
            .from('plano_empresa')
            .insert({
                cnpj_empresa: cnpj_empresa,
                plano: plano
            });

        if (planoEmpresaError) {
             // Se falhar, tentamos deletar o usuário e o perfil criados
             await supabaseAdmin.auth.admin.deleteUser(newUserId);
             await supabaseAdmin.from('profiles').delete().eq('id', newUserId);
             throw new Error(`Falha ao registrar o plano da empresa: ${planoEmpresaError.message}. Usuário e Perfil deletados.`);
        }


        // 5. **GERAR TOKENS E LOGIN AUTOMÁTICO**
        const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) {
            throw new Error(`Erro de login após criação: ${signInError.message}`);
        }

        // 6. **RESPOSTA DE SUCESSO**
        res.status(200).json({
            status: 'SUCCESS',
            message: 'Conta RH criada, plano ativado e registrado com sucesso!',
            session: signInData.session 
        });

    } catch (error) {
        console.error("Erro no checkout/pagamento:", error.message);
        res.status(500).json({ message: `Erro interno do servidor: ${error.message}` });
    }
};