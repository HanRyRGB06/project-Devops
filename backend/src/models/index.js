const sequelize = require('../config/db');
const User = require('./User');
const BudgetCategory = require('./BudgetCategory');
const ExpenseCategory = require('./ExpenseCategory');
const Expense = require('./Expense');

// Associations
User.hasMany(Expense, { foreignKey: 'created_by' });
Expense.belongsTo(User, { foreignKey: 'created_by' });

BudgetCategory.hasMany(Expense, { foreignKey: 'budget_category_id' });
Expense.belongsTo(BudgetCategory, { foreignKey: 'budget_category_id' });

ExpenseCategory.hasMany(Expense, { foreignKey: 'category_id' });
Expense.belongsTo(ExpenseCategory, { foreignKey: 'category_id' });

module.exports = {
  sequelize,
  User,
  BudgetCategory,
  ExpenseCategory,
  Expense
};
