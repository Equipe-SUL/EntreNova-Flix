// src/routes/paymentRoutes.js

import express from 'express';
import { handleCheckout } from '../controllers/pagamentoController.js'; 
import { requireAuthAndRole } from '../middlewares/authMiddleware.js'; // ** IMPORTANTE: Incluir a extensão .js **

const router = express.Router();

// Controller de Pagamento
const handlePaymentAccess = (req, res) => {
    // ...
    res.json({ 
        message: 'Acesso à lógica de pagamento concedido. Você é um RH verificado.',
        status: 'AUTHORIZED', 
        rh_email: req.user.email,
        rh_id: req.user.id
    });
};

router.get('/access', requireAuthAndRole, handlePaymentAccess);
router.post('/checkout', handleCheckout);

export default router; 