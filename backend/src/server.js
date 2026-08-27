require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const budgetCategoryRoutes = require('./routes/budgetCategoryRoutes');
const expenseCategoryRoutes = require('./routes/expenseCategoryRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const summaryRoutes = require('./routes/summaryRoutes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/budgets', budgetCategoryRoutes);
app.use('/api/v1/categories', expenseCategoryRoutes);
app.use('/api/v1/expenses', expenseRoutes);
app.use('/api/v1/dashboard', summaryRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to e-utilities-cost API' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync models
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
