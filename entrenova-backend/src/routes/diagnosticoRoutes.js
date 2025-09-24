import express from 'express';
import { salvar } from '../controllers/diagnosticoController.js';
const router = express.Router();

router.post('/', salvar);

export default router;