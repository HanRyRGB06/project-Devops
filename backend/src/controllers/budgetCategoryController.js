const db = require('../config/db');

exports.getAllCategories = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM budget_categories');
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM budget_categories WHERE id = ?', [req.params.id]);
    if (categories.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(categories[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, budget_limit } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const [result] = await db.query(
      'INSERT INTO budget_categories (name, budget_limit) VALUES (?, ?)',
      [name, budget_limit || null]
    );
    res.status(201).json({ message: 'Budget category created', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, budget_limit } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const [result] = await db.query(
      'UPDATE budget_categories SET name = ?, budget_limit = ? WHERE id = ?',
      [name, budget_limit || null, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Budget category updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM budget_categories WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Budget category deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
