const { Expense, ExpenseCategory, BudgetCategory, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getSummary = async (req, res) => {
  try {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const expenses = await Expense.findAll({
      where: [
        sequelize.where(sequelize.fn('MONTH', sequelize.col('expense_date')), currentMonth),
        sequelize.where(sequelize.fn('YEAR', sequelize.col('expense_date')), currentYear)
      ],
      include: [
        { model: ExpenseCategory, attributes: ['name'] },
        { model: BudgetCategory, attributes: ['name', 'amount_limit'] }
      ]
    });

    let totalExpense = 0;
    const expensesByCategory = {};
    const budgetUsage = {};

    expenses.forEach(exp => {
      const amount = parseFloat(exp.amount);
      totalExpense += amount;

      // Group by Expense Category
      const catName = exp.ExpenseCategory.name;
      expensesByCategory[catName] = (expensesByCategory[catName] || 0) + amount;

      // Group by Budget Category
      const budgetName = exp.BudgetCategory.name;
      if (!budgetUsage[budgetName]) {
        budgetUsage[budgetName] = {
          used: 0,
          limit: parseFloat(exp.BudgetCategory.amount_limit)
        };
      }
      budgetUsage[budgetName].used += amount;
    });

    res.json({
      currentMonth,
      currentYear,
      totalExpense,
      expensesByCategory,
      budgetUsage
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
