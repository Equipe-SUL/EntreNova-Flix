import React from 'react';
// Importa o componente Bar e os elementos que você precisa registrar
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// --- REGISTRO OBRIGATÓRIO DO CHART.JS ---
// Registra os componentes necessários para um gráfico de barras.
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
// ----------------------------------------

interface ChartData {
    name: string;
    quantidade: number;
}

interface LeadsChartProps {
    data: ChartData[];
}

const LeadsChartJs: React.FC<LeadsChartProps> = ({ data }) => {
    
    // Extrai os labels (nomes dos planos) e os dados (quantidades)
    const labels = data.map(item => item.name);
    const chartValues = data.map(item => item.quantidade);
    
    // --- Configuração dos Dados (Data) ---
    const chartData = {
        labels,
        datasets: [
            {
                label: 'Empresas',
                data: chartValues,
                backgroundColor: '#ff007f', // Cor primária similar à imagem
                borderColor: '#ff007f',
                borderWidth: 1,
                borderRadius: 5, // Similar ao estilo da imagem
                barPercentage: 0.8,
                categoryPercentage: 0.8,
            },
        ],
    };

    // --- Configuração das Opções (Options) ---
    const options = {
        responsive: true,
        maintainAspectRatio: false, // Permite controlar a altura
        plugins: {
            legend: {
                display: false, // Esconde a legenda para um visual mais limpo
            },
            title: {
                display: true,
                text: 'Gráfico de Leads',
                color: '#fff',
                font: {
                    size: 24
                },
                align: 'start',
                padding: {
                    bottom: 30
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#fff', // Cor dos rótulos do eixo X
                },
                grid: {
                    color: '#333', // Cor das linhas de grade
                    borderColor: '#333',
                },
            },
            y: {
                ticks: {
                    color: '#fff', // Cor dos rótulos do eixo Y
                    stepSize: 25, // Para igualar o intervalo 0, 25, 50, 75, 100
                },
                grid: {
                    color: '#333',
                    borderColor: '#333',
                },
                // Define o máximo do eixo Y em 100 para replicar a imagem
                max: 20, 
                min: 0,
            },
        },
    };

    return (
        <div style={{ width: '100%', height: '400px', background: '#111', padding: '30px', borderRadius: '12px' }}>
            <Bar data={chartData} options={options} />
            {/* O círculo de 75% da imagem original não faz parte do Chart.js.
                Você precisaria de um elemento React separado para replicá-lo. 
                Aqui está um placeholder de exemplo: */}
        </div>
    );
}

export default LeadsChartJs;