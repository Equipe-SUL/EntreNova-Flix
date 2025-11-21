import './styles/global.css';
import { Routes, Route, useLocation } from 'react-router-dom'; // 1. Importe o useLocation
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import DiagnosticoPage from './pages/DiagnosticoPage';
import ChatbotPage from './pages/ChatbotPage';
import ResultadoPage from './pages/ResultadoPage';
import ResultadoPage2 from './pages/Resultadopage2';
import CheckoutPage from './components/PaginaCheckout';


import SignIn from './components/SignIn';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import DashboardRH from './pages/DashboardRH'; 
import DashboardAdmin from './pages/DashboardAdmin';

// Componente para rotas não encontradas (404)
const NotFoundPage = () => <h1 style={{ textAlign: 'center' }}>404 - Página Não Encontrada</h1>;

function App() {
  // 2. Pegamos a localização atual
  const location = useLocation();

  // 3. Verificamos se a rota é alguma do dashboard
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  return (
    <>
      {/* 4. O Header SÓ é renderizado se NÃO for uma rota de dashboard */}
      {!isDashboardRoute && <Header />}

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

          <Route path="/signin" element={<SignIn />} />

           <Route path="/checkout" element={<CheckoutPage />} />


          {/* Rota 1: Dashboard do Funcionário */}
          <Route path="/dashboard/funcionario" element={ 
          // <ProtectedRoute allowedRoles={['funcionario']}> {/* Apenas o Funcionário deve ir para cá, RH tem sua rota */}
              <Dashboard/>
          // </ProtectedRoute>
          }
          />

          {/* Rota 2: Dashboard do RH */}
          <Route path="/dashboard/rh" element={ 
           // <ProtectedRoute allowedRoles={['rh']}> 
              <DashboardRH/> 
           // </ProtectedRoute>
          }
          />

          <Route path="/dashboard/admin" element={ 
            //<ProtectedRoute allowedRoles={['admin']}> 
              <DashboardAdmin/> 
           // </ProtectedRoute>
          }
          />

          

          {/* Rota de fallback para qualquer URL que não exista */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;