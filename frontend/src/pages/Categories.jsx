import { useState, useEffect } from 'react';
import api from '../services/api';

const Categories = () => {
  const [budgets, setBudgets] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [budgetsRes, categoriesRes] = await Promise.all([
          api.get('/budgets'),
          api.get('/categories')
        ]);
        setBudgets(budgetsRes.data);
        setExpenseCategories(categoriesRes.data);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading categories...</div>;

  return (
    <div className="stats-grid">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3>Budget Categories</h3>
          <button className="btn-primary" style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>+ Add</button>
        </div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {budgets.map(b => (
            <li key={b.id} style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 'bold' }}>{b.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Limit: ฿{parseFloat(b.amount_limit).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3>Expense Categories</h3>
          <button className="btn-primary" style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>+ Add</button>
        </div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {expenseCategories.map(c => (
            <li key={c.id} style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 'bold' }}>{c.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{c.description || 'No description'}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Categories;
