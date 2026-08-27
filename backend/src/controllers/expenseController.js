const { Expense, ExpenseCategory, BudgetCategory, User } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      include: [
        { model: ExpenseCategory, attributes: ['name'] },
        { model: BudgetCategory, attributes: ['name'] },
        { model: User, attributes: ['name'] }
      ],
      order: [['expense_date', 'DESC']]
    });
    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { category_id, budget_category_id, amount, expense_date, description } = req.body;
    const newExpense = await Expense.create({
      category_id,
      budget_category_id,
      amount,
      expense_date,
      description,
      created_by: req.user.id
    });
    res.status(201).json(newExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, budget_category_id, amount, expense_date, description } = req.body;
    
    const expense = await Expense.findByPk(id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    expense.category_id = category_id || expense.category_id;
    expense.budget_category_id = budget_category_id || expense.budget_category_id;
    expense.amount = amount || expense.amount;
    expense.expense_date = expense_date || expense.expense_date;
    expense.description = description !== undefined ? description : expense.description;
    
    await expense.save();
    res.json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Expense.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
