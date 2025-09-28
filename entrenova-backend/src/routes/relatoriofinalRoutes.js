import express from "express";
import { gerarRelatorioTotal } from "../controllers/relatoriofinalController.js";

const router = express.Router();

router.post("/gerar-relatorio-total", gerarRelatorioTotal);

export default router;
