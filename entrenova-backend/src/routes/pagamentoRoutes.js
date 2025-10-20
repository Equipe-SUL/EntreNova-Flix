// src/routes/paymentRoutes.js

import express from 'express';
import { handleCheckout } from '../controllers/pagamentoController.js'; 
import { requireAuthAndRole } from '../middlewares/authMiddleware.js'; 
import { createFuncionario } from '../controllers/createFuncionarioController.js'; // NOVO IMPORT

const router = express.Router();

// Rota de Checkout (Registro do RH)
router.post('/checkout', handleCheckout);

// [NOVA ROTA PROTEGIDA] Endpoint para RH cadastrar Funcionários
router.post('/admin/create-funcionario', requireAuthAndRole, createFuncionario); 

// (Mantenha outras rotas se houver)

export default router;