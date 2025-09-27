import express from 'express';
import { validarCnpj, salvarResposta } from '../controllers/empresaController.js';

const router = express.Router();

// Rota para validar o CNPJ
router.post('/validar-cnpj', validarCnpj);

export default router;
