import './styles/global.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Formulario from './components/Formulario';

// caso n encontre a rota
const PaginaNaoEncontrada = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>404 - Página Não Encontrada</h1>
  </div>
);

function App() {
  return (
    <>
      {/* O Header fica FORA das rotas para aparecer em todas as páginas */}
      <Header />

      <main>
        {/*  O <Routes> vai gerenciar qual componente será exibido */}
        <Routes>
          {/* Rota para a página inicial ("/") -> Mostra o componente Hero */}
          <Route path="/" element={<Hero />} />

          {/* Rota para a página "/quem-somos" -> Mostra o componente About */}
          <Route path="/quem-somos" element={<About />} />
          
          {/* Rota para a página "/diagnostico" -> Mostra o componente Formulario */}
          {/* Lembre-se de usar "/diagnostico" nos <Link> dos seus outros componentes */}
          <Route path="/diagnostico" element={<Formulario />} />

          {/* Rota para "qualquer outra coisa" (*) -> Mostra a página de erro 404 */}
          <Route path="*" element={<PaginaNaoEncontrada />} />
        </Routes>
      </main>
    </>
  );
}

export default App;