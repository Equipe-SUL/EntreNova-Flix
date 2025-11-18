import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// --- REGISTRO OBRIGATÓRIO DO CHART.JS PARA GRÁFICO DE LINHA ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
// ----------------------------------------------------------------

interface RevenueData {
    month: string;
    revenue: number;
}

interface RevenueChartProps {
    data: RevenueData[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
    
    const labels = data.map(item => item.month);
    const chartValues = data.map(item => item.revenue);
    
    // Calcula o valor máximo (arredondando para o milhar superior para o eixo Y)
    const maxRevenue = Math.max(...chartValues, 5000); 
    const suggestedMax = Math.ceil(maxRevenue / 1000) * 1000;

    // --- Configuração dos Dados (Data) ---
    const chartData = {
        labels,
        datasets: [
            {
                label: 'Renda Gerada',
                data: chartValues,
                borderColor: '#ff007f', // Linha rosa forte
                backgroundColor: 'rgba(255, 0, 127, 0.1)', // Sutil preenchimento
                tension: 0.4, // Curvatura da linha (similar à imagem)
                pointRadius: 6,
                pointBackgroundColor: '#ff007f',
                borderWidth: 3
            },
        ],
    };

    // --- Configuração das Opções (Options) ---
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Análise financeira',
                color: '#fff',
                font: {
                    size: 24
                },
                align: 'start',
                padding: {
                    bottom: 10
                }
            },
            subtitle: {
                display: true,
                text: 'Renda gerada',
                color: '#ff007f',
                font: {
                    size: 16
                },
                align: 'start',
                padding: {
                    bottom: 15
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#fff', 
                },
                grid: {
                    color: '#333', 
                    borderColor: '#333',
                },
            },
            y: {
                min: 0,
                suggestedMax: suggestedMax,
                ticks: {
                    color: '#fff',
                    // Formata os ticks para mostrar 'mil' ou o valor exato
                    callback: function(value: any) {
                        if (value >= 1000) {
                            return (value / 1000).toFixed(0) + ' mil';
                        }
                        return value;
                    }
                },
                grid: {
                    color: '#333',
                    borderColor: '#333',
                },
            },
        },
    };

    return (
        <div style={{ width: '100%', maxWidth: '800px', height: '400px', background: '#111', padding: '30px', borderRadius: '12px', position: 'relative' }}>
            {/* Simulação do botão de filtro */}
            <div style={{ position: 'absolute', top: '50px', right: '30px', background: '#ff007f', padding: '5px 15px', borderRadius: '8px', color: '#fff', fontWeight: 'bold' }}>
                Mês
            </div>
            
            <Line data={chartData} options={options} />
        </div>
    );
}

export default RevenueChart;