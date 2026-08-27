const { BudgetCategory } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const categories = await BudgetCategory.findAll();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description, amount_limit } = req.body;
    const newCategory = await BudgetCategory.create({ name, description, amount_limit });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, amount_limit } = req.body;
    
    const category = await BudgetCategory.findByPk(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    category.name = name || category.name;
    category.description = description !== undefined ? description : category.description;
    category.amount_limit = amount_limit || category.amount_limit;
    
    await category.save();
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await BudgetCategory.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
