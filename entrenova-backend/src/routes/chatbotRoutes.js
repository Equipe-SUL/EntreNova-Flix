import express from 'express';
import { validarCnpj, salvarResposta, salvarPlano } from '../controllers/chatbotController.js';

const router = express.Router();

// Rota para validar o CNPJ
router.post('/validar-cnpj', validarCnpj);

// Rota para salvar uma resposta do questionário
router.post('/salvar-resposta', salvarResposta);

router.post('/salvar-plano', salvarPlano);

export default router;