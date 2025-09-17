import express from "express"
const app = express();
const port = 3000;

// raiz '/'
app.get('/', (req, res) => {
  res.send('Olá, mundo com Express.js!');
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
