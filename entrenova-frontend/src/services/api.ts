import axios from 'axios';

// Criamos uma instância do axios. É como fazer uma "cópia" pré-configurada do axios
// para usar em todo o nosso projeto.

const api = axios.create({

  // usar caminhos relativos como '/diagnostico' ou '/empresas'.
  baseURL: 'http://localhost:3001/api'
  
});


///Funções que o moreira deixou em services para exportar para o ChatBot.tsx
export const validarCNPJ = (cnpj: string) => api.post('/validar-cnpj', { cnpj });
export const salvarResposta = (cnpj: string, pergunta: string, resposta: string) =>
  api.post('/salvar-resposta', { cnpj, pergunta, resposta });

// 🔹 nova função para salvar o plano
export const salvarPlano = (cnpj: string, plano: string) =>
  api.post('/salvar-plano', { cnpj, plano });

// 🔹 nova função para gerar relatório completo após o chatbot
export const gerarRelatorioTotal = (cnpj: string) =>
  api.post('/relatoriofinal/gerar-relatorio-total', { cnpj });

export default api;
