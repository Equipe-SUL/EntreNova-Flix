// src/controllers/createFuncionarioController.js

import { supabaseAdmin } from '../services/supabaseAuthServices.js'

/**
 * Cria um novo usuário (funcionario) a partir de uma requisição autenticada do RH.
 * O perfil do funcionário é criado manualmente usando .upsert() após a criação do usuário.
 * * @param {object} req.user Contém o perfil do RH (id, email, cnpj_empresa, role) injetado pelo authMiddleware.
 */
export const createFuncionario = async (req, res) => {
    // Dados do novo funcionário (enviados pelo frontend do RH)
    const { email, password, full_name } = req.body; 
    
    // Dados do RH logado, VINDOS DO req.user (middleware)
    const rh_id = req.user.id; 
    const cnpj_empresa = req.user.cnpj_empresa; 

    if (!email || !password || !full_name) {
        return res.status(400).json({ message: 'Email, senha e nome completo do funcionário são obrigatórios.' });
    }

    let newUserId = null; // Variável para armazenar o ID do novo usuário

    try {
        // 1. CRIAÇÃO DE USUÁRIO SILENCIOSA (Função auth.admin.createUser)
        const { data: userData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, 
            // METADADOS REMOVIDOS - Não precisamos deles, pois o Trigger não é usado.
        });

        if (signUpError) {
            return res.status(409).json({ message: `Falha ao criar funcionário: ${signUpError.message}` });
        }
        
        newUserId = userData.user.id; // Salva o ID do novo usuário

        // 2. **CRIAÇÃO MANUAL DO PERFIL (public.profiles) com .upsert()**
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({
                id: newUserId, // O ID é a chave primária
                full_name: full_name,
                email: email,
                role: 'funcionario', // Define o papel explicitamente
                cnpj_empresa: cnpj_empresa, // Vincula ao CNPJ da empresa do RH logado
                rh_id: rh_id // Vincula ao ID do RH que o criou
            }, 
            { onConflict: 'id' }); // Garante resiliência contra duplicação

        if (profileError) {
             console.error("ERRO AO CRIAR PERFIL DO FUNCIONÁRIO:", profileError);
             // [Limpeza] Se a criação do perfil falhou, deleta o usuário criado
             await supabaseAdmin.auth.admin.deleteUser(newUserId);
             throw new Error(`Falha ao criar perfil: ${profileError.message}. Usuário deletado.`);
        }

        // 3. **INSERIR TRILHAS DA EMPRESA NA TABELA progresso_funcionario**
        // Busca as trilhas da empresa no campo JSON 'trilhas' da tabela plano_empresa
        const { data: planoData, error: planoError } = await supabaseAdmin
            .from('plano_empresa')
            .select('trilhas')
            .eq('cnpj_empresa', cnpj_empresa)
            .single();

        if (planoError) {
            console.error("Erro ao buscar trilhas da empresa:", planoError);
            // Não vamos falhar a criação do funcionário se as trilhas não forem encontradas
            // Apenas logamos o erro
        } else if (planoData && planoData.trilhas && Array.isArray(planoData.trilhas) && planoData.trilhas.length > 0) {
            // Prepara os dados para inserir na tabela progresso_funcionario
            // Cada trilha do array JSON é inserida como um registro separado
            const progressosParaInserir = planoData.trilhas.map(trilhaId => ({
                user_id: newUserId,
                trilha_id: String(trilhaId).trim(), // Garante que é string e remove espaços
                is_concluida: false // Inicialmente, nenhuma trilha está concluída
            }));

            const { error: progressoError } = await supabaseAdmin
                .from('progresso_funcionario')
                .insert(progressosParaInserir);

            if (progressoError) {
                console.error("Erro ao inserir trilhas no progresso_funcionario:", progressoError);
                // Não vamos falhar a criação do funcionário, apenas logamos o erro
            } else {
                console.log(`✅ ${planoData.trilhas.length} trilhas inseridas para o funcionário ${newUserId}`);
            }
        } else {
            console.log(`⚠️ Nenhuma trilha encontrada para a empresa ${cnpj_empresa}`);
        }

        return res.status(200).json({
            status: 'SUCCESS',
            message: `Funcionário ${full_name} criado com sucesso!`,
            user_id: newUserId
        });

    } catch (error) {
        console.error("Erro na criação de funcionário:", error.message);
        
        // Se o newUserId já foi definido, mas houve falha de perfil/conexão:
        if (newUserId) {
            try {
                 // Tenta limpar o usuário para evitar "lixo"
                 await supabaseAdmin.auth.admin.deleteUser(newUserId);
            } catch (cleanupError) {
                console.error("Falha na limpeza do usuário após erro:", cleanupError.message);
            }
        }
        
        res.status(500).json({ message: `Erro interno do servidor: ${error.message}` });
    }
};