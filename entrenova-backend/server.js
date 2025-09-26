import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Todas as rotas que tivermos DEVRÃO ESTAR AQUI DESSA FORMA <-- ass.vivian
import diagnosticoRoutes from './src/routes/diagnosticoRoutes.js'; 
import relatorioRoutes from './src/routes/relatorioRoutes.js'
import chatbotRoutes from './src/routes/chatbotRoutes.js';



dotenv.config()
const app = express();
const PORT = process.env.PORT || 3001; // porta do nosso backend

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());


// USO DAS ROTAS (A PARTE MAIS IMPORTANTE)
//  "Qualquer requisição que chegar no endereço '/api/diagnostico',
// deve ser gerenciada pelo arquivo 'diagnosticoRoutes'.", e assim vai ser o padrao de tods futuras rotas <-- ass. vivian

app.use('/api/diagnostico', diagnosticoRoutes);
app.use('/api/relatorio', relatorioRoutes);
app.use('/api', chatbotRoutes)




// padrao de iniciar o server.js
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});