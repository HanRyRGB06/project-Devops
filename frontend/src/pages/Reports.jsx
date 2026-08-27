import { useState, useEffect } from 'react';
import api from '../services/api';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/dashboard/summary');
        setSummary(res.data);
      } catch (error) {
        console.error('Failed to fetch summary data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <div>Loading reports...</div>;
  if (!summary || !summary.expensesByCategory) return <div>No data available for reports.</div>;

  const barData = {
    labels: Object.keys(summary.expensesByCategory),
    datasets: [
      {
        label: 'Total Expense Amount (฿)',
        data: Object.values(summary.expensesByCategory),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e2e8f0', // match dark mode text
        }
      },
      title: {
        display: true,
        text: 'Expenses Comparison by Category',
        color: '#f8fafc',
        font: { size: 16 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#94a3b8' }
      },
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: '1rem' }}>Advanced Reports</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Compare your utility expenses across different categories.
      </p>
      
      <div style={{ padding: '2rem', background: 'var(--surface-dark)', borderRadius: '0.5rem' }}>
        <Bar data={barData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Reports;
