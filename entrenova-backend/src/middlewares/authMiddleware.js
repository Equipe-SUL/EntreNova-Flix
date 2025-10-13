// src/middlewares/authMiddleware.js

import {validateUserAuthentication} from '../services/supabaseAuthServices.js' // <-- Precisa do .js

/**
 * Middleware para exigir autenticação e o papel 'RH'.
 */
const requireAuthAndRole = async (req, res, next) => {
    console.log('--- REQUISIÇÃO RECEBIDA: /api/payment/access ---'); // <-- NOVO LOG
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // 401: Não Autorizado
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const user = await validateUserAuthentication(token);
        
        req.user = user; 
        next();
    } catch (error) {
        // Captura o erro de token inválido OU de falta de papel RH
        console.error('Erro de Autenticação/Autorização:', error.message);
        // Retorna 401 para todas as falhas de segurança/autorização
        return res.status(401).json({ 
            message: 'Não autorizado ou Token inválido/expirado.', 
            details: error.message 
        });
    }
};

export {
    requireAuthAndRole
};