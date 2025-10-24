import React from 'react';
// Importa os componentes de gráfico que vamos usar
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
// Importa o CSS que acabamos de criar
import '../styles/Progresso.css'; 

// Registra os componentes necessários do Chart.js (obrigatório)
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// --- Dados para o Gráfico de Pizza (Doughnut) ---
// (Usando dados de exemplo: 30% concluído)
const doughnutData = {
  labels: ['Concluídas', 'Pendentes'],
  datasets: [
    {
      label: '% de Atividades',
      data: [30, 70], // 30% concluído, 70% pendente
      backgroundColor: [
        '#ff007f', // Cor rosa para 'Concluídas'
        '#333'      // Cor escura para 'Pendentes'
      ],
      borderColor: [
        '#ff007f',
        '#333'
      ],
      borderWidth: 1,
    },
  ],
};

// Opções para customizar o gráfico de pizza
const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#aaa', // Cor dos labels
        font: {
          size: 14,
        }
      }
    },
  },
};

// --- Dados para o Gráfico de Barras ---
// (Usando dados de exemplo: horas por dia)
const barData = {
  labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
  datasets: [
    {
      label: 'Horas Dedicadas',
      data: [1.5, 2, 1, 3, 2.5, 0.5, 0], // Horas de exemplo
      backgroundColor: 'rgba(255, 0, 127, 0.8)', // Rosa com transparência
      borderRadius: 4,
    },
  ],
};

// Opções para customizar o gráfico de barras (para o tema escuro)
const barOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false, // Não precisa de legenda para uma só barra
    },
  },
  scales: {
    y: { // Eixo Y (vertical)
      beginAtZero: true,
      ticks: {
        color: '#aaa', // Cor dos números
      },
      grid: {
        color: '#222', // Cor das linhas de grade
      }
    },
    x: { // Eixo X (horizontal)
      ticks: {
        color: '#aaa', // Cor dos dias da semana
      },
      grid: {
        color: 'transparent', // Sem grade vertical
      }
    }
  }
};

// O componente principal
const Progresso: React.FC = () => {
  return (
    <section className="progresso-section">
      <h3>Meu Progresso</h3>
      <div className="progresso-grid">
        
        {/* Card do Gráfico de Pizza */}
        <div className="progresso-card">
          <h4>Atividades Completas</h4>
          <div style={{ position: 'relative', height: '250px' }}>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

        {/* Card do Gráfico de Barras */}
        <div className="progresso-card">
          <h4>Permanência na Semana (horas)</h4>
          <div style={{ position: 'relative', height: '250px' }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Progresso;