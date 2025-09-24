import axios from 'axios';

// Criamos uma instância do axios. É como fazer uma "cópia" pré-configurada do axios
// para usar em todo o nosso projeto.

const api = axios.create({

  // usar caminhos relativos como '/diagnostico' ou '/empresas'.
  baseURL: 'http://localhost:3001/api'
  
});


export default api;