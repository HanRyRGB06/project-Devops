import { useState, useEffect } from 'react';
import api from '../services/api';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        // Mocking API call for scaffold, or use real API if connected
        const res = await api.get('/dashboard/summary');
        setSummary(res.data);
      } catch (error) {
        console.error(error);
        // Fallback mock data for wow effect
        setSummary({
          totalExpense: 12500,
          expensesByCategory: { 'Water': 1500, 'Electricity': 3000, 'Internet': 1000 },
          budgetUsage: { 'Admin': { used: 12500, limit: 20000 } }
        });
      }
      setLoading(false);
    };
    fetchSummary();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  const barData = {
    labels: Object.keys(summary.budgetUsage || {}),
    datasets: [
      {
        label: 'Budget Used',
        data: Object.values(summary.budgetUsage || {}).map(b => b.used),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
      },
      {
        label: 'Budget Limit',
        data: Object.values(summary.budgetUsage || {}).map(b => b.limit),
        backgroundColor: 'rgba(51, 65, 85, 0.8)',
      }
    ]
  };

  const donutData = {
    labels: Object.keys(summary.expensesByCategory || {}),
    datasets: [{
      data: Object.values(summary.expensesByCategory || {}),
      backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
      borderWidth: 0,
    }]
  };

  return (
    <div className="dashboard-container">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">Total Expenses (This Month)</div>
          <div className="stat-value text-primary">฿{summary.totalExpense?.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Remaining Budget</div>
          <div className="stat-value text-secondary">
            ฿{Object.values(summary.budgetUsage || {}).reduce((acc, b) => acc + (b.limit - b.used), 0).toLocaleString()}
          </div>
        </div>
      </div>
      
      <div className="stats-grid">
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Budget Usage</h3>
          <Bar data={barData} options={{ responsive: true }} />
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Expenses by Category</h3>
          <div style={{ width: '60%', margin: '0 auto' }}>
            <Doughnut data={donutData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
