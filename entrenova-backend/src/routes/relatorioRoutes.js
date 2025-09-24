import express from 'express';
import { buscarPorId } from '../controllers/relatorioController.js';

const router = express.Router();

// GET: O método HTTP para buscar dados.
// '/:id': O caminho da rota. O ':' indica que 'id' é um parâmetro dinâmico.
// buscarPorId: A função do controller que será executada.
router.get('/:id', buscarPorId);

export default router;