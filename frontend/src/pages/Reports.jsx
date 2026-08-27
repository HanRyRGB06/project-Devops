import { useState, useEffect } from 'react';
import api from '../services/api';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, expRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/expenses')
        ]);
        setSummary(summaryRes.data);
        setExpenses(expRes.data);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading reports...</div>;
  if (!summary || !summary.expensesByCategory) return <div>No data available for reports.</div>;

  // --- Process Yearly Data ---
  const expensesByYear = {};
  expenses.forEach(exp => {
    const year = new Date(exp.expense_date).getFullYear();
    expensesByYear[year] = (expensesByYear[year] || 0) + parseFloat(exp.amount);
  });

  const sortedYears = Object.keys(expensesByYear).sort((a, b) => b - a); // Descending
  const currentYear = sortedYears.length > 0 ? sortedYears[0] : new Date().getFullYear();
  const previousYear = sortedYears.length > 1 ? sortedYears[1] : currentYear - 1;

  const currentYearTotal = expensesByYear[currentYear] || 0;
  const previousYearTotal = expensesByYear[previousYear] || 0;
  const yearDiff = currentYearTotal - previousYearTotal;
  
  // Calculate percentage difference safely
  let diffPercentage = 0;
  if (previousYearTotal === 0 && currentYearTotal > 0) diffPercentage = 100;
  else if (previousYearTotal > 0) diffPercentage = ((yearDiff / previousYearTotal) * 100).toFixed(2);

  // --- Process Monthly Data ---
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyData = monthNames.map(month => ({ month, curr: 0, prev: 0 }));

  expenses.forEach(exp => {
    const date = new Date(exp.expense_date);
    const year = date.getFullYear().toString();
    const monthIndex = date.getMonth();
    
    if (year === currentYear.toString()) {
      monthlyData[monthIndex].curr += parseFloat(exp.amount);
    } else if (year === previousYear.toString()) {
      monthlyData[monthIndex].prev += parseFloat(exp.amount);
    }
  });

  // --- Chart Data ---
  const barData = {
    labels: Object.keys(summary.expensesByCategory),
    datasets: [
      {
        label: 'Expense by Category (฿)',
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
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#e2e8f0' } },
      title: { display: false }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#94a3b8' } },
      x: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#94a3b8' } }
    }
  };

  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem' }}>Financial Reports & Comparisons</h3>

      {/* Yearly Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-title">Total Expenses ({currentYear})</div>
          <div className="stat-value text-primary">฿{currentYearTotal.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Total Expenses ({previousYear})</div>
          <div className="stat-value text-secondary">฿{previousYearTotal.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Year-over-Year Difference</div>
          <div className="stat-value" style={{ color: yearDiff > 0 ? 'var(--danger)' : 'var(--success)' }}>
            {yearDiff > 0 ? '+' : ''}฿{yearDiff.toLocaleString()} 
            <span style={{ fontSize: '1rem', marginLeft: '0.5rem' }}>({diffPercentage}%)</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        {/* Category Chart */}
        <div className="card">
          <h4 style={{ marginBottom: '1rem' }}>Overall Expenses by Category</h4>
          <div style={{ height: '300px' }}>
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        {/* Monthly Comparison Table */}
        <div className="card">
          <h4 style={{ marginBottom: '1rem' }}>Monthly Comparison ({previousYear} vs {currentYear})</h4>
          <div style={{ overflowX: 'auto', maxHeight: '300px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ position: 'sticky', top: 0, background: 'var(--surface-dark)' }}>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem' }}>Month</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>{previousYear} (฿)</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>{currentYear} (฿)</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Diff</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((data, index) => {
                  const diff = data.curr - data.prev;
                  const isPositive = diff > 0;
                  return (
                    <tr key={index} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{data.month}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>{data.prev.toLocaleString()}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>{data.curr.toLocaleString()}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', color: isPositive ? 'var(--danger)' : diff < 0 ? 'var(--success)' : 'var(--text-muted)' }}>
                        {diff > 0 ? '+' : ''}{diff.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
