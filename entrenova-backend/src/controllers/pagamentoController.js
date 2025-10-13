// entrenova-backend/src/controllers/paymentController.js

import { supabaseAdmin } from '../services/supabaseAuthServices.js'
// Importe aqui seu serviço de pagamento, se existir (ex: stripeService.js)

/**
 * Lógica: Recebe as credenciais, processa o pagamento, e SÓ ENTÃO cria a conta.
 * NÃO utiliza o conceito de 'role' (papel de usuário).
 */
export const handleCheckout = async (req, res) => {
    const { email, password, plano } = req.body; // Recebe credenciais e plano

    if (!email || !password || !plano) {
        return res.status(400).json({ message: 'Dados de usuário e plano são obrigatórios.' });
    }

    try {
        // 1. **(SIMULAÇÃO) PROCESSAMENTO DO PAGAMENTO**
        // A lógica real de pagamento (Stripe, PagSeguro, etc.) ocorreria aqui.
        console.log(`Simulando processamento do pagamento para ${email} no plano ${plano}...`);
        
        // Exemplo: if (!await processPayment(email, plano)) throw new Error('Falha no Pagamento.');
        // ASSUMIMOS QUE O PAGAMENTO FOI BEM-SUCEDIDO NESTE PONTO


        // 2. **CRIAÇÃO DA CONTA NO SUPABASE (APÓS PAGAMENTO)**
        // Usamos supabaseAdmin para criar o usuário.
        const { data: userData, error: signUpError } = await supabaseAdmin.auth.signUp({
            email,
            password,
            options: {
                data: { 
                    plano: plano
                }
            }
        });

        if (signUpError) {
            // Se o usuário já existe ou outro erro do Supabase
            return res.status(409).json({ message: `Falha ao criar conta: ${signUpError.message}` });
        }
        
        // 3. **GERAR TOKENS E LOGIN AUTOMÁTICO**
        // Logamos o usuário recém-criado para obter a sessão e os tokens.
        const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) {
            // Falha inesperada no login após criação da conta
            throw new Error(`Erro de login após criação: ${signInError.message}`);
        }

        // 4. **RESPOSTA DE SUCESSO**
        // Retorna os tokens para o frontend iniciar a sessão automaticamente
        res.status(200).json({
            status: 'SUCCESS',
            message: 'Conta criada e plano ativado com sucesso!',
            // Retorna a sessão (contém access_token e refresh_token)
            session: signInData.session 
        });

    } catch (error) {
        console.error("Erro no checkout/pagamento:", error.message);
        res.status(500).json({ 
            status: 'ERROR', 
            message: error.message 
        });
    }
};