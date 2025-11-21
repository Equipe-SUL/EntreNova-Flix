// src/middlewares/authMiddleware.js

import {validateUserAuthentication} from '../services/supabaseAuthServices.js' 


const requireAuthAndRole = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Valida o token e retorna o perfil COMPLETO do usuário (com role e cnpj_empresa)
        const userProfile = await validateUserAuthentication(token);
        
        // 1. VERIFICAÇÃO CRUCIAL DA ROLE (SEGURANÇA)
        if (userProfile.role !== 'rh') {
             // 403: Proibido (Usuário logado, mas sem permissão para esta rota)
             return res.status(403).json({ 
                message: 'Acesso Proibido. Esta ação é exclusiva para Administradores RH.',
                details: `Sua role atual é: ${userProfile.role}`
            });
        }
        
        // 2. Anexa o perfil completo à requisição
        req.user = userProfile; 
        
        next();
    } catch (error) {
        // Captura o erro de token inválido ou perfil não encontrado (401)
        console.error('Erro de Autenticação/Autorização:', error.message);
        return res.status(401).json({ 
            message: 'Não autorizado ou Token inválido/expirado.', 
            details: error.message 
        });
    }
};

export {
    requireAuthAndRole
};