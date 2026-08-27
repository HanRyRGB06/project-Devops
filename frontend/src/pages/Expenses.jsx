import { useState, useEffect } from 'react';
import api from '../services/api';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ amount: '', description: '', category_id: 1, budget_category_id: 1, expense_date: new Date().toISOString().split('T')[0] });
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [expRes, catRes, budRes] = await Promise.all([
        api.get('/expenses'),
        api.get('/categories'),
        api.get('/budgets')
      ]);
      setExpenses(expRes.data);
      setCategories(catRes.data);
      setBudgets(budRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expenses', formData);
      setShowModal(false);
      fetchData(); // Refresh the list
    } catch (error) {
      alert('Error adding expense');
    }
  };

  if (loading) return <div>Loading expenses...</div>;

  return (
    <div className="card" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3>Expense Records</h3>
        <button className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem' }} onClick={() => setShowModal(true)}>+ Add Expense</button>
      </div>
      
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '400px', background: 'var(--surface-dark)' }}>
            <h3 style={{ marginBottom: '1rem' }}>Add New Expense</h3>
            <form onSubmit={handleAddExpense}>
              <div className="input-group">
                <label>Amount (฿)</label>
                <input type="number" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Description</label>
                <input type="text" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Date</label>
                <input type="date" required value={formData.expense_date} onChange={(e) => setFormData({...formData, expense_date: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Expense Category</label>
                <select style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--bg-dark)', color: 'white', border: '1px solid var(--border)' }} 
                  value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>Budget Category</label>
                <select style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--bg-dark)', color: 'white', border: '1px solid var(--border)' }} 
                  value={formData.budget_category_id} onChange={(e) => setFormData({...formData, budget_category_id: e.target.value})}>
                  {budgets.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-primary" style={{ background: 'var(--surface-hover)' }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Budget</th>
              <th style={{ padding: '1rem' }}>Description</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No expenses recorded yet.</td>
              </tr>
            ) : (
              expenses.map(expense => (
                <tr key={expense.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>{new Date(expense.expense_date).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>{expense.ExpenseCategory?.name}</td>
                  <td style={{ padding: '1rem' }}>{expense.BudgetCategory?.name}</td>
                  <td style={{ padding: '1rem' }}>{expense.description}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: 'var(--danger)' }}>
                    -฿{parseFloat(expense.amount).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Expenses;
