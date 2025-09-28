import './styles/global.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import DiagnosticoPage from './pages/DiagnosticoPage';
import ChatbotPage from './pages/ChatbotPage';
import ResultadoPage from './pages/ResultadoPage';
import ResultadoPage2 from './pages/Resultadopage2';

// Componente para rotas não encontradas (404)
const NotFoundPage = () => <h1 style={{ textAlign: 'center' }}>404 - Página Não Encontrada</h1>;

function App() {
  return (
    <>
      {/* O Header é o nosso layout persistente, ele aparece em todas as páginas */}
      <Header />

      <main>
       
        <Routes>
          {/* Rota principal "/" -> Renderiza a LandingPage (com Hero, About, Contato) */}
          <Route path="/" element={<LandingPage />} />

          {/* Rota para a página de diagnóstico -> Renderiza a DiagnosticoPage (com o Formulário) */}
          <Route path="/diagnostico" element={<DiagnosticoPage />} />
          
          {/* Rota para a página do chatbot */}
          <Route path="/chatbot" element={<ChatbotPage />} />

          {/* Rota dinâmica para a página de resultado (o :id é um parâmetro) */}
          <Route path="/resultado/:id" element={<ResultadoPage />} />

           {/* Rota dinâmica para a página de resultado2 (o :id é um parâmetro) */}
          <Route path="/resultadopage2" element={<ResultadoPage2 />} />

          {/* Rota de fallback para qualquer URL que não exista */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;