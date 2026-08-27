const db = require('../config/db');

// Get all expenses for the logged-in user
exports.getAllExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const [expenses] = await db.query(
      `SELECT e.*, ec.name AS expense_category_name, bc.name AS budget_category_name 
       FROM expenses e
       LEFT JOIN expense_categories ec ON e.expense_category_id = ec.id
       LEFT JOIN budget_categories bc ON e.budget_category_id = bc.id
       WHERE e.user_id = ?
       ORDER BY e.expense_date DESC`,
      [userId]
    );
    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching expenses' });
  }
};

// Get single expense
exports.getExpenseById = async (req, res) => {
  try {
    const userId = req.user.id;
    const [expenses] = await db.query('SELECT * FROM expenses WHERE id = ? AND user_id = ?', [req.params.id, userId]);
    if (expenses.length === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json(expenses[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching expense' });
  }
};

// Create a new expense
exports.createExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, amount, expense_date, expense_category_id, budget_category_id, note } = req.body;

    if (!title || !amount || !expense_date) {
      return res.status(400).json({ message: 'Title, amount, and expense date are required' });
    }

    const [result] = await db.query(
      'INSERT INTO expenses (title, amount, expense_date, expense_category_id, budget_category_id, note, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, amount, expense_date, expense_category_id || null, budget_category_id || null, note || null, userId]
    );

    res.status(201).json({ message: 'Expense created successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating expense' });
  }
};

// Update an expense
exports.updateExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, amount, expense_date, expense_category_id, budget_category_id, note } = req.body;

    if (!title || !amount || !expense_date) {
      return res.status(400).json({ message: 'Title, amount, and expense date are required' });
    }

    const [result] = await db.query(
      'UPDATE expenses SET title = ?, amount = ?, expense_date = ?, expense_category_id = ?, budget_category_id = ?, note = ? WHERE id = ? AND user_id = ?',
      [title, amount, expense_date, expense_category_id || null, budget_category_id || null, note || null, req.params.id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }

    res.json({ message: 'Expense updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating expense' });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const [result] = await db.query('DELETE FROM expenses WHERE id = ? AND user_id = ?', [req.params.id, userId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting expense' });
  }
};
