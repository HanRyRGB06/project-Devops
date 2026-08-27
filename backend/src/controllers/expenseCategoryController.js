const db = require('../config/db');

exports.getAllCategories = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM expense_categories');
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM expense_categories WHERE id = ?', [req.params.id]);
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
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const [result] = await db.query(
      'INSERT INTO expense_categories (name, description) VALUES (?, ?)',
      [name, description || null]
    );
    res.status(201).json({ message: 'Category created', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const [result] = await db.query(
      'UPDATE expense_categories SET name = ?, description = ? WHERE id = ?',
      [name, description || null, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM expense_categories WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
