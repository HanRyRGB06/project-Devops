import { useState, useEffect } from 'react';
import api from '../services/api';

const Categories = () => {
  const [budgets, setBudgets] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const [budgetForm, setBudgetForm] = useState({ name: '', description: '', amount_limit: '' });
  const [expenseForm, setExpenseForm] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleAddBudget = async (e) => {
    e.preventDefault();
    try {
      await api.post('/budgets', budgetForm);
      setShowBudgetModal(false);
      setBudgetForm({ name: '', description: '', amount_limit: '' });
      fetchData();
    } catch (error) {
      alert('Error adding budget category');
    }
  };

  const handleAddExpenseCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', expenseForm);
      setShowExpenseModal(false);
      setExpenseForm({ name: '', description: '' });
      fetchData();
    } catch (error) {
      alert('Error adding expense category');
    }
  };

  if (loading) return <div>Loading categories...</div>;

  return (
    <div className="stats-grid">
      {/* Budget Categories Card */}
      <div className="card" style={{ position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3>Budget Categories</h3>
          <button className="btn-primary" style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setShowBudgetModal(true)}>+ Add</button>
        </div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {budgets.map(b => (
            <li key={b.id} style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 'bold' }}>{b.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Limit: ฿{parseFloat(b.amount_limit).toLocaleString()}</div>
            </li>
          ))}
        </ul>

        {/* Budget Modal */}
        {showBudgetModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="card" style={{ width: '400px', background: 'var(--surface-dark)' }}>
              <h3 style={{ marginBottom: '1rem' }}>Add Budget Category</h3>
              <form onSubmit={handleAddBudget}>
                <div className="input-group">
                  <label>Name</label>
                  <input type="text" required value={budgetForm.name} onChange={(e) => setBudgetForm({...budgetForm, name: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Limit Amount (฿)</label>
                  <input type="number" required value={budgetForm.amount_limit} onChange={(e) => setBudgetForm({...budgetForm, amount_limit: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Description</label>
                  <input type="text" value={budgetForm.description} onChange={(e) => setBudgetForm({...budgetForm, description: e.target.value})} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="button" className="btn-primary" style={{ background: 'var(--surface-hover)' }} onClick={() => setShowBudgetModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Save Budget</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Expense Categories Card */}
      <div className="card" style={{ position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3>Expense Categories</h3>
          <button className="btn-primary" style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setShowExpenseModal(true)}>+ Add</button>
        </div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {expenseCategories.map(c => (
            <li key={c.id} style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 'bold' }}>{c.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{c.description || 'No description'}</div>
            </li>
          ))}
        </ul>

        {/* Expense Category Modal */}
        {showExpenseModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="card" style={{ width: '400px', background: 'var(--surface-dark)' }}>
              <h3 style={{ marginBottom: '1rem' }}>Add Expense Category</h3>
              <form onSubmit={handleAddExpenseCategory}>
                <div className="input-group">
                  <label>Name</label>
                  <input type="text" required value={expenseForm.name} onChange={(e) => setExpenseForm({...expenseForm, name: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Description</label>
                  <input type="text" value={expenseForm.description} onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="button" className="btn-primary" style={{ background: 'var(--surface-hover)' }} onClick={() => setShowExpenseModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Save Category</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
