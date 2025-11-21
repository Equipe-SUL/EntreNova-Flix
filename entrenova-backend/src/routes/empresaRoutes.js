import express from 'express';
import { validarCnpj, salvarResposta, getEmpresa } from '../controllers/empresaController.js';

const router = express.Router();

// Rota para validar o CNPJ
router.post('/validar-cnpj', validarCnpj);

//rota para pegar dados da empresa
router.get('/:cnpj', getEmpresa);

export default router;
